const stripe = require('../config/stripeConfig');
const asynchandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');

const createPaymentIntent = asynchandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100),
        currency: 'usd',
        metadata: { orderId: order.id }
    });

    res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'Payment intent created successfully'
    });
});

const handleWebhook = asynchandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata.orderId;
        await Payment.update({ status: 'Paid' }, { where: { id: orderId } });

        console.log(`Payment for order ${orderId} succeeded.`);
    }

    res.status(200).json({ received: true });
});

const getPaymentById = asynchandler(async (req, res) => {
    const  id  = req.params;

    const payment = await Payment.findOne({ where: { id } });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
});

const updatePaymentById = asynchandler(async (req, res) => {
    const  id  = req.params;
    const { status } = req.body;

    const payment = await Payment.findOne({ where: { id } });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.update({ status }, { where: { id } });

    res.status(200).json({ message: 'Payment updated successfully' });
});

const deletePaymentById = asynchandler(async (req, res) => {
    const  id  = req.params;

    const payment = await Payment.findOne({ where: { id } });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.destroy({ where: { id } });

    res.status(200).json({ message: 'Payment deleted successfully' });
});

const getAllPayments = asynchandler(async (req, res) => {
    const payments = await Payment.findAll();

    res.status(200).json(payments);
});

module.exports = {
    createPaymentIntent,
    handleWebhook,
    getPaymentById,
    getAllPayments,
    deletePaymentById,
    updatePaymentById
};