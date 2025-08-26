const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

    const options = {
        amount: 50000, // Amount in paise. 50000 = ₹500. Change this to your plan's price.
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    };

    try {
        const order = await instance.orders.create(options);
        return {
            statusCode: 200,
            body: JSON.stringify({
                order_id: order.id,
                razorpay_key_id: RAZORPAY_KEY_ID,
                amount: order.amount
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Error creating Razorpay order.' }) };
    }
};