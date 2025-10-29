import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Home.css';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
} from 'firebase/firestore';
import { Components, data, firebase } from '../../constants';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 6;

const Home = () => {
    const [courses, setCourses] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false);   // true while fetching
    const [hasMore, setHasMore] = useState(true);    // false when no more docs
    const [lastDoc, setLastDoc] = useState(null);    // cursor for next page

    const observer = useRef();  // IntersectionObserver ref

    const loadFirstPage = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(
                collection(firebase.db, 'courses'),
                orderBy('createdAt', 'desc'),
                limit(PAGE_SIZE)
            );
            const snap = await getDocs(q);
            const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            setCourses(fetched);
            setLastDoc(snap.docs[snap.docs.length - 1]); // cursor
            setHasMore(fetched.length === PAGE_SIZE);
        } catch (e) {
            console.error(e);
            // fallback to static data
            setCourses(data.courses.slice(0, PAGE_SIZE));
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(async () => {
        if (!lastDoc || !hasMore || loading) return;
        setLoading(true);
        try {
            const q = query(
                collection(firebase.db, 'courses'),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(PAGE_SIZE)
            );
            const snap = await getDocs(q);
            const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            setCourses((prev) => [...prev, ...fetched]);
            setLastDoc(snap.docs[snap.docs.length - 1]);
            setHasMore(fetched.length === PAGE_SIZE);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [lastDoc, hasMore, loading]);

    const sentinelRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, loadMore]
    );

    useEffect(() => {
        loadFirstPage();
    }, [loadFirstPage]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(firebase.db, 'courses'));
                const fetchedCourses = [];
                querySnapshot.forEach((doc) => {
                    fetchedCourses.push({
                        id: doc.id,  // Use doc ID for keys
                        ...doc.data()  // Spread title, content, price, etc.
                    });
                });
                setCourses(fetchedCourses);
            } catch (error) {
                console.error('Fetch error:', error);
                // Fallback to static data on error
                setCourses(data.courses);
                alert('Failed to load courses. Showing default courses.');
                // Optimize Firestore queries for larger datasets later (e.g., add pagination or limits using limit() or query()).
            } finally {
                setLoading(false);  // Done loading
            }
        };

        fetchCourses();
    }, []);  // Empty deps: Runs once on load

    const coursesMapper = courses.map((c) => (
        <Components.CourseCard key={c.id} course={c} />
    ));

    if (loading && courses.length === 0) {
        return <Components.Loading message="Loading courses…" />;
    }

    return (
        <>
            <Components.HelmetTitle title="Learn & Teach Online" />
            <main className="home">
                <section className="hero">
                    <h1>Learn or Share Experiences with {data.brandName}</h1>
                    <p className="hero-subtitle">
                        Join thousands of learners and creators building skills through real-world courses.
                    </p>
                    <div className="hero-stats">
                        <div><strong>50+</strong> Courses</div>
                        <div><strong>1,200+</strong> Students</div>
                        <div><strong>4.8★</strong> Avg Rating</div>
                    </div>
                    <button className="cta-button">
                        <Link to="/courses" style={{ color: 'white', textDecoration: 'none' }}>
                            Browse Courses
                        </Link>
                    </button>
                </section>

                <section className="course-grid">
                    {coursesMapper}

                    {/* Sentinel element – invisible, observed for scroll */}
                    {
                        hasMore && (
                            <div ref={sentinelRef} className="sentinel">
                                {loading && <Components.Loading message="Loading more…" />}
                            </div>
                        )
                    }

                    {/* Fallback button for non-JS or very short screens */}
                    {
                        !hasMore && courses.length > 0 && (
                            <p className="no-more">You’ve reached the end.</p>
                        )
                    }
                </section >
            </main >
        </>
    );
};

export default Home;