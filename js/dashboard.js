const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const welcomeMessage = document.getElementById('welcomeMessage');

const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

const getTasks = () => JSON.parse(localStorage.getItem('tasks') || '[]');

const saveTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

function renderWelcome() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'index.html';
  } else {
    welcomeMessage.textContent = `Welcome back, ${username}`;
  }
}

function renderTasks(filter = 'all') {
  const tasks = getTasks();
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

    const time = document.createElement('div');
    time.className = 'task-time';
    time.textContent = task.createdAt;

    item.append(checkbox, text, time);
    taskList.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const tasks = getTasks();
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
  const tasks = getTasks();
  tasks.push({
    id: Date.now(),
    text,
    status: 'pending',
    createdAt: new Date().toLocaleString()
  });
  saveTasks(tasks);
  taskInput.value = '';
  renderTasks(currentFilter);
}

function toggleTaskStatus(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  task.status = task.status === 'pending' ? 'done' : 'pending';
  saveTasks(tasks);
  renderTasks(currentFilter);
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

// Initial
renderWelcome();
renderTasks();
