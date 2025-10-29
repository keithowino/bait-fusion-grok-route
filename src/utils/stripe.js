import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (course) => {
    const stripe = await stripePromise;

    const response = await fetch(
        'https://us-central1-baitfusion-39d24.cloudfunctions.net/createCheckoutSession', // ← REPLACE
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                courseTitle: course.title,
                price: course.price,
                courseId: course.id,
            }),
        }
    );

    const session = await response.json();

    if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
        alert('Payment setup failed. Try again.');
    }
};