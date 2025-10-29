import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For URL params and navigation
import { doc, getDoc } from 'firebase/firestore';
import { firebase, data, Components } from '../../constants';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams(); // Get course ID from URL
    const navigate = useNavigate(); // For redirect on error
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseRef = doc(firebase.db, 'courses', id);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    setCourse({ id: courseSnap.id, ...courseSnap.data() });
                } else {
                    setError('Course not found.');
                    // Fallback to static data if available
                    const staticCourse = data.courses.find((c) => c.id.toString() === id);
                    if (staticCourse) {
                        setCourse(staticCourse);
                    } else {
                        navigate('/'); // Redirect to home if no course found
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load course. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, navigate]);

    if (loading) {
        return <Components.Loading message="Loading course..." />;
    }

    if (error) {
        return (
            <div className="course-details">
                <p className="error">{error}</p>
                <button onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <>
            <Components.HelmetTitle title={course?.title || 'Course Details'} />
            <div className="course-details">
                <h2>{course.title}</h2>
                <p className="course-author">Author: {course.author || 'Unknown Author'}</p>
                <p className="course-price">Price: {course.price}</p>
                <div
                    className="course-content"
                    dangerouslySetInnerHTML={{ __html: course.content }}
                />
                <button onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </button>
            </div>
        </>
    );
};

export default CourseDetails;