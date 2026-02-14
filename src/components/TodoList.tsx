import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  onTodosChange: (todos: TodoItem[]) => void;
  darkMode: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onTodosChange, darkMode }) => {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      onTodosChange([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    onTodosChange(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    onTodosChange(todos.filter((t) => t.id !== id));
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      onTodosChange(
        todos.map((t) => (t.id === editingId ? { ...t, text: editText.trim() } : t))
      );
      setEditingId(null);
      setEditText('');
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className={cn(
      "rounded-2xl p-4",
      darkMode ? "bg-gray-800" : "bg-white shadow-lg"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn("text-lg font-bold flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          ✅ Todo List
        </h3>
        <span className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
          {completedCount}/{todos.length} done
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm",
            darkMode 
              ? "bg-gray-700 text-white placeholder-gray-400" 
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          )}
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {todos.length === 0 ? (
          <p className={cn("text-center py-4 text-sm", darkMode ? "text-gray-500" : "text-gray-400")}>
            No tasks yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                darkMode ? "bg-gray-700" : "bg-gray-50"
              )}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  todo.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : darkMode 
                      ? "border-gray-500 hover:border-green-500" 
                      : "border-gray-300 hover:border-green-500"
                )}
              >
                {todo.completed && '✓'}
              </button>
              
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  autoFocus
                  className={cn(
                    "flex-1 px-2 py-1 rounded text-sm",
                    darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-800"
                  )}
                />
              ) : (
                <span
                  className={cn(
                    "flex-1 text-sm",
                    todo.completed && "line-through opacity-50",
                    darkMode ? "text-white" : "text-gray-700"
                  )}
                >
                  {todo.text}
                </span>
              )}

              <button
                onClick={() => startEdit(todo)}
                className={cn("text-sm px-2", darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600")}
              >
                ✏️
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-500 text-sm px-2"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
