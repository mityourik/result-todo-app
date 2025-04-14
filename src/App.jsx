import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import styles from './App.module.css';
import { useFetchTodos } from './hooks/useFetchTodos';
import { useAddTodo } from './hooks/useAddTodo';
import { useDeleteTodo } from './hooks/useDeleteTodo';
import { useUpdateTodo } from './hooks/useUpdateTodo';
import { useToggleTodo } from './hooks/useToggleTodo';
import Preloader from './components/Preloader';

function App() {
    const [newTodo, setNewTodo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlphabet, setSortAlphabet] = useState(false);

    const { todos, loading } = useFetchTodos(sortAlphabet);
    const { addTodo } = useAddTodo();
    const { deleteTodo } = useDeleteTodo();
    const { updateTodo } = useUpdateTodo();
    const { toggleTodo } = useToggleTodo();

    const debouncedSearch = debounce((query) => setSearchTerm(query), 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Preloader />;
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
                <button
                    onClick={() => {
                        addTodo(newTodo);
                        setNewTodo('');
                    }}
                >
                    Добавить
                </button>
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
                    className={styles['todos__sort-button']}
                >
                    {sortAlphabet
                        ? 'Исходная сортировка'
                        : 'Сортировать по алфавиту'}
                </button>
            </div>
            <ul className={styles.todos__list}>
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className={styles.todos__item}>
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => toggleTodo(todo)}
                            className={styles['todos__item-checkbox']}
                        />
                        <span className={styles['todos__item-text']}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className={styles['todos__item-delete']}
                        >
                            Удалить
                        </button>
                        <button
                            onClick={() => {
                                const newText = prompt(
                                    'Новое название дела',
                                    todo.text
                                );
                                if (newText) updateTodo(todo.id, newText);
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
