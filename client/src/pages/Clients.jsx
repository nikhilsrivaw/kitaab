  import React, { useState, useEffect } from 'react';
  import { clientAPI } from '../services/api';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
const Clients = () => {
    // State for clients list
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for create modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        website: '',
        industry: '',
        payment_terms: 'net 30',
        hourly_rate: 0,
        currency: 'USD',
        status: 'active',
        client_type: 'individual',
        notes: ''
    });

    // State for edit modal
    const [editClientId, setEditClientId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // State for delete modal
    const [deleteClientId, setDeleteClientId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Fetch all clients on mount
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const result = await clientAPI.getAll();
            if (result && result.data) {
                setClients(result.data.clients || result.data.result || []);
                
            }
        } catch (error) {
            setError('Failed to fetch clients');
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle create form change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle create form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await clientAPI.create(formData);
            if (result) {
                setShowCreateModal(false);
                setFormData({
                    name: '',
                    company_name: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    country: '',
                    website: '',
                    industry: '',
                    payment_terms: 'net 30',
                    hourly_rate: 0,
                    currency: 'USD',
                    status: 'active',
                    client_type: 'individual',
                    notes: ''
                });
                fetchClients();
            }
        } catch (error) {
            console.error('Error creating client:', error);
            setError('Failed to create client');
        }
    };

    // Handle edit form change
    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await clientAPI.update(editClientId, editFormData);
            if (result) {
                setEditClientId(null);
                setEditFormData({});
                fetchClients();
            }
        } catch (error) {
            console.error('Error updating client:', error);
            setError('Failed to update client');
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (deleteConfirmText.trim() !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }

        try {
            await clientAPI.delete(deleteClientId);
            setDeleteClientId(null);
            setDeleteConfirmText('');
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            setError('Failed to delete client');
        }
    };

    if (loading) return <div className="p-8">Loading clients...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

   

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900
  dark:to-slate-800">
          <div className="container mx-auto px-8 py-12 pt-28">
              {/* Header */}
              <div className="mb-12 flex justify-between items-center">
                  <div>
                      <h1 className="font-serif text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          Clients
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                          Manage your client relationships
                      </p>
                  </div>
                  <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                      size="lg"
                  >
                      + Add Client
                  </Button>
              </div>

              {/* Loading State */}
              {loading && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-12">Loading clients...</p>
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
              {!loading && !error && clients.length === 0 && (
                  <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                      <CardContent className="p-12 text-center">
                          <div className="mb-4 text-6xl">👥</div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                              No clients yet
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                              Get started by adding your first client
                          </p>
                          <Button
                              onClick={() => setShowCreateModal(true)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                          >
                              Add Your First Client
                          </Button>
                      </CardContent>
                  </Card>
              )}

              {/* Clients Grid */}
              {!loading && clients.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {clients.map((client) => (
                          <Card
                              key={client.id}
                              className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all
  duration-300 hover:-translate-y-1"
                          >
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                      {client.name}
                                  </CardTitle>
                                  {client.company_name && (
                                      <Badge variant="secondary" className="w-fit">
                                          {client.company_name}
                                      </Badge>
                                  )}
                              </CardHeader>
                              <CardContent>
                                  <div className="space-y-2 mb-4">
                                      <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
                                          <span className="font-medium">Email:</span> {client.email || 'N/A'}
                                      </p>
                                      {client.phone && (
                                          <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
                                              <span className="font-medium">Phone:</span> {client.phone}
                                          </p>
                                      )}
                                      {client.industry && (
                                          <Badge variant="outline" className="w-fit">
                                              {client.industry}
                                          </Badge>
                                      )}
                                  </div>
                                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                      <Button
                                          onClick={() => {
                                              setEditClientId(client.id);
                                              setEditFormData(client);
                                          }}
                                          variant="outline"
                                          className="flex-1"
                                      >
                                          Edit
                                      </Button>
                                      <Button
                                          onClick={() => setDeleteClientId(client.id)}
                                          variant="destructive"
                                          className="flex-1"
                                      >
                                          Delete
                                      </Button>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              )}

              {/* Create Modal */}
              {showCreateModal && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                      <Card className="w-full max-w-2xl dark:bg-slate-800 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100 text-2xl">Add New Client</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleSubmit}>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Name *</label>
                                          <input
                                              type="text"
                                              name="name"
                                              value={formData.name}
                                              onChange={handleChange}
                                              required
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Company Name</label>
                                          <input
                                              type="text"
                                              name="company_name"
                                              value={formData.company_name}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Email</label>
                                          <input
                                              type="email"
                                              name="email"
                                              value={formData.email}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Phone</label>
                                          <input
                                              type="text"
                                              name="phone"
                                              value={formData.phone}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div className="col-span-2">
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Address</label>
                                          <input
                                              type="text"
                                              name="address"
                                              value={formData.address}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">City</label>
                                          <input
                                              type="text"
                                              name="city"
                                              value={formData.city}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Country</label>
                                          <input
                                              type="text"
                                              name="country"
                                              value={formData.country}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Website</label>
                                          <input
                                              type="text"
                                              name="website"
                                              value={formData.website}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Industry</label>
                                          <input
                                              type="text"
                                              name="industry"
                                              value={formData.industry}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Hourly Rate</label>
                                          <input
                                              type="number"
                                              name="hourly_rate"
                                              value={formData.hourly_rate}
                                              onChange={handleChange}
                                              step="0.01"
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Currency</label>
                                          <input
                                              type="text"
                                              name="currency"
                                              value={formData.currency}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div className="col-span-2">
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Notes</label>
                                          <textarea
                                              name="notes"
                                              value={formData.notes}
                                              onChange={handleChange}
                                              rows="3"
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                  </div>
                                  <div className="flex gap-4 mt-6">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setShowCreateModal(false)}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">
                                          Create Client
                                      </Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Edit Modal */}
              {editClientId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                      <Card className="w-full max-w-2xl dark:bg-slate-800 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100 text-2xl">Edit Client</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleEditSubmit}>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Name *</label>
                                          <input
                                              type="text"
                                              name="name"
                                              value={editFormData.name || ''}
                                              onChange={handleEditChange}
                                              required
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Company Name</label>
                                          <input
                                              type="text"
                                              name="company_name"
                                              value={editFormData.company_name || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Email</label>
                                          <input
                                              type="email"
                                              name="email"
                                              value={editFormData.email || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Phone</label>
                                          <input
                                              type="text"
                                              name="phone"
                                              value={editFormData.phone || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div className="col-span-2">
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Address</label>
                                          <input
                                              type="text"
                                              name="address"
                                              value={editFormData.address || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">City</label>
                                          <input
                                              type="text"
                                              name="city"
                                              value={editFormData.city || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Country</label>
                                          <input
                                              type="text"
                                              name="country"
                                              value={editFormData.country || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Website</label>
                                          <input
                                              type="text"
                                              name="website"
                                              value={editFormData.website || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Industry</label>
                                          <input
                                              type="text"
                                              name="industry"
                                              value={editFormData.industry || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Hourly Rate</label>
                                          <input
                                              type="number"
                                              name="hourly_rate"
                                              value={editFormData.hourly_rate || ''}
                                              onChange={handleEditChange}
                                              step="0.01"
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Currency</label>
                                          <input
                                              type="text"
                                              name="currency"
                                              value={editFormData.currency || ''}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                      <div className="col-span-2">
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">Notes</label>
                                          <textarea
                                              name="notes"
                                              value={editFormData.notes || ''}
                                              onChange={handleEditChange}
                                              rows="3"
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                          />
                                      </div>
                                  </div>
                                  <div className="flex gap-4 mt-6">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setEditClientId(null)}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                      <Button type="submit" className="flex-1">
                                          Update Client
                                      </Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Delete Modal */}
              {deleteClientId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="text-red-600 dark:text-red-400">Delete Client</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="mb-4 dark:text-slate-300">
                                  Are you sure you want to delete this client? This action cannot be undone.
                              </p>
                              <div className="mb-6">
                                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">
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
                                          setDeleteClientId(null);
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
                                      Delete Client
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              )}
          </div>
      </div>
  );
};

export default Clients;
