const input = document.getElementById('todo-input');
const deadlineInput = document.getElementById('deadline-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

function updateEmptyMessage() {
  emptyMessage.style.display = list.children.length === 0 ? 'block' : 'none';
}

function saveTodos() {
  const todos = Array.from(list.querySelectorAll('li')).map(li => ({
    text: li.querySelector('.todo-text').textContent,
    done: li.classList.contains('done'),
    deadline: li.dataset.deadline || '',
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDeadline(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  deadline.setHours(0, 0, 0, 0);
  const diff = (deadline - today) / (1000 * 60 * 60 * 24);

  const label = deadline.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });

  if (diff < 0) return { label: `${label}（期限切れ）`, status: 'overdue' };
  if (diff === 0) return { label: `${label}（今日まで）`, status: 'today' };
  if (diff === 1) return { label: `${label}（明日まで）`, status: 'soon' };
  return { label, status: 'normal' };
}

function createTodoItem(text, done = false, deadline = '') {
  const li = document.createElement('li');
  if (done) li.classList.add('done');
  if (deadline) li.dataset.deadline = deadline;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    saveTodos();
  });

  const content = document.createElement('div');
  content.className = 'todo-content';

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;
  content.appendChild(span);

  if (deadline) {
    const info = formatDeadline(deadline);
    if (info) {
      const badge = document.createElement('span');
      badge.className = `deadline-badge ${info.status}`;
      badge.textContent = `📅 ${info.label}`;
      content.appendChild(badge);
      if (info.status === 'overdue' && !done) li.classList.add('overdue');
    }
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTodos();
    updateEmptyMessage();
  });

  li.appendChild(checkbox);
  li.appendChild(content);
  li.appendChild(deleteBtn);
  return li;
}

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;

  list.appendChild(createTodoItem(text, false, deadlineInput.value));
  input.value = '';
  deadlineInput.value = '';
  saveTodos();
  updateEmptyMessage();
}

function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;
  JSON.parse(saved).forEach(({ text, done, deadline }) => {
    list.appendChild(createTodoItem(text, done, deadline || ''));
  });
}

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

loadTodos();
updateEmptyMessage();
