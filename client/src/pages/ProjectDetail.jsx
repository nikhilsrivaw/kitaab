import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { aiAPI, clientAPI, projectAPI, taskAPI } from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    // const [expenses , setexpenses ] = useState(null);
    const [tasks, setTasks] = useState([])
    const [taskId, setTaskId] = useState(null)
    const [loading, setLoading] = useState(true);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [taskData, setTaskData] = useState({

        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: 0,
        status: 'todo'

    })
    const [showCreatetaskModal, setShowCreatetaskModal] = useState(false)
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

    const handleDragEnd = async (result) => {

        if (!result.destination) return;

        const taskId = parseInt(result.draggableId);
        const newStatus = result.destination.droppableId;

        try {
            const task = tasks.find(t => t.id === taskId);
            await taskAPI.update(taskId, { ...task, status: newStatus });
            fetchProjects();
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to move task');
        }
    };



    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {

            const result = await taskAPI.create({ ...taskData, project_id: project.id });
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
        return <div className='p-8 pt-28'> Loading projects ...</div>
    }
    if (!project) {
        return <div className="p-8 pt-28">NO projects found</div>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900
  dark:to-slate-800">
          <div className="container mx-auto px-8 py-12 pt-28">

              {/* Project Header */}
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg mb-8">
                  <CardContent className="p-8">
                      <div className="flex justify-between items-start">
                          <div className="flex-1">
                              <h1 className="font-serif text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                  {project.name}
                              </h1>
                              <p className="text-slate-600 dark:text-slate-400 text-lg">
                                  {project.description}
                              </p>
                          </div>
                          <div className="flex gap-3 ml-8">
                              <Button
                                  variant="outline"
                                  onClick={() => {
                                      setEditProjectId(project.id);
                                      setEditFormData({
                                          name: project.name,
                                          description: project.description,
                                          client_id: project.client_id
                                      })
                                  }}
                                  className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                              >
                                  Edit Project
                              </Button>
                              <Button
                                  variant="destructive"
                                  onClick={() => setDeleteProjectId(project.id)}
                              >
                                  Delete Project
                              </Button>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Tasks Section */}
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg mb-6">
                  <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex justify-between items-center">
                          <div>
                              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                  Tasks
                              </CardTitle>
                              <p className="text-slate-600 dark:text-slate-400 mt-1">{tasks.length} total tasks</p>
                          </div>
                          <div className="flex gap-3">
                              <div className="flex gap-2 border border-slate-200 dark:border-slate-600 rounded-lg p-1">
                                  <Button
                                      onClick={() => setViewMode('list')}
                                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                                      size="sm"
                                  >
                                      List
                                  </Button>
                                  <Button
                                      onClick={() => setViewMode('kanban')}
                                      variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                                      size="sm"
                                  >
                                      Kanban
                                  </Button>
                              </div>
                              <Button
                                  onClick={handleAiAnalysis}
                                  disabled={aiLoading}
                                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                              >
                                  {aiLoading ? 'Analyzing...' : 'AI Analyze'}
                              </Button>
                              <Button
                                  onClick={() => setShowCreatetaskModal(true)}
                                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                              >
                                  + Add Task
                              </Button>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="p-6">
                      {tasks.length === 0 ? (
                          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No tasks yet. Click "Add Task" to get started!</p>
                      ) : viewMode === 'list' ? (
                          <div className="space-y-3">
                              {tasks.map((task) => (
                                  <div key={task.id} className="p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50
  dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                                      <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{task.title}</h3>
                                              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{task.description}</p>
                                              <div className="flex gap-3 mt-3">
                                                  <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                                      {task.priority}
                                                  </Badge>
                                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                                      {task.estimated_hours}hrs
                                                  </span>
                                                  <Badge variant={task.status === 'done' ? 'default' : 'outline'}>
                                                      {task.status}
                                                  </Badge>
                                              </div>
                                          </div>
                                          <div className="flex gap-2 ml-4">
                                              <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => {
                                                      setEditTaskId(task.id);
                                                      setEditTaskData({
                                                          title: task.title,
                                                          description: task.description,
                                                          priority: task.priority,
                                                          estimated_hours: task.estimated_hours,
                                                          status: task.status
                                                      });
                                                  }}
                                                  className="text-blue-600 dark:text-blue-400"
                                              >
                                                  Edit
                                              </Button>
                                              <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => handleDeleteTask(task.id)}
                                                  className="text-red-600 dark:text-red-400"
                                              >
                                                  Delete
                                              </Button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <KanbanBoard
                              tasks={tasks}
                              onDragEnd={handleDragEnd}
                              onEditTask={(task) => {
                                  setEditTaskId(task.id);
                                  setEditTaskData({
                                      title: task.title,
                                      description: task.description,
                                      priority: task.priority,
                                      estimated_hours: task.estimated_hours,
                                      status: task.status
                                  });
                              }}
                              onDeleteTask={handleDeleteTask}
                          />
                      )}
                  </CardContent>
              </Card>

              {/* Income Section - Placeholder */}
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg mb-6">
                  <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                          Income
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400">Income section coming soon...</p>
                  </CardContent>
              </Card>

              {/* Expenses Section - Placeholder */}
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                  <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                          Expenses
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400">Expenses section coming soon...</p>
                  </CardContent>
              </Card>

              {/* Edit Project Modal */}
              {editProjectId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-96 dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100">Edit Project</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleEditSubmit}>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Project Name
                                      </label>
                                      <input
                                          type="text"
                                          value={editFormData.name}
                                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          required
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Description
                                      </label>
                                      <textarea
                                          value={editFormData.description}
                                          onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          rows="3"
                                      />
                                  </div>
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Client (Optional)
                                      </label>
                                      <select
                                          value={editFormData.client_id}
                                          onChange={(e) => setEditFormData({...editFormData, client_id: e.target.value})}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                      >
                                          <option value="">-- No Client --</option>
                                          {clients.map((client) => (
                                              <option key={client.id} value={client.id}>
                                                  {client.name} {client.company_name && `(${client.company_name})`}
                                              </option>
                                          ))}
                                      </select>
                                  </div>
                                  <div className="flex gap-4">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                              setEditProjectId(null);
                                              setEditFormData({ name: '', description: '', client_id: '' });
                                          }}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">
                                          Update
                                      </Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Delete Project Modal */}
              {deleteProjectId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-96 dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="text-red-600 dark:text-red-400">Delete Project</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="mb-4 dark:text-slate-300">
                                  Are you sure you want to delete this project? This action cannot be undone.
                              </p>
                              <div className="mb-6">
                                  <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                      Type <span className="text-red-600">DELETE</span> to confirm:
                                  </label>
                                  <input
                                      type="text"
                                      value={deleteConfirmText}
                                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                      placeholder="DELETE"
                                  />
                              </div>
                              <div className="flex gap-4">
                                  <Button
                                      variant="outline"
                                      onClick={() => {
                                          setDeleteProjectId(null);
                                          setDeleteConfirmText('');
                                      }}
                                      className="flex-1"
                                  >
                                      Cancel
                                  </Button>
                                  <Button
                                      variant="destructive"
                                      onClick={handleDelete}
                                      className="flex-1"
                                  >
                                      Delete Project
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* AI Modal */}
              {showAiModal && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-[800px] max-h-[80vh] overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100">AI-Generated Tasks</CardTitle>
                              <p className="text-slate-600 dark:text-slate-400">
                                  Review the AI suggestions below and create tasks
                              </p>
                          </CardHeader>
                          <CardContent>
                              <div className="space-y-4 mb-6">
                                  {aiSugesstions.map((task, index) => (
                                      <div key={index} className="border rounded p-4 dark:bg-slate-700 dark:border-slate-600">
                                          <h3 className="font-bold text-lg mb-2 dark:text-slate-100">{task.title}</h3>
                                          <p className="text-sm mb-3 dark:text-slate-300">{task.description}</p>
                                          <div className="flex gap-3 flex-wrap">
                                              <Badge>Priority: {task.priority}</Badge>
                                              <Badge variant="secondary">Est: {task.estimated_hours}hrs</Badge>
                                              {task.tags.map((tag, i) => (
                                                  <Badge key={i} variant="outline">#{tag}</Badge>
                                              ))}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <div className="flex gap-4">
                                  <Button
                                      variant="outline"
                                      onClick={() => setShowAiModal(false)}
                                      className="flex-1"
                                  >
                                      Cancel
                                  </Button>
                                  <Button
                                      onClick={() => handleCreateTasks()}
                                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                                  >
                                      Create All Tasks
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Edit Task Modal */}
              {editTaskId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-[600px] dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100">Edit Task</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleEditTaskSubmit}>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Task Title</label>
                                      <input
                                          type="text"
                                          value={editTaskData.title}
                                          onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          required
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Description</label>
                                      <textarea
                                          value={editTaskData.description}
                                          onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          rows="3"
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Priority</label>
                                      <select
                                          value={editTaskData.priority}
                                          onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                      >
                                          <option value="low">Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high">High</option>
                                          <option value="urgent">Urgent</option>
                                      </select>
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Estimated Hours</label>
                                      <input
                                          type="number"
                                          value={editTaskData.estimated_hours}
                                          onChange={(e) => setEditTaskData({ ...editTaskData, estimated_hours: parseInt(e.target.value) })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          min="0"
                                      />
                                  </div>
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Status</label>
                                      <select
                                          value={editTaskData.status}
                                          onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                      >
                                          <option value="todo">To Do</option>
                                          <option value="in-progress">In Progress</option>
                                          <option value="review">Review</option>
                                          <option value="done">Done</option>
                                          <option value="blocked">Blocked</option>
                                      </select>
                                  </div>
                                  <div className="flex gap-4">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                              setEditTaskId(null);
                                              setEditTaskData({ title: '', description: '', priority: 'medium', estimated_hours: 0, status: 'todo'      
  });
                                          }}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">Update Task</Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Create Task Modal */}
              {showCreatetaskModal && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-[600px] dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100">Create New Task</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleTaskSubmit}>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Task Title</label>
                                      <input
                                          type="text"
                                          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          required
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Description</label>
                                      <textarea
                                          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          rows="3"
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Priority</label>
                                      <select
                                          onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                      >
                                          <option value="low">Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high">High</option>
                                          <option value="urgent">Urgent</option>
                                      </select>
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Estimated Hours</label>
                                      <input
                                          type="number"
                                          onChange={(e) => setTaskData({ ...taskData, estimated_hours: parseInt(e.target.value) })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          min="0"
                                      />
                                  </div>
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">Status</label>
                                      <select
                                          onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                      >
                                          <option value="todo">To Do</option>
                                          <option value="in-progress">In Progress</option>
                                          <option value="review">Review</option>
                                          <option value="done">Done</option>
                                          <option value="blocked">Blocked</option>
                                      </select>
                                  </div>
                                  <div className="flex gap-4">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                              setShowCreatetaskModal(false);
                                              setTaskData({ title: '', description: '', priority: 'medium', estimated_hours: 0, status: 'todo' });      
                                          }}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">Create</Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

          </div>
      </div>
  )
}

export default ProjectDetail;