import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const API_URL = 'http://localhost:3001/todos';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlpha, setSortAlpha] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;
        const todo = { text: newTodo.trim(), isCompleted: false };
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            const savedTodo = await response.json();
            setTodos((prev) => [...prev, savedTodo]);
            setNewTodo('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id, updatedText) => {
        try {
            const todo = todos.find((t) => t.id === id);
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: updatedText,
                    isCompleted: todo.isCompleted,
                }),
            });
            const updatedTodo = await response.json();
            setTodos((prev) =>
                prev.map((todo) => (todo.id === id ? updatedTodo : todo))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = async (todo) => {
        const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
        try {
            const response = await fetch(`${API_URL}/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo),
            });
            const returnedTodo = await response.json();
            setTodos((prev) =>
                prev.map((t) => (t.id === todo.id ? returnedTodo : t))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const debouncedSearch = debounce((query) => setSearchTerm(query), 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTodos = sortAlpha
        ? [...filteredTodos].sort((a, b) => a.text.localeCompare(b.text))
        : filteredTodos;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Todo List</h1>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Добавить дело"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button onClick={handleAddTodo}>Добавить</button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Поиск дел..."
                    onChange={handleSearchChange}
                />
                <button onClick={() => setSortAlpha((prev) => !prev)}>
                    {sortAlpha
                        ? 'Исходная сортировка'
                        : 'Сортировать по алфавиту'}
                </button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {sortedTodos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            marginBottom: '10px',
                            padding: '5px',
                            borderBottom: '1px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => handleToggle(todo)}
                        />
                        <span style={{ marginLeft: '10px', flexGrow: 1 }}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => handleDelete(todo.id)}
                            style={{ marginLeft: '10px' }}
                        >
                            Удалить
                        </button>
                        <button
                            onClick={() => {
                                const newText = prompt(
                                    'Новое название дела',
                                    todo.text
                                );
                                if (newText) handleUpdate(todo.id, newText);
                            }}
                            style={{ marginLeft: '5px' }}
                        >
                            Редактировать
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
