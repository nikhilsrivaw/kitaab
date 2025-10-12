 import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

  const KanbanBoard = ({ tasks, onDragEnd, onEditTask, onDeleteTask }) => {

      // Define columns
      const columns = {
          'todo': { title: 'To Do', color: 'bg-blue-100', textColor: 'text-blue-800' },
          'in-progress': { title: 'In Progress', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
          'review': { title: 'Review', color: 'bg-purple-100', textColor: 'text-purple-800' },
          'done': { title: 'Done', color: 'bg-green-100', textColor: 'text-green-800' },
          'blocked': { title: 'Blocked', color: 'bg-red-100', textColor: 'text-red-800' }
      };

      // Group tasks by status
      const tasksByStatus = Object.keys(columns).reduce((acc, status) => {
          acc[status] = tasks.filter(task => task.status === status);
          return acc;
      }, {});

      return (
          <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-5 gap-4">
                  {Object.entries(columns).map(([status, column]) => (
                      <div key={status} className="flex flex-col">
                          {/* Column Header */}
                          <div className={`${column.color} ${column.textColor} p-3 rounded-t-lg font-bold text-center`}>
                              {column.title} ({tasksByStatus[status].length})
                          </div>

                          {/* Droppable Column */}
                          <Droppable droppableId={status}>
                              {(provided, snapshot) => (
                                  <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`flex-1 p-2 rounded-b-lg border-2 min-h-[400px] ${
                                          snapshot.isDraggingOver ? 'bg-gray-100 border-blue-400' : 'bg-gray-50 border-gray-200'
                                      }`}
                                  >
                                      {/* Tasks in this column */}
                                      {tasksByStatus[status].map((task, index) => (
                                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                              {(provided, snapshot) => (
                                                  <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      className={`bg-white p-3 rounded shadow mb-2 ${
                                                          snapshot.isDragging ? 'shadow-lg' : ''
                                                      }`}
                                                  >
                                                      {/* Task Card Content */}
                                                      <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                                                      {task.description && (
                                                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                                                      )}
                                                      <div className="flex justify-between items-center text-xs">
                                                          <span className={`px-2 py-1 rounded ${
                                                              task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                              'bg-gray-100 text-gray-800'
                                                          }`}>
                                                              {task.priority}
                                                          </span>
                                                          <span className="text-gray-500">{task.estimated_hours}h</span>
                                                      </div>

                                                      {/* Edit/Delete Buttons */}
                                                      <div className="flex gap-2 mt-2">
                                                          <button
                                                              onClick={() => onEditTask(task)}
                                                              className="text-blue-600 hover:text-blue-800 text-xs"
                                                          >
                                                              Edit
                                                          </button>
                                                          <button
                                                              onClick={() => onDeleteTask(task.id)}
                                                              className="text-red-600 hover:text-red-800 text-xs"
                                                          >
                                                              Delete
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                          </Draggable>
                                      ))}
                                      {provided.placeholder}
                                  </div>
                              )}
                          </Droppable>
                      </div>
                  ))}
              </div>
          </DragDropContext>
      );
  };

  export default KanbanBoard;