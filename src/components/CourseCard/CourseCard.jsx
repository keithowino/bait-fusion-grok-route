import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    const { id, title, author = 'Unknown Author', price, content } = course;

    return (
        <div className="course-card">
            {course.isFeatured && <span className="featured-badge">★ Featured</span>}
            <h3 className="card-title">{title}</h3>
            <p className="card-author">Author: {author}</p>
            <p className="card-price">Price: {price}</p>
            {content && (
                <div
                    className="card-preview"
                    dangerouslySetInnerHTML={{ __html: content.substring(0, 150) + '...' }}
                />
            )}
            <Link to={`/courses/${id}`} className="enroll-button">
                View Course
            </Link>
        </div>
    );
};

export default CourseCard;