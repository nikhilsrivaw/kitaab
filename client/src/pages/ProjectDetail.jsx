import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { aiAPI, clientAPI, projectAPI, taskAPI } from '../services/api';


const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    // const [expenses , setexpenses ] = useState(null);
    const [tasks, setTasks] = useState([])
    const [taskId , setTaskId] = useState(null)
    const [loading, setLoading] = useState(true);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [taskData, setTaskData] = useState({

        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: 0,
        status: 'todo'

    })
    const [showCreatetaskModal,setShowCreatetaskModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [error, setError] = useState(null);
    const [editProjectId, setEditProjectId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '', client_id: '' });
    const [clients, setClients] = useState([]);
    const [aiSugesstions, setAiSugesstions] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskData, setEditTaskData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: 0,
        status: 'todo'
    })
    const [deleteTaskId, setDeleteTaskId] = useState(null);


    const projectId = parseInt(id);



    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {

            const result = await taskAPI.create({...taskData , project_id: project.id});
            if (result) {
                setShowCreatetaskModal(false);
                fetchProjects();
                setTaskData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    estimated_hours: 0,
                    status: 'todo'
                })

            }
        } catch (error) {
            console.error("FAILED TO UPDATE TASK", error);
            alert('FAILED TO UPDATE TASK')

        }

    }


    const fetchClients = async () => {

        try {
            const result = await clientAPI.getAll();

            if (result && result.data) {

                setClients(result.data.result || []);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);

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
            setEditFormData({ name: '', description: '', client_id: '' });
            fetchProjects();
        } catch (error) {
            setError(error.message);
        }
    };
    const handleCreateTasks = async () => {
        try {
            for (const task of aiSugesstions) {
                await taskAPI.create({
                    project_id: project.id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    estimated_hours: task.estimated_hours,
                    tags: task.tags,
                    ai_generated: true
                })
            }

            setShowAiModal(false);
            setAiSugesstions([]);
            fetchProjects();
            alert("ALL tasks created successfully")
        } catch (error) {
            console.error("Failed to create tasks", error);
            alert('Failed to create some tasks . Please try again')

        }
    }


    const fetchProjects = async () => {
        try {
            setLoading(true);

            const projectResult = await projectAPI.getAll();
            const foundProject = projectResult.data.projects.find(p => p.id === projectId);
            setProject(foundProject);


            const taskResult = await taskAPI.getAll(projectId);
            setTasks(taskResult.data.result || []);


            setLoading(false);
        } catch (error) {
            console.error("Error fetching the data ", error);


        } finally {
            setLoading(false)
        }
    }

    const handleEditTaskSubmit = async (e) => {
        try {
            await taskAPI.update(editTaskId, editTaskData);
            setEditTaskId(null);
            setEditTaskData({ title: '', description: '', priority: 'medium', estimated_hours: 0, status: 'todo' });
            fetchProjects();
            alert('Task updated Succesfully')
        } catch (error) {
            console.error("FAILED TO UPDATE TASK", error);
            alert('FAILED TO UPDATE TASK')

        }

    }
    const handleDeleteTask = async (taskId) => {
        try {
            await taskAPI.delete(taskId);
            fetchProjects();
            setDeleteTaskId(null);
            alert("successfully deleted the task")
        } catch (error) {
            console.error("UNABKE TO DELETE THE TASKS", error);
            alert("UNABLE TO DELETE THE TASK")

        }
    }

    const handleAiAnalysis = async () => {
        if (!project.description || project.description.trim() === '') {
            alert('Project needs a description for ai analysis ')
            return;
        }
        setAiLoading(true);
        try {
            const result = await aiAPI.analyzeProject(project.id, project.description);
            setAiSugesstions(result.data.tasks);
            setShowAiModal(true);

        } catch (error) {
            console.error("AI analysis failed ", error);
            alert("Failed to analyse project. please try again")

        } finally {
            setAiLoading(false)
        }

    }

    useEffect(() => {
        fetchProjects();
        fetchClients();


    }, []);

    if (loading) {
        return <div className='p-8'> Loading projects ...</div>
    }
    if (!project) {
        return <div className="p-8">NO projects found</div>
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="container mx-auto px-8 py-12">

                {/* Project Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">

                        <div className="flex-1">
                            <h1 className="font-serif text-5xl font-semibold text-[var(--color-charcoal)] mb-4">
                                {project.name}
                            </h1>
                            <p className="text-[var(--color-warm-gray)] text-lg">
                                {project.description}
                            </p>

                        </div>
                        <div className="flex gap-3 ml-4">
                            <button className="flex-1 px-4 py-2 bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded
  hover:bg-[var(--color-terracotta)] transition-colors duration-200 text-sm" onClick={() => { setEditProjectId(project.id); setEditFormData({ name: project.name, description: project.description, client_id: project.client_id }) }} >Edit Project</button>
                            <button className="flex-1 px-6 py-2 bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded
  hover:bg-[var(--color-terracotta)] transition-colors duration-200 text-sm" onClick={() => setDeleteProjectId(project.id)}>Delete Project</button>
                        </div>
                        <div className="flex gap-3 ml-4">

                        </div>

                    </div>
                </div>


                {/* Tasks Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[var(--color-charcoal)]">
                            ✅ Tasks ({tasks.length})
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAiAnalysis}
                                disabled={aiLoading}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
                            >
                                {aiLoading ? '🤖 Analyzing...' : '🤖 Analyze with AI'}
                            </button>
                            <button onClick={() => setShowCreatetaskModal(true)} className="px-4 py-2 bg-[var(--color-forest-green)] text-white rounded hover:bg-green-700">
                                + Add Task
                            </button>
                        </div>
                    </div>

                    {/* Task List */}
                    {tasks.length === 0 ? (
                        <p className="text-gray-500">No tasks yet. Click "Add Task" to get started!</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div key={task.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{task.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                            <div className="flex gap-4 mt-2 text-sm">
                                                <span className="text-gray-500">
                                                    Priority: <span className="font-medium">{task.priority}</span>
                                                </span>
                                                <span className="text-gray-500">
                                                    Est: <span className="font-medium">{task.estimated_hours}hrs</span>
                                                </span>
                                                <span className={`font-medium ${task.status === 'done' ? 'text-green-600' : 'text-orange-600'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button onClick={() => {
                                                setEditTaskId(task.id);
                                                setEditTaskData({
                                                    title: task.title,
                                                    description: task.description,
                                                    priority: task.priority,
                                                    estimated_hours: task.estimated_hours,
                                                    status: task.status
                                                });
                                            }} className="text-blue-600 hover:text-blue-800 text-sm">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800 text-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Income Section - Placeholder for now */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-4">
                        💰 Income
                    </h2>
                    <p className="text-gray-500">Income section coming soon...</p>
                </div>

                {/* Expenses Section - Placeholder for now */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-4">
                        💸 Expenses
                    </h2>
                    <p className="text-gray-500">Expenses section coming soon...</p>
                </div>
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
                                {/* Client dropdown */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Client (Optional)
                                    </label>
                                    <select
                                        name="client_id"
                                        value={editFormData.client_id}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            client_id: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="">-- No Client --</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name} {client.company_name && `(${client.company_name})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditProjectId(null);
                                            setEditFormData({ name: '', description: '', client_id: '' });
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
                {showAiModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 w-[800px] max-h-[80vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">🤖 AI-Generated Tasks</h2>
                            <p className="text-gray-600 mb-6">
                                Review the AI suggestions below and create tasks
                            </p>

                            {/* AI Suggestions List */}
                            <div className="space-y-4 mb-6">
                                {aiSugesstions.map((task, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                        <h3 className="font-bold text-lg mb-2">{task.title}</h3>
                                        <p className="text-gray-700 text-sm mb-3">{task.description}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Priority: {task.priority}
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Est: {task.estimated_hours}hrs
                                            </span>
                                            <div className="flex gap-1">
                                                {task.tags.map((tag, i) => (
                                                    <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowAiModal(false)}
                                    className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleCreateTasks()}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Create All Tasks
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Edit Task Modal */}
                {editTaskId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 w-[600px]">
                            <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

                            <form onSubmit={handleEditTaskSubmit}>
                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editTaskData.title}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
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
                                        value={editTaskData.description}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        rows="3"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={editTaskData.priority}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                {/* Estimated Hours */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Estimated Hours
                                    </label>
                                    <input
                                        type="number"
                                        value={editTaskData.estimated_hours}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, estimated_hours: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded"
                                        min="0"
                                    />
                                </div>

                                {/* Status */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={editTaskData.status}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditTaskId(null);
                                            setEditTaskData({ title: '', description: '', priority: 'medium', estimated_hours: 0, status: 'todo' });
                                        }}
                                        className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Update Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showCreatetaskModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 w-[600px]">
                            <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

                            <form onSubmit={handleTaskSubmit}>
                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        
                                        onChange={(e) => setTaskData({...taskData,  title: e.target.value })}
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
                                        
                                        onChange={(e) => setTaskData({...taskData, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        rows="3"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Priority
                                    </label>
                                    <select
                                        
                                        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                {/* Estimated Hours */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Estimated Hours
                                    </label>
                                    <input
                                        type="number"
                                        
                                        onChange={(e) => setTaskData({ ...taskData,estimated_hours: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded"
                                        min="0"
                                    />
                                </div>

                                {/* Status */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Status
                                    </label>
                                    <select
                                       
                                        onChange={(e) => setTaskData({...taskData, status: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            
                                            setTaskData({ title: '', description: '', priority: 'medium', estimated_hours: 0, status: 'todo' });
                                        }}
                                        className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

export default ProjectDetail;