// dashboard.js

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const welcomeMessage = document.getElementById('welcomeMessage');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let currentUser = localStorage.getItem('username');

function getAllUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveAllUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getUserTasks() {
  const allUsers = getAllUsers();
  return allUsers[currentUser] || [];
}

function saveUserTasks(tasks) {
  const allUsers = getAllUsers();
  allUsers[currentUser] = tasks;
  saveAllUsers(allUsers);
}

function renderWelcome() {
  if (!currentUser) {
    window.location.href = 'index.html';
  } else {
    welcomeMessage.textContent = `Welcome back, ${currentUser}`;
  }
}

function renderTasks(filter = 'all') {
  const tasks = getUserTasks();
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true : task.status === filter
  );

  filteredTasks.forEach(task => {
    const item = document.createElement('div');
    item.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.status === 'done';
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = task.text;
    if (task.status === 'done') {
      text.style.textDecoration = 'line-through';
    }

    const time = document.createElement('div');
    time.className = 'task-time';
    time.textContent = task.createdAt;

    const controls = document.createElement('div');
    controls.className = 'task-controls';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    controls.append(editBtn, deleteBtn);
    item.append(checkbox, text, time, controls);
    taskList.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const tasks = getUserTasks();
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('completedCount').textContent = tasks.filter(t => t.status === 'done').length;
  document.getElementById('pendingCount').textContent = tasks.filter(t => t.status === 'pending').length;

  document.getElementById('allCount').textContent = tasks.length;
  document.getElementById('pendingFilterCount').textContent = tasks.filter(t => t.status === 'pending').length;
  document.getElementById('doneFilterCount').textContent = tasks.filter(t => t.status === 'done').length;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  const tasks = getUserTasks();
  tasks.push({
    id: Date.now(),
    text,
    status: 'pending',
    createdAt: new Date().toLocaleString()
  });
  saveUserTasks(tasks);
  taskInput.value = '';
  renderTasks(currentFilter);
}

function toggleTaskStatus(id) {
  const tasks = getUserTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.status = task.status === 'pending' ? 'done' : 'pending';
  saveUserTasks(tasks);
  renderTasks(currentFilter);
}

function editTask(id) {
  const tasks = getUserTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const taskDivs = document.querySelectorAll('.task-item');
  taskDivs.forEach(div => {
    const textDiv = div.querySelector('.task-text');
    if (textDiv && textDiv.textContent === task.text) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.classList.add('edit-input');

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.classList.add('save-btn');
      saveBtn.addEventListener('click', () => {
        const newText = input.value.trim();
        if (newText) {
          task.text = newText;
          saveUserTasks(tasks);
          renderTasks(currentFilter);
        }
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.classList.add('cancel-btn');
      cancelBtn.addEventListener('click', renderTasks);

      const parent = textDiv.parentElement;
      textDiv.replaceWith(input);
      const controls = parent.querySelector('.task-controls');
      controls.innerHTML = '';
      controls.append(saveBtn, cancelBtn);
    }
  });
}

function deleteTask(id) {
  let tasks = getUserTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveUserTasks(tasks);
  renderTasks(currentFilter);
  showToast('Task deleted');
}

addTaskBtn.addEventListener('click', addTask);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks(currentFilter);
  });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});

const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all your tasks?')) {
    const allUsers = getAllUsers();
    allUsers[currentUser] = [];
    saveAllUsers(allUsers);
    renderTasks();
    updateStats();
    showToast('All tasks cleared!');
  }
});

// Show toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initial render
renderWelcome();
renderTasks();
