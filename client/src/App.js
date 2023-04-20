import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function App() {

  const [currentUser, setCurrentUser] = useState();

  const [addTaskDisplay, setAddTaskDisplay] = useState();

  const title = useRef();
  const description = useRef();
  const status = useRef();
  const dueDate = useRef();
  const navigate = useNavigate();

  // On mount check for user in local storage
  useEffect(() => {

    const currentUserId = localStorage.getItem('UserId');
    
    if(currentUserId) {

      // Get request to find all tasks for this user
      fetch('http://localhost:8000/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({currentUserId})
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        // If the user has been found
        if (data.success) {
          setCurrentUser(data.currentUser)
        }
      })
      .catch(err => console.log(err))
    }
    else {
      navigate('/login');
    }

  }, [])

  // Sets form display for adding a new task
  const addTaskButtonClick = () => {
    setAddTaskDisplay(
      <div>
        <h2>Add Task</h2>
        <form onSubmit={addTaskFormSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              onChange={(e) => title.current = (e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              onChange={(e) => description.current = (e.target.value)}
            ></textarea>
          </label>
          <label>
            Status:
            <select onChange={(e) => status.current = (e.target.value)}>
              <option value="">Select status</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              onChange={(e) => dueDate.current = (e.target.value)}
            />
          </label>
          <button type="submit">Add Task</button>
        </form>
      </div>
    )
  }

  // Add Task
  const addTaskFormSubmit = (e) => {
    e.preventDefault();

    const newTaskRequest = {
      currentUser: currentUser,
      title: title.current,
      description: description.current,
      status: status.current,
      dueDate: dueDate.current
    }

    fetch(`http://localhost:8000/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({newTaskRequest}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.success) {
          // set updated current user state
          setCurrentUser(data.updatedUser);
          // Remove add task form
          setAddTaskDisplay();
        }
      })
      .catch((err) => console.log(err));
  };

  // Logs user out
  const logUserOut = () => {
    // Remove user from local storage
    localStorage.removeItem('UserId');

    // Navigate to login 
    navigate('/login');
  }

  // Formats timestamp into MM/DD/YYYY
  const formatDate = (timestamp) => {

    const taskDate = new Date(timestamp);

    // Day
    let day = taskDate.getDate();

    // Month
    let month = taskDate.getMonth() + 1;

    // Year
    let year = taskDate.getFullYear();

    // 2 digit months and days
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    let formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }

  return (
    <div className="App">
      
      <h1>Home</h1>

      <button onClick={logUserOut}>Logout</button>

      <button onClick={addTaskButtonClick}>Add Task</button>

      {(currentUser && currentUser.tasks.length > 0)
        ?
        <div className='allTasks'>
          {currentUser.tasks.map(task => {
            return (
              <div className='individualTask' key={task._id}>
                <button>Edit</button>
                <button>Delete</button>
                <p>{task.title}</p>
                <p>{task.description}</p>
                <p>{task.status}</p>
                <p>{formatDate(task.due_date)}</p>
              </div>
            )
          })}
        </div>
        :
        <div className='noTasks'>
          <p>The task list is empty.</p>
          <Link to='/tasks/add'><button>Add Task</button></Link>
        </div>
      }

      {addTaskDisplay}
   
    </div>
  );
}

export default App;
