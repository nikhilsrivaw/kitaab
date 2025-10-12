  import { useState, useEffect } from 'react';
  import { clientAPI, projectAPI } from '../services/api';
  import { useNavigate } from 'react-router-dom';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';


const Projects = () => {
    const navigate = useNavigate(); 
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: " ",
        client_id: ''

    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [editProjectId, setEditProjectId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '', client_id: '' });
    const [clients, setClients] = useState([]);

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


    const getClientName = (clientId) => {
        if (!clientId) return null;
        const client = clients.find(c => c.id === clientId);
        if (!client) return null;
        return client.company_name ? `${client.name} (${client.company_name})` : client.name;
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
            const dataToSend = {
                ...formData,
                client_id: formData.client_id === '' ? null : formData.client_id
            };
            const result = await projectAPI.create(dataToSend);
            if (result) {
                setShowCreateModal(false);
                fetchProjects();
                setFormData({ name: '', description: '', client_id: '' })

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
            setEditFormData({ name: '', description: '', client_id: '' });
            fetchProjects();
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        fetchClients();
        fetchProjects();
    }, [])




    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900
  dark:to-slate-800">
          <div className="container mx-auto px-8 py-12 pt-28">
              {/* Header */}
              <div className="mb-12 flex justify-between items-center">
                  <div>
                      <h1 className="font-serif text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          Projects
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                          Manage and track all your projects
                      </p>
                  </div>
                  <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                      size="lg"
                  >
                      + Create New Project
                  </Button>
              </div>

              {/* Loading State */}
              {loading && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-12">Loading projects...</p>
              )}

              {/* Error State */}
              {error && (
                  <Card className="border-0 bg-red-50 dark:bg-red-900/20 mb-8">
                      <CardContent className="p-4">
                          <p className="text-red-700 dark:text-red-400">{error}</p>
                      </CardContent>
                  </Card>
              )}

              {/* Empty State */}
              {!loading && !error && projects.length === 0 && (
                  <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                      <CardContent className="p-12 text-center">
                          <div className="mb-4 text-6xl">📁</div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                              No projects yet
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                              Get started by creating your first project
                          </p>
                          <Button
                              onClick={() => setShowCreateModal(true)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                          >
                              Create Your First Project
                          </Button>
                      </CardContent>
                  </Card>
              )}

              {/* Projects Grid */}
              {!loading && projects.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                          <Card
                              key={project.id}
                              onClick={() => navigate(`/projects/${project.id}`)}
                              className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all
  duration-300 hover:-translate-y-1 cursor-pointer group"
                          >
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600
  dark:group-hover:text-blue-400 transition-colors">
                                      {project.name}
                                  </CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                      {project.description}
                                  </p>
                                  {project.client_id && getClientName(project.client_id) && (
                                      <Badge variant="secondary" className="mb-4">
                                          {getClientName(project.client_id)}
                                      </Badge>
                                  )}
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                                      <span className="text-sm text-slate-500 dark:text-slate-400">
                                          View Details
                                      </span>
                                      <span className="text-blue-600 dark:text-blue-400">→</span>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              )}

              {/* Create Project Modal */}
              {showCreateModal && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                      <Card className="w-96 dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100">Create New Project</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleSubmit}>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Project Name
                                      </label>
                                      <input
                                          type="text"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          required
                                      />
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Description
                                      </label>
                                      <textarea
                                          name="description"
                                          value={formData.description}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"       
                                          rows="3"
                                      />
                                  </div>
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold mb-2 dark:text-slate-200">
                                          Client (Optional)
                                      </label>
                                      <select
                                          name="client_id"
                                          value={formData.client_id}
                                          onChange={handleChange}
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
                                          onClick={() => setShowCreateModal(false)}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">
                                          Create
                                      </Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

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
          </div>
      </div>
  );




}

export default Projects;