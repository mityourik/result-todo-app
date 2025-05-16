import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addTodo, fetchTodos } from '../../store/slices/todosSlice';
import styles from './Home.module.css';

function Home() {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.items);
    const status = useSelector((state) => state.todos.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTodos());
        }
    }, [dispatch, status]);
    const [newTaskText, setNewTaskText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlphabet, setSortAlphabet] = useState(false);

    const debouncedSearch = debounce((query) => setSearchTerm(query), 300);
    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredTasks = todos
        .filter((task) =>
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortAlphabet) {
                return a.text.localeCompare(b.text);
            }
            return 0;
        });

    return (
        <div className={styles.todos}>
            <h1 className={styles.todos__title}>Список задач</h1>
            <div className={styles.todos__add}>
                <input
                    type="text"
                    placeholder="Добавить задачу..."
                    value={newTaskText || ''}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button
                    onClick={() => {
                        if (newTaskText.trim()) {
                            dispatch(
                                addTodo({ text: newTaskText, completed: false })
                            );
                            setNewTaskText('');
                        }
                    }}
                >
                    Add
                </button>
            </div>
            <div className={styles.todos__controls}>
                <input
                    type="text"
                    placeholder="Найти задачу..."
                    value={searchTerm || ''}
                    onChange={handleSearchChange}
                    className={styles.todos__search}
                />
                <button
                    onClick={() => setSortAlphabet((prev) => !prev)}
                    className={styles.todos__sortButton}
                >
                    {sortAlphabet
                        ? 'Список по умолчанию'
                        : 'Сортировать по алфавиту'}
                </button>
            </div>
            <ul className={styles.todos__list}>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        <Link
                            to={`/task/${task.id}`}
                            className={styles.todos__item}
                        >
                            <span className={styles['todos__item-text']}>
                                {task.text}
                            </span>
                            {task.isCompleted && (
                                <span className={styles['todos__item-check']}>
                                    ✓
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
