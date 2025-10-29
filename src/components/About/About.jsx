import React from 'react';
import './About.css';
import { Components, data } from '../../constants';

const About = () => {
    return (
        <>
            <Components.HelmetTitle title="About Us" />
            <div className="about">
                <section className="about-hero">
                    <h1>About {data.brandName}</h1>
                    <p>Empowering lifelong learning through shared knowledge.</p>
                </section>

                <section className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        We believe everyone has something valuable to teach — and everyone has something to learn.
                        {data.brandName} connects passionate creators with curious learners in a simple, beautiful way.
                    </p>
                </section>

                <section className="values">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Accessibility</h3>
                            <p>Free and affordable courses for all.</p>
                        </div>
                        <div className="value-card">
                            <h3>Community</h3>
                            <p>Learn together, grow together.</p>
                        </div>
                        <div className="value-card">
                            <h3>Quality</h3>
                            <p>Real content from real experts.</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;