import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Components, data, firebase } from '../../constants';
import './Courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState('all');
    const [titleFilter, setTitleFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(firebase.db, 'courses'));
                const fetchedCourses = [];
                querySnapshot.forEach((doc) => {
                    fetchedCourses.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setCourses(fetchedCourses);
            } catch (error) {
                console.error('Fetch error:', error);
                setCourses(data.courses);
                alert('Failed to load courses. Showing default courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) => {
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'free' && course.price.toLowerCase() === 'free') ||
            (priceFilter === 'paid' && course.price.toLowerCase() !== 'free');
        const searchLower = titleFilter.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(searchLower) || course.content.toLowerCase().includes(searchLower);
        const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
        return matchesPrice && matchesTitle && matchesCategory;
    });

    const coursesMapper = filteredCourses.length > 0 ? filteredCourses.map((course) => (
        <Components.CourseCard key={course.id} course={course} />
    )) : (
        <p>No courses match your filters.</p>
    );

    if (loading) {
        return <Components.Loading message="Loading courses..." />;
    }

    return (
        <>
            <Components.HelmetTitle title={`Courses${titleFilter || categoryFilter !== 'all' ? ' - Filtered' : ''}`} />
            <div className="courses">
                <h2>All Courses</h2>
                <div className="filters">
                    <input
                        type="text"
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        placeholder="Search by course title"
                        className="filter-input"
                    />
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Prices</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        <option value="Science">🔬 Science</option>
                        <option value="Math">📐 Math</option>
                        <option value="Programming">💻 Programming</option>
                        <option value="Business">💼 Business</option>
                        <option value="Design">🎨 Design</option>
                        <option value="Lifestyle">🌟 Lifestyle</option>
                        <option value="Other">📚 Other</option>
                    </select>
                </div>
                <section className="course-grid">
                    {coursesMapper}
                </section>
            </div>
        </>
    );
};

export default Courses;