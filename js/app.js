// ============================================
// 1. ESTADO DE LA APLICACIÓN
// ============================================
let tasks = [];
let currentFilter = 'all';

// ============================================
// 2. REFERENCIAS AL DOM
// ============================================
const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const filterBtns = document.querySelectorAll('.filter-btn');

// Campos del formulario
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const dueDateInput = document.getElementById('dueDate');
const confirmTitleInput = document.getElementById('confirmTitle');

// Mensajes de error
const titleError = document.getElementById('titleError');
const categoryError = document.getElementById('categoryError');
const dueDateError = document.getElementById('dueDateError');
const confirmError = document.getElementById('confirmError');

// ============================================
// 3. VALIDACIONES
// ============================================
function validateTitle(title) {
    if (!title || title.trim().length === 0) {
        return { valid: false, message: 'El título es requerido' };
    }
    if (title.trim().length < 3) {
        return { valid: false, message: 'El título debe tener al menos 3 caracteres' };
    }
    if (title.trim().length > 50) {
        return { valid: false, message: 'El título no puede exceder 50 caracteres' };
    }
    return { valid: true, message: '' };
}

function validateCategory(category) {
    if (!category) {
        return { valid: false, message: 'Selecciona una categoría' };
    }
    return { valid: true, message: '' };
}

function validateDueDate(date) {
    if (!date) {
        return { valid: false, message: 'La fecha límite es requerida' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (selectedDate < today) {
        return { valid: false, message: 'La fecha debe ser hoy o en el futuro' };
    }
    return { valid: true, message: '' };
}

function validateConfirmTitle(title, confirmTitle) {
    if (!confirmTitle || confirmTitle.trim().length === 0) {
        return { valid: false, message: 'Confirma el título escribiéndolo nuevamente' };
    }
    if (title.trim() !== confirmTitle.trim()) {
        return { valid: false, message: 'El título no coincide' };
    }
    return { valid: true, message: '' };
}

function validateForm(data) {
    const titleValidation = validateTitle(data.title);
    const categoryValidation = validateCategory(data.category);
    const dueDateValidation = validateDueDate(data.dueDate);
    const confirmValidation = validateConfirmTitle(data.title, data.confirmTitle);

    // Mostrar errores en el DOM
    titleError.textContent = titleValidation.valid ? '' : titleValidation.message;
    titleInput.classList.toggle('error', !titleValidation.valid);

    categoryError.textContent = categoryValidation.valid ? '' : categoryValidation.message;
    categoryInput.classList.toggle('error', !categoryValidation.valid);

    dueDateError.textContent = dueDateValidation.valid ? '' : dueDateValidation.message;
    dueDateInput.classList.toggle('error', !dueDateValidation.valid);

    confirmError.textContent = confirmValidation.valid ? '' : confirmValidation.message;
    confirmTitleInput.classList.toggle('error', !confirmValidation.valid);

    return titleValidation.valid && 
           categoryValidation.valid && 
           dueDateValidation.valid && 
           confirmValidation.valid;
}

// ============================================
// 4. CRUD DE TAREAS
// ============================================
function createTask(data) {
    const newTask = {
        id: Date.now(),
        title: data.title.trim(),
        description: data.description.trim() || 'Sin descripción',
        category: data.category,
        dueDate: data.dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    return newTask;
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// ============================================
// 5. PERSISTENCIA (LocalStorage)
// ============================================
function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('Error al guardar en localStorage:', error);
    }
}

function loadTasks() {
    try {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            tasks = JSON.parse(stored);
            return true;
        }
    } catch (error) {
        console.warn('Error al cargar desde localStorage:', error);
    }
    return false;
}

// ============================================
// 6. RENDERIZADO DINÁMICO
// ============================================
function getFilteredTasks() {
    if (currentFilter === 'all') return tasks;
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Limpiar lista
    taskList.innerHTML = '';
    
    // Mostrar mensaje vacío
    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove('hidden');
        taskList.classList.add('hidden');
        return;
    }
    
    emptyMessage.classList.add('hidden');
    taskList.classList.remove('hidden');
    
    // Generar elementos dinámicamente
    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item${task.completed ? ' completed' : ''}`;
    div.dataset.id = task.id;

    // Contenido
    const content = document.createElement('div');
    content.className = 'task-content';
    content.addEventListener('click', () => toggleTaskStatus(task.id));

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const description = document.createElement('div');
    description.className = 'task-description';
    description.textContent = task.description;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const category = document.createElement('span');
    category.className = 'category';
    const categoryEmojis = {
        personal: '👤',
        trabajo: '💼',
        estudio: '📚',
        hogar: '🏠'
    };
    category.textContent = `${categoryEmojis[task.category] || '📌'} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}`;

    const date = document.createElement('span');
    date.textContent = `📅 ${new Date(task.dueDate).toLocaleDateString('es-ES')}`;

    const status = document.createElement('span');
    status.textContent = task.completed ? '✅ Completada' : '⏳ Pendiente';
    status.style.fontWeight = '500';

    meta.appendChild(category);
    meta.appendChild(date);
    meta.appendChild(status);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(meta);

    // Acciones
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = `btn-complete${task.completed ? ' completed-btn' : ''}`;
    completeBtn.textContent = task.completed ? '↩️ Revertir' : '✅ Completar';
    completeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskStatus(task.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '🗑️ Eliminar';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de eliminar "${task.title}"?`)) {
            deleteTask(task.id);
        }
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(content);
    div.appendChild(actions);

    return div;
}

