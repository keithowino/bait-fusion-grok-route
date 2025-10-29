import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const redirectToCheckout = async (course) => {
    const stripe = await stripePromise;

    const response = await fetch('https://your-firebase-function-url/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            price: course.price === 'Free' ? 0 : parseFloat(course.price.replace('$', '')) * 100,
            courseId: course.id,
            courseTitle: course.title,
        }),
    });

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
};