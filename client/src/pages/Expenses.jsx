import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { expenseAPI, projectAPI } from '../services/api';
import Navbar from '../components/Navbar';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';


const Expenses = () => {
    const { projectId } = useParams();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_id: '',
        amount: 0,
        category: '',
        description: '',
        date: ''
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState(null);
    const [deleteExpenseId, setDeleteExpenseId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        project_id: '',
        amount: 0,
        category: '',
        description: '',
        date: ''
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const result = await expenseAPI.getByProject(projectId);
            if (result && result.data && result.data.expenses) {
                setExpenses(result.data.expenses);
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
            await expenseAPI.update(editExpenseId, editFormData);


            setEditExpenseId(null);
            fetchExpenses();
            setEditFormData({
                project_id: "",

                amount: 0,
                category: '',
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
            const result = await expenseAPI.create({


                ...formData,
                project_id: projectId

            });
            if (result) {
                setShowCreateModal(false);
                fetchExpenses();
                setFormData({
                    project_id: "",

                    amount: 0,
                    category: '',
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
            await expenseAPI.delete(deleteExpenseId);
            setDeleteExpenseId(null);
            setDeleteConfirmText('');
            fetchExpenses();
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
        fetchExpenses();
    }, [projectId]);

     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900
  dark:to-slate-800">
          <div className="container mx-auto px-8 py-12 pt-28">
              {/* Header */}
              <div className="mb-12 flex justify-between items-center">
                  <div>
                      <h1 className="font-serif text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          Project Expenses
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                          Track and manage project expenses
                      </p>
                  </div>
                  <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                      size="lg"
                  >
                      + Add Expense
                  </Button>
              </div>

              {/* Loading State */}
              {loading && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-12">Loading expenses...</p>
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
              {!loading && !error && expenses.length === 0 && (
                  <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                      <CardContent className="p-12 text-center">
                          <div className="mb-4 text-6xl">💸</div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                              No expenses yet
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                              Start tracking your project expenses
                          </p>
                          <Button
                              onClick={() => setShowCreateModal(true)}
                              className="bg-rose-600 hover:bg-rose-700"
                          >
                              Add Your First Expense
                          </Button>
                      </CardContent>
                  </Card>
              )}

              {/* Expenses Grid */}
              {!loading && expenses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expenses.map((expense) => (
                          <Card
                              key={expense.id}
                              className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all
  duration-300 hover:-translate-y-1"
                          >
                              <CardHeader>
                                  <div className="flex items-center justify-between mb-2">
                                      <CardTitle className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                                          ${parseFloat(expense.amount).toFixed(2)}
                                      </CardTitle>
                                      <Badge variant="destructive" className="w-fit">
                                          {expense.category}
                                      </Badge>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                      {expense.description || 'No description'}
                                  </p>
                                  <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">
                                      {new Date(expense.date).toLocaleDateString()}
                                  </p>
                                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                      <Button
                                          onClick={() => {
                                              setEditExpenseId(expense.id);
                                              setEditFormData({
                                                  project_id: expense.project_id,
                                                  amount: expense.amount,
                                                  category: expense.category,
                                                  description: expense.description,
                                                  date: expense.date
                                              });
                                          }}
                                          variant="outline"
                                          className="flex-1"
                                      >
                                          Edit
                                      </Button>
                                      <Button
                                          onClick={() => setDeleteExpenseId(expense.id)}
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
                      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100 text-2xl">Add Expense</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleSubmit}>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Amount ($) *
                                          </label>
                                          <input
                                              type="number"
                                              name="amount"
                                              value={formData.amount}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              step="0.01"
                                              required
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Category *
                                          </label>
                                          <input
                                              type="text"
                                              name="category"
                                              value={formData.category}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              placeholder="e.g., Food, Hosting, Tools"
                                              required
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Description
                                          </label>
                                          <textarea
                                              name="description"
                                              value={formData.description}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              rows="3"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Date *
                                          </label>
                                          <input
                                              type="date"
                                              name="date"
                                              value={formData.date}
                                              onChange={handleChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              required
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
                                          Add Expense
                                      </Button>
                                  </div>
                              </form>
                          </CardContent>
                      </Card>
                  </div>
              )}

              {/* Edit Modal */}
              {editExpenseId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="dark:text-slate-100 text-2xl">Edit Expense</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <form onSubmit={handleEditSubmit}>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Amount ($) *
                                          </label>
                                          <input
                                              type="number"
                                              name="amount"
                                              value={editFormData.amount}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              step="0.01"
                                              required
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Category *
                                          </label>
                                          <input
                                              type="text"
                                              name="category"
                                              value={editFormData.category}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              required
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Description
                                          </label>
                                          <textarea
                                              name="description"
                                              value={editFormData.description}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              rows="3"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium mb-2 dark:text-slate-200">
                                              Date *
                                          </label>
                                          <input
                                              type="date"
                                              name="date"
                                              value={editFormData.date}
                                              onChange={handleEditChange}
                                              className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600
  dark:text-slate-100"
                                              required
                                          />
                                      </div>
                                  </div>
                                  <div className="flex gap-4 mt-6">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                              setEditExpenseId(null);
                                              setEditFormData({
                                                  project_id: '',
                                                  amount: 0,
                                                  category: '',
                                                  description: '',
                                                  date: ''
                                              });
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

              {/* Delete Modal */}
              {deleteExpenseId && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700">
                          <CardHeader>
                              <CardTitle className="text-red-600 dark:text-red-400">Delete Expense</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="mb-4 dark:text-slate-300">
                                  Are you sure you want to delete this expense? This action cannot be undone.
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
                                          setDeleteExpenseId(null);
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
                                      Delete Expense
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

export default Expenses;