const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { sendToken, sendCookie } = require('../utils/jwtToken');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_PUBLISHABLE_KEY);
require('dotenv').config();
exports.createPaymentIntent = catchAsyncErrors(async (req, res, next) => {
    const confirmOrder = jwt.verify(req.cookies.confirmOrder, process.env.JWT_SECRET);

    if (!confirmOrder) {
        return next(ErrorHandler('Confirm order Session Expired!'));
    }
    // let amount = confirmOrder.totalPrice * 100;
    // let amount = 100; // paise
    // console.log(amount);
    // console.log('1');

    const paymentIntent = await stripe.paymentIntents.create({
        amount,// paise
        currency: "inr",
        payment_method_types: ['card'],
    });
    // console.log('2');
    return res.json({
        clientSecret: paymentIntent.client_secret,
        emailAddress: req.user.recoveryEmail || 'mdehteshamshaikh1@gmail.com',
        id: paymentIntent.id
    });
});
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    // console.log('aaya');
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, orderStatus } = req.body;
    const order = new orderModel({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        paidAt: Date.now(),
        userModel: req.user._id
    });
    await order.save();
    res.status(201).json({
        success: true,
        order
    });
});
exports.singleOrder = catchAsyncErrors(async (req, res, next) => {
    // const order = await orderModel.findById(req.params.id);
    const order = await orderModel.findById(req.params.id).populate('user', 'username email');
    if (!order) {
        return next(new ErrorHandler('Order not found with this id', 404));
    }
    res.status(200).json({
        success: true,
        order
    });
});
exports.allUserOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await orderModel.find({ user: req.user._id });
    if (!order) {
        return next(new ErrorHandler("You don't have any orders", 404));
    }
    res.status(200).json({
        success: true,
        order
    });
});
//Get All Orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await orderModel.find();
    if (!orders) {
        return next(new ErrorHandler("You don't have any orders", 404));
    }
    res.status(200).json({
        success: true,
        orders
    });
});
exports.shipping = catchAsyncErrors(async (req, res, next) => {
    const { address, city, pincode, state, country, phone_number } = req.body;
    console.log(req.body);
    // if (!address || !city || !pincode || !state || !country || !phone_number) {
    //     return next(new ErrorHandler('please fill the form', 405));
    // }
    const shippingInfo = {
        address,
        city,
        pincode,
        state,
        country,
        phone_number
    };
    const token = jwt.sign(shippingInfo, process.env.JWT_SECRET, { expiresIn: 7200000 });
    sendCookie('orderDetails', token, 7200000, res);
    return res.redirect(`/api/v1/order/${req.params.id}/confirm-order`);
});
exports.confirmOrder = catchAsyncErrors(async (req, res, next) => {
    if (!req.cookies.orderDetails) {
        next(new ErrorHandler('Cookie expired', 304));
    }
    const shippingInfo = jwt.verify(req.cookies.orderDetails, process.env.JWT_SECRET);
    let orderItems = [];
    let productArr = req.params.id.split(',');
    let itemsPrice = 0;
    let shippingPrice = 0;
    let totalPrice = 0;
    const promises = productArr.map(async (product) => {
        let data = await productModel.findById(product);
        if (req.body[product]) {
            let item = {
                name: data.name,
                price: data.price * parseInt(req.body[product]),
                quantity: parseInt(req.body[product]),
                image: data.images[0],
                id: data.id
            };
            itemsPrice += data.price * parseInt(req.body[product]);
            orderItems.push(item);
        }
    });
    Promise.all(promises)
        .then(() => {
            totalPrice += itemsPrice;
            if (itemsPrice < 500) {
                totalPrice += 40;
                shippingPrice = 40;

            }
            const confirmOrder = {
                shippingInfo,
                orderItems,
                totalPrice,
                shippingPrice,
                itemsPrice
            };
            const token = jwt.sign(confirmOrder, process.env.JWT_SECRET, { expiresIn: 7200000 });
            sendCookie('confirmOrder', token, 7200000, res);

            return res.redirect(`/api/v1/order/${req.params.id}/payment`);

            // return res.render('confirmOrder', { layout: 'confirmOrder', productsId: req.params.id, products: orderItems, totalPrice, page: 'confirmOrder' });
        })
        .catch((error) => {
            console.error(error);
        });

    // return res.redirect(`/api/v1/order/${req.params.id}/payment`)
});
exports.payment = catchAsyncErrors(async (req, res, next) => {
    return next(ErrorHandler('Galat jageh aa gaya'));
    // Handle the payment form submission
    const { card_number, expiry_month, expiry_year, cvc, cardholder_name } = req.body;

    // if (!card_number || !expiry_month || !expiry_year || !cvc||!cardholder_name) {
    //     return next(new ErrorHandler('Please fill all the credentials', 404));
    // }
    if (!req.cookies.confirmOrder) {
        return next(new ErrorHandler('Cookie expired, Please fill the details again', 404));
    }
    const confirmOrder = await jwt.verify(req.cookies.confirmOrder, process.env.JWT_SECRET);
    if (!confirmOrder) {
        return next(new ErrorHandler('Cookie expired, Please fill the details again', 404));

    }
    if (!confirmOrder.shippingInfo) {
        return next(new ErrorHandler('Cookie expired, Please fill the details again', 404));

    }
    console.log(req.body.token);
    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'inr',
        payment_method: 'pm_card_visa',
        payment_method_types: ['card'],
        payment_method_data: {
            type: 'card',
            card: {
                token: req.body.token,
            },
        },
    });

    // Process the payment
    // const paymentMethod = await stripe.paymentMethods.create({
    //     type: 'card',
    //     card: {
    //         number: card_number,
    //         exp_month: expiry_month,
    //         exp_year: expiry_year,
    //         cvc,
    //     },
    //     billing_details: {
    //         name: cardholder_name,
    //     },
    // });
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethod.id,
    });
    if (confirmedPaymentIntent.status === 'succeeded') {
        // Payment successful
        res.status(200).json({ success: true });
    } else {
        // Payment failed
        res.status(400).json({ success: false, error: 'Payment failed.' });
    }
});