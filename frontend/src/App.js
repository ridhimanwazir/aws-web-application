import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://middleware.us-east-1.elasticbeanstalk.com:5000/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      await axios.post('http://middleware.us-east-1.elasticbeanstalk.com:5000/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://middleware.us-east-1.elasticbeanstalk.com:5000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
