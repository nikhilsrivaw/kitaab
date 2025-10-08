import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import Navbar from '../components/Navbar';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: " "

    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [editProjectId, setEditProjectId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '' });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const result = await projectAPI.getAll();
            if (result && result.data && result.data.projects) {
                setProjects(result.data.projects);
            }

        }
        catch (error) {
            console.log(error.message)
            setError(error.message)

        } finally {
            setLoading(false);
        }



    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const result = await projectAPI.create(formData);
            if (result) {
                setShowCreateModal(false);
                fetchProjects();
                setFormData({ name: '', description: '' })

            }
        } catch (error) {
            setError(error.message);

        }
    }
    const handleDelete = async () => {
        console.log('Typed:', deleteConfirmText);
        console.log('Expected:', 'DELETE');
        if (deleteConfirmText.trim() !== 'DELETE') {
            alert('please type DELETE to confirm');
            return;
        }
        try {
            await projectAPI.delete(deleteProjectId);
            setDeleteProjectId(null);
            setDeleteConfirmText('');
            fetchProjects();

        } catch (error) {
            setError(error.message);

        }
    }
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await projectAPI.update(editProjectId, editFormData);


            setEditProjectId(null);
            setEditFormData({ name: '', description: '' });
            fetchProjects();
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, [])


    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <Navbar />
            <div className="container mx-auto px-8 py-12">
                <h1 className="font-serif text-5xl font-semibold text-[var(--color-charcoal)] mb-8">
                    My Projects
                </h1>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-[var(--color-forest-green)] text-white rounded"
                >
                    Create New Project
                </button>
                {loading && (
                    <p className="mt-8 text-[var(--color-warm-gray)]">Loading projects...</p>
                )}
                {error && (
                    <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {!loading && !error && projects.length === 0 && (
                    <p className="mt-8 text-[var(--color-warm-gray)] text-lg">
                        No projects yet. Click "Create New Project" to get started!
                    </p>
                )}
                {!loading && projects.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white p-6 rounded shadow">
                                <h3 className="font-bold text-xl">{project.name}</h3>
                                <p className="text-gray-600 mt-2">{project.description}</p>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setEditProjectId(project.id);
                                            setEditFormData({
                                                name: project.name,
                                                description: project.description
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteProjectId(project.id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Name input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>

                            {/* Description input */}
                            <div className="mb-6">
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
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteProjectId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Project</h2>
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete this project? This action cannot be undone.
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
                                    setDeleteProjectId(null);
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
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editProjectId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h2 className="text-2xl font-bold mb-6">Edit Project</h2>

                        <form onSubmit={handleEditSubmit}>
                            {/* Name input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        name: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>

                            {/* Description input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        description: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded"
                                    rows="3"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditProjectId(null);
                                        setEditFormData({ name: '', description: '' });
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

    );




}

export default Projects;