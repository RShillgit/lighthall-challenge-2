import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function App(props) {

  const [currentUser, setCurrentUser] = useState();

  const [addTaskDisplay, setAddTaskDisplay] = useState(); // Display for the add task form

  const [editTaskDisplay, setEditTaskDisplay] = useState(); // Display for the edit task form
  const [currentlyEditingTask, setCurrentlyEditingTask] = useState(false); // Used to toggle between editing a task and normal display
  const taskBeingEdited = useRef(); // Current task being edited

  // Edit task form input values
  const [editTitle, setEditTitle] = useState();
  const [editDescription, setEditDescription] = useState();
  const [editStatus, setEditStatus] = useState();
  const [editDueDate, setEditDueDate] = useState();

  const [deleteConfirmationDisplay, setDeleteConfirmationDisplay] = useState();

  // Add task form input values
  const title = useRef();
  const description = useRef();
  const status = useRef();
  const dueDate = useRef();

  const navigate = useNavigate();

  //Add searchkeyword and sortfield
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState('');

  // On mount check for user in local storage
  useEffect(() => {
    
    const currentUserId = localStorage.getItem('UserId');
    
    if(currentUserId) {

      // Get request to find all tasks for this user
      fetch(props.serverURL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({currentUserId})
      })
      .then(res => res.json())
      .then(data => {

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

  // Anytime the currentlyEditingTask variable or the inputs in the edit task form  change
  useEffect(() => {

    // If we are currently editing a task set the display edit task form
    if(currentlyEditingTask) {
      setEditTaskDisplay(editTaskForm)
    }
    // Else remove edit task form
    else {
      setEditTaskDisplay();
    }
    
  }, [currentlyEditingTask, editTitle, editDescription, editStatus, editDueDate])

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
              required={true}
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
            <select onChange={(e) => status.current = (e.target.value)} required={true}>
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
              required={true}
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

    fetch(`${props.serverURL}/tasks`, {
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

  // Sets neccessary state variables to display the edit task form
  const editTaskButtonClick = (task) => {

    taskBeingEdited.current = task;

    // Format the due date string so it can be used as an input value
    const taskDueDate = new Date(task.due_date);
    let day = taskDueDate.getDate() + 1;
    let month = taskDueDate.getMonth() + 1;
    let year = taskDueDate.getFullYear();

    // Add a zero in front of 1 digit months and days
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    const inputCompatibleDate = `${year}-${month}-${day}`;

    // Set editing variables
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status)
    setEditDueDate(inputCompatibleDate);

    // Change currently editing task status to true
    setCurrentlyEditingTask(true);
  } 

  // Handles edit task form submit
  const editTaskFormSubmit = (e) => {
    e.preventDefault();

    // Send edited information to the backend
    fetch(`${props.serverURL}/tasks/${taskBeingEdited.current._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        userId: currentUser._id,
        editTitle,
        editDescription,
        editStatus,
        editDueDate
      }),
    })
    .then((res) => res.json())
    .then(data => {
      // If it was successful
      if(data.success) {
        // Set current user with the updated information
        setCurrentUser(data.updatedUser);

        // Remove edit task form
        setCurrentlyEditingTask(false);
      }
    })
    .catch(err => console.log(err))
  }

  // Cancels the edit task form
  const cancelEditTask = () => {
    setCurrentlyEditingTask(false);
  }

  // Confirm task delete popup
  const deleteConfirm = (taskId) => {

    if (!taskId) {
      console.error('Invalid task ID:', taskId);
      return;
    }
    fetch(`${props.serverURL}/tasks/${taskId}?userId=${currentUser._id}`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setCurrentUser(data.updatedUser);
        setDeleteConfirmationDisplay();
      }
    })
    .catch(err => console.log(err));
  }

  // Cancels task delete
  const cancelTaskDelete = () => {
    setDeleteConfirmationDisplay();
  }

  // Renders delete task confirmation
  const deleteTask = (taskId) => {

    setDeleteConfirmationDisplay(
      <div className='deleteContainer'>
        <p>Are you sure you want to delete</p>
        <button onClick={() => cancelTaskDelete()}>
          Cancel
        </button>
        <button onClick={() => deleteConfirm(taskId)}>Confirm</button>
      </div>
    )
  }

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
    let day = taskDate.getDate() + 1;

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

  // Form for editing a specific task
  const editTaskForm = (
    <>
      {(taskBeingEdited.current)
      ?
      <div className='editTaskContainer'>
        <form id='editTaskForm' onSubmit={editTaskFormSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={editTitle} required={true}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea name="description" value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            ></textarea>
          </label>
          <label>
            Status:
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} required={true}>
              <option value="">Select status</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label>
            Due Date:
            <input type="date" name="dueDate" value={editDueDate} required={true}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </label>
        </form>
        <div className='editTaskForm-buttons'>
          <button onClick={cancelEditTask}>Cancel</button>
          <button form='editTaskForm'>Submit</button>
        </div>
      </div>
      :
      <></>
      }
    </>
  )

  // Sorting & Filter for tasks list
  const sortAndFilterTasks = () => {
    let filteredTasks = currentUser.tasks.filter(task => task.title.includes(searchKeyword));
    
    if (sortField === 'title') {
      filteredTasks = filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortField === 'status') {
      filteredTasks = filteredTasks.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortField === 'due_date') {
      filteredTasks = filteredTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }
    
    return filteredTasks.map(task => (
      <div className="individualTasks" key={task._id}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p>Status: {task.status}</p>
        <p>Due Date: {formatDate(task.due_date)}</p>
        <button onClick={() => deleteTask(task._id)}>Delete</button>
        <button onClick={() => editTaskButtonClick(task)}>Edit</button>
      </div>
    ));
  };

  return (
    <>
      {currentUser
        ?
        <div className="App">
          <h1>Home</h1>
          <div className="searchAndSort">
            <input type="text" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="Search by title" />
            <select value={sortField} onChange={e => setSortField(e.target.value)}>
              <option value="">Sort by</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="due_date">Due date</option>
            </select>
          </div>
          {currentUser && currentUser.tasks.length > 0 ? (
            <div className="allTasks">
              {sortAndFilterTasks()}
            </div>
          ) : (
            <div className="noTasks">
              <p>The task list is empty.</p>
            </div>
          )}
          {addTaskDisplay}
          {editTaskDisplay}
          {deleteConfirmationDisplay}
          <button onClick={logUserOut}>Logout</button>
          <button onClick={addTaskButtonClick}>Add Task</button>
        </div>
        :
        <></>
      }
    </>
    );
  };  

export default App;

