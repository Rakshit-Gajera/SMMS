// ==============================================
// FEEDBACK & REMARKS PAGE (MENTOR)
// ==============================================
// This page allows mentors to:
//   - Add feedback/remarks for mentees
//   - View feedback history
// Screen 4 from the requirements

// Import React hooks
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// Import Modal component
import Modal from '../../components/Modal';

// ==============================================
// MOCK DATA - Sample feedback entries
// ==============================================
const mockFeedback = [
    {
        id: '1',
        mentee: 'Rakshit Gajera',
        date: '2024-01-02',
        type: 'Academic',
        feedback: 'Excellent progress on the research project. Keep up the good work!',
        rating: 'Positive',
    },
];

// ==============================================
// FEEDBACK REMARKS COMPONENT
// ==============================================
function FeedbackRemarks() {
    const { user } = useAuth();
    const { getMenteesByMentorId } = useData();
    const mentorId = user?.id || 'STAFF001';
    const myMentees = getMenteesByMentorId(mentorId);

    const [feedbackList, setFeedbackList] = useState(mockFeedback);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        mentee: '',
        type: 'Academic',
        feedback: '',
        rating: 'Positive',
    });

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const newFeedback = {
            id: Date.now().toString(),
            ...formData,
            date: new Date().toISOString().split('T')[0],
        };
        setFeedbackList([newFeedback, ...feedbackList]);
        setIsModalOpen(false);
        setFormData({ mentee: '', type: 'Academic', feedback: '', rating: 'Positive' });
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-end justify-between" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                        Feedback & Remarks
                    </h1>
                    <p className="text-secondary">
                        Add remarks and feedback for your mentees.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    Add Feedback
                </button>
            </div>

            {/* Feedback List */}
            <div className="flex flex-col gap-4">
                {feedbackList.map(item => (
                    <div key={item.id} className="card" style={{ padding: 'var(--space-5)' }}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="avatar avatar-initials"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    {item.mentee.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{item.mentee}</h4>
                                    <p className="text-xs text-secondary">{item.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`badge ${item.type === 'Academic' ? 'badge-primary' : item.type === 'Attendance' ? 'badge-warning' : 'badge-gray'}`}>
                                    {item.type}
                                </span>
                                <span className={`badge ${item.rating === 'Positive' ? 'badge-success' : 'badge-danger'}`}>
                                    {item.rating}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm">{item.feedback}</p>
                    </div>
                ))}
            </div>

            {/* Add Feedback Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Feedback"
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Mentee</label>
                        <select
                            name="mentee"
                            className="input"
                            value={formData.mentee}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select a mentee</option>
                            {myMentees.map(m => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Type</label>
                            <select
                                name="type"
                                className="input"
                                value={formData.type}
                                onChange={handleFormChange}
                            >
                                <option>Academic</option>
                                <option>Attendance</option>
                                <option>Behavior</option>
                                <option>Goals</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Rating</label>
                            <select
                                name="rating"
                                className="input"
                                value={formData.rating}
                                onChange={handleFormChange}
                            >
                                <option>Positive</option>
                                <option>Neutral</option>
                                <option>Needs Improvement</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="label">Feedback</label>
                        <textarea
                            name="feedback"
                            className="input"
                            placeholder="Enter your feedback or remarks..."
                            value={formData.feedback}
                            onChange={handleFormChange}
                            required
                            style={{ height: '100px', paddingTop: 'var(--space-2)' }}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Feedback
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default FeedbackRemarks;
