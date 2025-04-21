import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import styles from './Home.module.css';
import Preloader from '../../components/Preloader';

const API_URL = 'http://localhost:3001/tasks';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlphabet, setSortAlphabet] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(() => {
        setLoading(true);
        let url = API_URL;
        if (sortAlphabet) {
            url += '?_sort=text&_order=asc';
        }
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const tasksArray = Array.isArray(data)
                    ? data
                    : Object.values(data);
                setTasks(tasksArray);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [sortAlphabet]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        const newTask = { text: newTaskText.trim() };
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        })
            .then((res) => res.json())
            .then(() => {
                setNewTaskText('');
                fetchTasks();
            })
            .catch((err) => console.error(err));
    };

    const debouncedSearch = debounce((query) => setSearchTerm(query), 300);
    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredTasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Preloader />;
    }

    return (
        <div className={styles.todos}>
            <h1 className={styles.todos__title}>Список задач</h1>
            <div className={styles.todos__add}>
                <input
                    type="text"
                    placeholder="Добавить задачу..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button onClick={handleAddTask}>Add</button>
            </div>
            <div className={styles.todos__controls}>
                <input
                    type="text"
                    placeholder="Найти задачу..."
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
                            {task.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