// ============================================
// 7. EVENTOS Y FILTROS
// ============================================
// Evento submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        title: titleInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
        dueDate: dueDateInput.value,
        confirmTitle: confirmTitleInput.value
    };
    
    if (validateForm(formData)) {
        createTask(formData);
        form.reset();
        // Resetear mensajes de error
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        // Feedback visual
        const btn = form.querySelector('.btn-primary');
        const originalText = btn.textContent;
        btn.textContent = '✅ ¡Tarea Agregada!';
        btn.style.backgroundColor = '#2ecc71';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 1500);
    }
});

// Evento keyup para validación en tiempo real del título
titleInput.addEventListener('keyup', () => {
    const result = validateTitle(titleInput.value);
    titleError.textContent = result.valid ? '' : result.message;
    titleInput.classList.toggle('error', !result.valid);
});

// Evento change para la categoría
categoryInput.addEventListener('change', () => {
    const result = validateCategory(categoryInput.value);
    categoryError.textContent = result.valid ? '' : result.message;
    categoryInput.classList.toggle('error', !result.valid);
});

// Evento change para la fecha
dueDateInput.addEventListener('change', () => {
    const result = validateDueDate(dueDateInput.value);
    dueDateError.textContent = result.valid ? '' : result.message;
    dueDateInput.classList.toggle('error', !result.valid);
});

// Evento input para confirmar título
confirmTitleInput.addEventListener('input', () => {
    const result = validateConfirmTitle(titleInput.value, confirmTitleInput.value);
    confirmError.textContent = result.valid ? '' : result.message;
    confirmTitleInput.classList.toggle('error', !result.valid);
});

// Eventos de filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ============================================
// 8. INICIALIZACIÓN
// ============================================
function init() {
    const loaded = loadTasks();
    if (!loaded) {
        // Datos de ejemplo si no hay tareas guardadas
        const sampleTasks = [
            {
                id: 1,
                title: 'Comprar víveres',
                description: 'Leche, pan, huevos y frutas',
                category: 'personal',
                dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Revisar correos',
                description: 'Responder a los clientes pendientes',
                category: 'trabajo',
                dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
                completed: true,
                createdAt: new Date().toISOString()
            }
        ];
        tasks = sampleTasks;
        saveTasks();
    }
    renderTasks();
    
    // Establecer fecha mínima para el input date
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.setAttribute('min', today);
    
    console.log('✅ Aplicación inicializada correctamente');
    console.log(`📊 ${tasks.length} tareas cargadas`);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);