// const { onRequest } = require("firebase-functions/v2/https");
import { onRequest } from "firebase-functions/v2/https";
const stripe = require('stripe')('sk_test_');

export const createCheckoutSession = onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { courseTitle, price, courseId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Access to "${courseTitle}"`,
                        description: 'Lifetime access to course materials',
                        images: ['https://your-site.com/logo.png'], // Optional
                    },
                    unit_amount: price === 'Free' ? 0 : Math.round(parseFloat(price.replace('$', '')) * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/courses/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/courses/${courseId}`,
            metadata: {
                courseId: courseId,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Payment setup failed' });
    }
});