import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { db } from './firebase';
import styles from './App.module.css';

const API_URL = 'http://localhost:3001/todos';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlphabet, setSortAlphabet] = useState(false);
    const [loading, setLoading] = useState(true);

    const todoDbRef = ref(db, 'todos');

    useEffect(() => {
        return onValue(todoDbRef, (snapshot) => {
            const data = snapshot.val();
            const todoList = data
                ? Object.entries(data).map(([id, todo]) => ({ id, ...todo }))
                : [];
            setTodos(todoList);
            setLoading(false);
        });
    }, []);

    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;
        const todo = { text: newTodo.trim(), isCompleted: false };
        try {
            await push(todoDbRef, todo);
            setNewTodo('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await remove(ref(db, `todos/${id}`));
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, updatedText) => {
        try {
            await update(ref(db, `todos/${id}`), { text: updatedText });
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, text: updatedText } : todo
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (todo) => {
        try {
            const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
            await update(ref(db, `todos/${todo.id}`), {
                isCompleted: updatedTodo.isCompleted,
            });
            setTodos((prev) =>
                prev.map((t) => (t.id === todo.id ? updatedTodo : t))
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = debounce((query) => setSearchTerm(query), 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTodos = sortAlphabet
        ? [...filteredTodos].sort((a, b) => a.text.localeCompare(b.text))
        : filteredTodos;

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.todos__loading__spinner} />
            </div>
        );
    }

    return (
        <div className={styles.todos}>
            <h1 className={styles.todos__title}>Todo List</h1>
            <div className={styles.todos__add}>
                <input
                    type="text"
                    placeholder="Добавить дело"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button onClick={handleAddTodo}>Добавить</button>
            </div>
            <div className={styles.todos__controls}>
                <input
                    type="text"
                    placeholder="Поиск дел..."
                    onChange={handleSearchChange}
                    className={styles.todos__search}
                />
                <button
                    onClick={() => setSortAlphabet((prev) => !prev)}
                    className={styles.todos__sortButton}
                >
                    {sortAlphabet
                        ? 'Исходная сортировка'
                        : 'Сортировать по алфавиту'}
                </button>
            </div>
            <ul className={styles.todos__list}>
                {sortedTodos.map((todo) => (
                    <li key={todo.id} className={styles.todos__item}>
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => handleToggle(todo)}
                            className={styles.todos__itemCheckbox}
                        />
                        <span className={styles.todos__itemText}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => handleDelete(todo.id)}
                            className={styles.todos__itemDelete}
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
                            className={styles.todos__itemEdit}
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
