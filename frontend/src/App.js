import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { signIn } from 'aws-amplify/auth';
import axios from 'axios';


function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    checkUser();
    fetchTasks();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await signIn.currentAuthenticatedUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://a024-54-146-30-178.ngrok-free.app/');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      await axios.post('https://a024-54-146-30-178.ngrok-free.app/', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://a024-54-146-30-178.ngrok-free.app/${taskId}`);
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

export default withAuthenticator(App);
