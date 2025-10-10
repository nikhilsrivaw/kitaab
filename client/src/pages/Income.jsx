import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {  incomeAPI, projectAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Income = () => {
    const { projectId } = useParams();

    const [income, setIncome] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_id: '',
        amount: 0,
        source: '',
        description: '',
        date: ''
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState(null);
    const [deleteIncomeId, setDeleteIncomeId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [editIncomeId, setEditIncomeId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        project_id: '',
        amount: 0,
        source: '',
        description: '',
        date: ''
    });

    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const result = await incomeAPI.getByProject(projectId);
            if (result && result.data && result.data.incomes) {
                setIncome(result.data.incomes);
            }
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await incomeAPI.update(editIncomeId, editFormData);


            setEditIncomeId(null);
            fetchIncomes();
            setEditFormData({
                project_id: "",

                amount: 0,
                source: '',
                description: '',
                date: ''

            })

        } catch (error) {
            setError(error.message);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const result = await incomeAPI.create({


                ...formData,
                project_id: projectId

            });
            if (result) {
                setShowCreateModal(false);
                fetchIncomes();
                setFormData({
                    project_id: "",

                    amount: 0,
                    source: '',
                    description: '',
                    date: ''

                })

            }
        } catch (error) {
            setError(error.message);

        }
    }
    const handleDelete = async () => {
        if (deleteConfirmText.trim() !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }

        try {
            await incomeAPI.delete(deleteIncomeId);
            setDeleteIncomeId(null);
            setDeleteConfirmText('');
            fetchIncomes();
        } catch (error) {
            setError(error.message);
        }
    };
    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };




    useEffect(() => {
        fetchIncomes();
    }, [projectId]);

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            
            <div className="container mx-auto px-8 py-12">
                <h1 className="font-serif text-5xl font-semibold text-[var(--color-charcoal)] mb-8">
                    Income 
                </h1>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-[var(--color-forest-green)] text-white rounded"
                >
                    Add incomes
                </button>
                {loading && (
                    <p className="mt-8 text-[var(--color-warm-gray)]">Loading Incomes...</p>
                )}
                {error && (
                    <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {!loading && !error && income.length === 0 && (
                    <p className="mt-8 text-[var(--color-warm-gray)] text-lg">
                        No income yet .... 
                    </p>
                )}
                {!loading && income.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {income.map((income) => (
                            <div key={income.id} className="bg-white p-6 rounded shadow">
                                <h3 className="font-bold text-xl">${income.amount}</h3>
                                <p className="text-gray-600 mt-2">{income.source}</p>
                                <p className="text-gray-500 text-sm mt-1">{income.description}</p>
                                <p className="text-gray-400 text-xs mt-1">{income.date}</p>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setEditIncomeId(income.id);
                                            setEditFormData({
                                                project_id: income.project_id,
                                                amount: income.amount,
                                                source: income.source,
                                                description: income.description,
                                                date: income.date
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteIncomeId(income.id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal - OUTSIDE the expenses list! */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 w-96">
                            <h2 className="text-2xl font-bold mb-6">Add Income</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Amount */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Source
                                    </label>
                                    <input
                                        type="text"
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="e.g., Food, Hosting, Tools"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        rows="3"
                                    />
                                </div>

                                {/* Date */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Add Expense
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Delete Modal */}
                {deleteIncomeId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 w-96">
                            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Income</h2>
                            <p className="mb-4 text-gray-700">
                                Are you sure you want to delete this income? This action cannot be undone.
                            </p>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Type <span className="text-red-600">DELETE</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="DELETE"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteIncomeId(null);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete Expense
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Edit Modal */}
                {editIncomeId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 w-96">
                            <h2 className="text-2xl font-bold mb-6">Edit Income</h2>

                            <form onSubmit={handleEditSubmit}>
                                {/* Amount */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded"
                                        rows="3"
                                    />
                                </div>

                                {/* Date */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={editFormData.date}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditIncomeId(null);
                                            setEditFormData({
                                                project_id: '',
                                                amount: 0,
                                                source: '',
                                                description: '',
                                                date: ''
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Income;