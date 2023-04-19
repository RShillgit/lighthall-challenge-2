import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the task data from the backend API
    const currentUserId = localStorage.getItem("UserId");
    fetch(`http://localhost:8000/tasks/${currentUserId}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the state with the task data
        setTaskTitle(data.title);
        setTaskDescription(data.description);
        setTaskStatus(data.status);
        setTaskDueDate(data.dueDate);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Send a PUT request to update the task data on the backend
    const currentUserId = localStorage.getItem("UserId");
    fetch(`http://localhost:8000/tasks/${currentUserId}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        dueDate: taskDueDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Navigate back to the task list page after the update is complete
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="taskTitle">Title:</label>
          <input
            type="text"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="taskDescription">Description:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="taskStatus">Status:</label>
          <select
            id="taskStatus"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="taskDueDate">Due Date:</label>
          <input
            type="date"
            id="taskDueDate"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
