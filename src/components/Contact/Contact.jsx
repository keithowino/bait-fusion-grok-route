import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
import { Components, data } from '../../constants';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                },
                import.meta.env.VITE_EMAILJS_USER_ID
            );
            setStatus('✅ Message sent! We’ll reply within 24 hours.');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('EmailJS error:', error);
            setStatus('❌ Failed to send. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Components.HelmetTitle title="Contact Us" />
            <div className="contact">
                <h1>Contact {data.brandName}</h1>
                <p className="contact-subtitle">We'd love to hear from you. Send us a message!</p>

                <form onSubmit={handleSubmit} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <textarea
                        name="message"
                        placeholder="Tell us about your question or suggestion..."
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                {status && <p className={`status ${status.includes('✅') ? 'success' : 'error'}`}>{status}</p>}

                <div className="contact-info">
                    <h3>Or Reach Us Directly</h3>
                    <p><strong>Email:</strong> designsolutions1629@gmail.com</p>
                    <p><strong>Twitter:</strong> <a href="https://twitter.com" target="_blank">@BaitFusion</a></p>
                </div>
            </div>
        </>
    );
};

export default Contact;