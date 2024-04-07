let input = document.querySelectorAll('input[type="number"]');
input.forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.keyCode === 38) {
            e.preventDefault();
        } else if (e.keyCode === 40) {
            e.preventDefault();
        }
        else if (e.keyCode === 69) {
            e.preventDefault();

        }
    });
});
let holder_name = document.getElementById('card-holder-name');
let name_input = document.getElementById('cardholder_name');
// let card_input = document.getElementById('card_number');
let firstFour = document.getElementById('firstFour');
let secondFour = document.getElementById('secondFour');
let thirdFour = document.getElementById('thirdFour');
let fourthFour = document.getElementById('fourthFour');
let expiryMonth = document.getElementById('expiry-month');
let expiryYear = document.getElementById('expiry-year');
let expiryMonth_input = document.getElementById('expiry_month');
let expiryYear_input = document.getElementById('expiry_year');
let card = document.getElementById('card');
let backcard = document.getElementById('backcard');
let cvv = document.getElementById('cvv');
let cvv_num = document.getElementById('cvv_num');
let flip_box_inner = document.querySelector('.flip-box-inner');
flip_box_inner.addEventListener('click', () => {
    if (flip_box_inner.style.transform === 'rotateY(-180deg)') {

        flip_box_inner.style.transform = 'rotateY(0deg)';
    } else {
        flip_box_inner.style.transform = 'rotateY(-180deg)';

    }
});
cvv.addEventListener('focusin', () => {
    flip_box_inner.style.transform = 'rotateY(-180deg)';
});
cvv.addEventListener('focusout', () => {
    flip_box_inner.style.transform = 'rotateY(0deg)';
});
cvv.addEventListener('input', (e) => {
    let arr = e.target.value.split('');
    if (e.target.value.split('').length > 3) {
        arr.pop();
        e.target.value = arr.join('');
    }
    cvv_num.value = e.target.value;
});
expiryMonth_input.addEventListener('input', (e) => {

    let arr = e.target.value.split('');

    if (e.target.value.split('').length > 2) {
        arr.pop();
        e.target.value = arr.join('');
    }
    if (e.target.value > 12) {
        arr.pop();
        e.target.value = arr.join('');

    }
    if (e.target.value.split('').length === 2) {
        expiryYear_input.focus();
    }


});
expiryYear_input.addEventListener('focusout', (e) => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    if (e.target.value.split('').length !== 0) {
        if (parseInt('20' + expiryYear_input.value) < currentYear) {
            console.log('kam hai year');
            alert('Please select the valid year');
            expiryYear_input.value = '';
            expiryYear.innerText = '';
            if (parseInt(expiryMonth_input.value) < currentMonth) {
                console.log('kam hai month');
                alert('Please select the valid month');
                expiryMonth_input.value = '';
                expiryMonth.innerText = '';
            }
        } else {
            // if (expiryMonth_input.value.split('').length !== 0) {
            //     if (parseInt(expiryMonth_input.value) < 1) {
            //         alert("Please select the valid month");
            //         expiryMonth_input.value = '';
            //         expiryMonth.innerText = '';
            //     } else if (parseInt(expiryMonth_input.value) < currentMonth) {
            //         console.log('please enter the valid month');
            //         alert('Please enter the valid month');
            //         expiryMonth_input.value = '';
            //         expiryMonth.innerText = '';
            //     }

            // }
            if (!expiryMonth_input.value || expiryMonth_input.value === '00' || expiryMonth_input.value === '0') {
                alert('Please Enter a month !');

                expiryMonth_input.value = '';
                expiryMonth.innerText = '';
                expiryMonth_input.focus();
            }
        }

    }
}); expiryMonth_input.addEventListener('focusout', (e) => {
    if (e.target.value.split('').length < 2) {
        e.target.value = '0' + e.target.value;
        expiryMonth.innerText = e.target.value;
    }
});
expiryYear_input.addEventListener('input', (e) => {
    let arr = e.target.value.split('');
    if (e.target.value.split('').length > 2) {
        arr.pop();
        e.target.value = arr.join('');
    }
    if (e.target.value.split('').length === 2) {
        cvv.focus();
    }
});
name_input.addEventListener('input', (e) => {
    holder_name.innerText = e.target.value;
});
// cvv.addEventListener('focusin', () => {
//     backcard.style.transitionDelay = '.3s';

//     card.style.transform = 'scaleX(-1)';
//     backcard.style.transform = 'scaleX(1)';

// });
// cvv.addEventListener('focusout', () => {
//     backcard.style.transitionDelay = '0s';
//     backcard.style.transform = 'scaleX(0)';

//     card.style.transform = 'scaleX(1)';
// });
// card_input.addEventListener('input', (e) => {
//     let value = e.target.value;
//     let arr = e.target.value.split('');
//     firstFour.value = value.substr(0, 4);
//     secondFour.value = value.substr(4, 4);
//     thirdFour.value = value.substr(8, 4);
//     fourthFour.value = value.substr(12, 4);
//     if (arr.length > 16) {
//         arr.pop();
//         e.target.value = arr.join('');

//     }
//     if (e.target.value.split('').length >= 16) {
//         expiryMonth_input.focus();
//     }
// });
expiryMonth_input.addEventListener('input', (e) => {
    expiryMonth.innerText = e.target.value;
});
expiryYear_input.addEventListener('input', (e) => {
    expiryYear.innerText = e.target.value;
});
// This is your test publishable API key.


// The items the customer wants to buy
let elements;
initialize();
checkStatus();
document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch("/api/v1/order/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: 'All Items' }),
    });
    const { clientSecret, email } = await response.json();
    emailAddress = email;
    if (!clientSecret) {
        return window.location.replace("http://127.0.0.1:5009");
    }
    const appearance = {
        theme: 'flat',
    };
    elements = stripe.elements({ clientSecret, appearance });
    // const linkAuthenticationElement = elements.create("linkAuthentication");
    // linkAuthenticationElement.mount("#link-authentication-element");

    // linkAuthenticationElement.on('change', (event) => {
    //     emailAddress = event.value.email;
    // });
    const paymentElementOptions = {
        layout: "tabs",
    };
    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
    let private_element = document.querySelector('.__PrivateStripeElement iframe');
    let submitBtn = document.getElementById('submit');

    private_element.addEventListener('load', () => {
        submitBtn.style.opacity = '1';
        flip_box_inner.style.opacity = '1';

        // card_input.addEventListener('input', (e) => {
        //     let value = e.target.value;
        //     let arr = e.target.value.split('');
        //     firstFour.value = value.substr(0, 4);
        //     secondFour.value = value.substr(4, 4);
        //     thirdFour.value = value.substr(8, 4);
        //     fourthFour.value = value.substr(12, 4);
        //     if (arr.length > 16) {
        //         arr.pop();
        //         e.target.value = arr.join('');

        //     }
        //     if (e.target.value.split('').length >= 16) {
        //         expiryMonth_input.focus();
        //     }
        // });
    });

}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log(emailAddress);

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: `http://127.0.0.1:5009/api/v1/order/payment-successful`,
            receipt_email: emailAddress,
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }

    setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );
    if (!clientSecret) {
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    console.log("PAYMENT INTENT", paymentIntent);
    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            break;
        case "processing":
            showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
        default:
            showMessage("Something went wrong.");
            break;
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}
