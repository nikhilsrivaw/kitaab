import React, { useState, useEffect } from 'react';
import { clientAPI } from '../services/api';
import Navbar from '../components/Navbar';

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
        
          <div className="p-8">
            
              <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Clients</h1>
                  <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                      Add Client
                  </button>
              </div>

              {/* Clients Grid */}
              {clients.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                      No clients yet. Add your first client!
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {clients.map((client) => (
                          <div key={client.id} className="bg-white p-6 rounded-lg shadow-md border">
                              <h3 className="text-xl font-semibold mb-2">{client.name}</h3>
                              {client.company_name && (
                                  <p className="text-gray-600 mb-2">{client.company_name}</p>
                              )}
                              <p className="text-gray-600 text-sm mb-2">{client.email}</p>
                              {client.phone && (
                                  <p className="text-gray-600 text-sm mb-2">{client.phone}</p>
                              )}
                              <div className="mt-4 flex gap-2">
                                  <button
                                      onClick={() => {
                                          setEditClientId(client.id);
                                          setEditFormData(client);
                                      }}
                                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                  >
                                      Edit
                                  </button>
                                  <button
                                      onClick={() => setDeleteClientId(client.id)}
                                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                  >
                                      Delete
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {/* Create Modal */}
              {showCreateModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
                          <form onSubmit={handleSubmit}>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Name *</label>
                                      <input
                                          type="text"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          required
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Company Name</label>
                                      <input
                                          type="text"
                                          name="company_name"
                                          value={formData.company_name}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Email</label>
                                      <input
                                          type="email"
                                          name="email"
                                          value={formData.email}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Phone</label>
                                      <input
                                          type="text"
                                          name="phone"
                                          value={formData.phone}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div className="col-span-2">
                                      <label className="block text-sm font-medium mb-2">Address</label>
                                      <input
                                          type="text"
                                          name="address"
                                          value={formData.address}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">City</label>
                                      <input
                                          type="text"
                                          name="city"
                                          value={formData.city}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Country</label>
                                      <input
                                          type="text"
                                          name="country"
                                          value={formData.country}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Website</label>
                                      <input
                                          type="text"
                                          name="website"
                                          value={formData.website}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Industry</label>
                                      <input
                                          type="text"
                                          name="industry"
                                          value={formData.industry}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Hourly Rate</label>
                                      <input
                                          type="number"
                                          name="hourly_rate"
                                          value={formData.hourly_rate}
                                          onChange={handleChange}
                                          step="0.01"
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Currency</label>
                                      <input
                                          type="text"
                                          name="currency"
                                          value={formData.currency}
                                          onChange={handleChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div className="col-span-2">
                                      <label className="block text-sm font-medium mb-2">Notes</label>
                                      <textarea
                                          name="notes"
                                          value={formData.notes}
                                          onChange={handleChange}
                                          rows="3"
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                              </div>
                              <div className="flex justify-end gap-4 mt-6">
                                  <button
                                      type="button"
                                      onClick={() => setShowCreateModal(false)}
                                      className="px-6 py-2 border rounded hover:bg-gray-100"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      type="submit"
                                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                      Create Client
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* Edit Modal - Similar to Create but with pre-filled data */}
              {editClientId && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <h2 className="text-2xl font-bold mb-6">Edit Client</h2>
                          <form onSubmit={handleEditSubmit}>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Name *</label>
                                      <input
                                          type="text"
                                          name="name"
                                          value={editFormData.name || ''}
                                          onChange={handleEditChange}
                                          required
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Company Name</label>
                                      <input
                                          type="text"
                                          name="company_name"
                                          value={editFormData.company_name || ''}
                                          onChange={handleEditChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Email</label>
                                      <input
                                          type="email"
                                          name="email"
                                          value={editFormData.email || ''}
                                          onChange={handleEditChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium mb-2">Phone</label>
                                      <input
                                          type="text"
                                          name="phone"
                                          value={editFormData.phone || ''}
                                          onChange={handleEditChange}
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                                  <div className="col-span-2">
                                      <label className="block text-sm font-medium mb-2">Notes</label>
                                      <textarea
                                          name="notes"
                                          value={editFormData.notes || ''}
                                          onChange={handleEditChange}
                                          rows="3"
                                          className="w-full border rounded px-3 py-2"
                                      />
                                  </div>
                              </div>
                              <div className="flex justify-end gap-4 mt-6">
                                  <button
                                      type="button"
                                      onClick={() => setEditClientId(null)}
                                      className="px-6 py-2 border rounded hover:bg-gray-100"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      type="submit"
                                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                      Update Client
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* Delete Modal */}
              {deleteClientId && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg p-8 max-w-md w-full">
                          <h2 className="text-2xl font-bold mb-4">Delete Client</h2>
                          <p className="mb-4">Type DELETE to confirm:</p>
                          <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              className="w-full border rounded px-3 py-2 mb-4"
                              placeholder="Type DELETE"
                          />
                          <div className="flex justify-end gap-4">
                              <button
                                  onClick={() => {
                                      setDeleteClientId(null);
                                      setDeleteConfirmText('');
                                  }}
                                  className="px-6 py-2 border rounded hover:bg-gray-100"
                              >
                                  Cancel
                              </button>
                              <button
                                  onClick={handleDelete}
                                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                  Delete
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
    );
};

export default Clients;
