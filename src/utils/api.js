const API_URL = 'http://localhost:3001';

export const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке задач');
    }
    return response.json();
};

export const getTodoById = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке задачи');
    }
    return response.json();
};

export const addTodo = async (todo) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    });
    if (!response.ok) {
        throw new Error('Ошибка при добавлении задачи');
    }
    return response.json();
};

export const updateTodo = async (id, updates) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
    }
    return response.json();
};

export const deleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении задачи');
    }
    return id;
};
