import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AuthorDashboard.css';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Components, firebase } from '../../constants';
import { useAuthState } from 'react-firebase-hooks/auth';

const AuthorDashboard = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [priceError, setPriceError] = useState(''); // New: For price validation
    const [isPreview, setIsPreview] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [user] = useAuthState(firebase.auth);
    const [category, setCategory] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet',
        'align', 'link', 'image', 'video', 'color', 'background'
    ];

    // Validate price
    const validatePrice = (value) => {
        const cleanedValue = value.trim().toLowerCase();
        if (cleanedValue === 'free') return true;
        const numberPattern = /^\$?\d+(\.\d{1,2})?$/; // Matches $10, 10, $19.99
        return numberPattern.test(value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        if (value && !validatePrice(value)) {
            setPriceError('Price must be "Free" or a valid number (e.g., $10, $19.99)');
        } else {
            setPriceError('');
        }
    };

    const handleSave = async () => {
        if (!title || !content) {
            alert('Course title and/or course content are/is missing. Add where necessary.');
            return;
        }
        if (!user) {
            alert('You must be logged in to save courses.');
            return;
        }
        if (price && !validatePrice(price)) {
            alert('Invalid price. Please enter "Free" or a valid number (e.g., $10, $19.99).');
            return;
        }

        try {
            if (editingCourseId) {
                const courseRef = doc(firebase.db, 'courses', editingCourseId);
                await updateDoc(courseRef, {
                    title,
                    content,
                    category,
                    isFeatured,
                    price: price || 'Free', // Default to Free if empty
                    updatedAt: new Date().toISOString()
                });
                alert('Course updated successfully!');
            } else {
                await addDoc(collection(firebase.db, 'courses'), {
                    title,
                    content,
                    category,
                    isFeatured,
                    author: user.displayName || 'Anonymous',
                    authorId: user.uid,
                    price: price || 'Free',
                    createdAt: new Date().toISOString()
                });
                alert('Course saved to Firestore!');
            }

            setTitle('');
            setContent('');
            setPrice('');
            setPriceError('');
            setIsPreview(false);
            setEditingCourseId(null);

            const q = query(collection(firebase.db, 'courses'), where('authorId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedCourses = [];
            querySnapshot.forEach((doc) => {
                fetchedCourses.push({ id: doc.id, ...doc.data() });
            });
            setCourses(fetchedCourses);
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save course. Check console.');
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        try {
            await deleteDoc(doc(firebase.db, 'courses', courseId));
            alert('Course deleted successfully!');
            const q = query(collection(firebase.db, 'courses'), where('authorId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedCourses = [];
            querySnapshot.forEach((doc) => {
                fetchedCourses.push({ id: doc.id, ...doc.data() });
            });
            setCourses(fetchedCourses);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete course. Check console.');
        }
    };

    const handleEdit = (course) => {
        setTitle(course.title);
        setContent(course.content);
        setPrice(course.price);
        setPriceError('');
        setEditingCourseId(course.id);
        setIsPreview(false);
        setCategory(course.category || '');
        setIsFeatured(course.isFeatured || false);
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchCourses = async () => {
            try {
                const q = query(collection(firebase.db, 'courses'), where('authorId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const fetchedCourses = [];
                querySnapshot.forEach((doc) => {
                    fetchedCourses.push({ id: doc.id, ...doc.data() });
                });
                setCourses(fetchedCourses);
            } catch (err) {
                console.error('Fetch failed:', err);
                alert('Failed to load your courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    return (
        <>
            <Components.HelmetTitle title="Build Course" />
            <div className="author-dashboard">
                <h2>{editingCourseId ? 'Edit Course' : 'Create a New Course'}</h2>
                <button onClick={() => setIsPreview(!isPreview)} className="toggle-preview-button">
                    {isPreview ? 'Back to Edit' : 'Preview Course'}
                </button>
                {isPreview ? (
                    <div className="course-preview">
                        <h3 className="preview-title">{title || 'Untitled Course'}</h3>
                        <p className="preview-price">Price: {price || 'Not set'}</p>
                        <p className="preview-category">Category: {category || 'Not set'}</p>
                        <div
                            className="preview-content"
                            dangerouslySetInnerHTML={{ __html: content || '<p>No content yet.</p>' }}
                        />
                        <button onClick={handleSave} className="save-button">Save Course</button>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Course Title"
                            className="metadata-input"
                        />
                        <input
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            placeholder="Price (e.g., Free or $10)"
                            className="metadata-input"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="metadata-input"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Science">🔬 Science</option>
                            <option value="Math">📐 Math</option>
                            <option value="Programming">💻 Programming</option>
                            <option value="Business">💼 Business</option>
                            <option value="Design">🎨 Design</option>
                            <option value="Lifestyle">🌟 Lifestyle</option>
                            <option value="Other">📚 Other</option>
                        </select>

                        <div className="metadata-group">
                            <label className="metadata-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                Mark as Featured
                            </label>
                        </div>

                        {priceError && <p className="error">{priceError}</p>}
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="ql-container"
                        />
                        <button onClick={handleSave} className="save-button">Save Course</button>
                    </>
                )}
                {loading ? (
                    <Components.Loading message="Loading your courses..." />
                ) : (
                    <section className="my-courses">
                        <h3>Your Courses</h3>
                        {courses.length === 0 ? (
                            <p>You haven't created any courses yet.</p>
                        ) : (
                            <ul className="course-list">
                                {courses.map((course) => (
                                    <li key={course.id} className="course-item">
                                        <h4>{course.title}</h4>
                                        <p>Price: {course.price}</p>
                                        <button onClick={() => handleEdit(course)} className="edit-button">Edit</button>
                                        <button onClick={() => handleDelete(course.id)} className="delete-button">Delete</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </div>
        </>
    );
};

export default AuthorDashboard;