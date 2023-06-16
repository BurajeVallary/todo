const gettask = document.getElementById('task');
const getTaskInput = document.getElementById('new-task');
function createTaskElement(task) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.onchange = () => markTaskAsDone(li, task.id);
  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.value = task.todo;
  taskInput.disabled = true;
  const deleteIcon = document.createElement('img');
  deleteIcon.src = 'delete.png';
  deleteIcon.alt = 'Delete';
  deleteIcon.className = 'delete-icon';
  deleteIcon.onclick = () => deleteTask(li, task.id);
  li.appendChild(checkbox);
  li.appendChild(taskInput);
  li.appendChild(deleteIcon);
  return li;
}


function fetchTodos(userId) {
  fetch(`https://dummyjson.com/todos/user/${userId}`)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.todos)) {
        data.todos.forEach(task => {
          const taskElement = createTaskElement(task);
          gettask.appendChild(taskElement);
        });
      } else {
        console.error('Invalid data format. Expected an array of todos.');
      }
    })
    .catch(error => console.error(error));
}


function addTask(newTask) {
  fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      todo: newTask,
      completed: false,
      userId: 5
    })
  })
    .then(response => response.json())
    .then(data => {
      const taskElement = createTaskElement(data);
      gettask.appendChild(taskElement);
      getTaskInput.value = '';
      showSuccessMessage('New task added successfully');
    })
    .catch(error => console.error(error));
}


function updateTask(taskId, completed) {
  fetch(`https://dummyjson.com/todos/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      completed: completed
    })
  })
    .then(response => response.json())
    .then(data => {
     
      console.log(data);
    })
    .catch(error => console.error(error));
}
function deleteTask(li, taskId) {
  fetch(`https://dummyjson.com/todos/${taskId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      li.remove();
      showSuccessMessage('Task deleted!');
    })
    .catch(error => console.error(error));
}


function markTaskAsDone(li, taskId) {
  const checkbox = li.querySelector('input[type="checkbox"]');
  const completed = checkbox.checked;
  updateTask(taskId, completed);
  li.classList.toggle('completed');
  showSuccessMessage('Task completed! :heavy_check_mark::tada:');
}


function showSuccessMessage(message) {
  const successMessage = document.createElement('p');
  successMessage.classList.add('success-message');
  successMessage.textContent = message;
  document.body.appendChild(successMessage);
  setTimeout(() => {
    successMessage.remove();
  }, 1000);
}


fetchTodos(1);
document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const newTask = getTaskInput.value;
  addTask(newTask);
});





