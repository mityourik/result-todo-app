import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../components/Preloader/Preloader';
import { TodoContext } from '../../contexts/TodoContext';
import { useGetTodoById } from '../../hooks/useGetTodoById';
import styles from './TaskDetail.module.css';

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleToggleTodo, handleDeleteTodo, handleUpdateTodo } =
        useContext(TodoContext);
    const { getTodoById } = useGetTodoById();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        setLoading(true);
        getTodoById(Number(id)).then((currentTask) => {
            if (currentTask) {
                setTask(currentTask);
                setEditText(currentTask.text);
            } else {
                navigate('/404');
            }
            setLoading(false);
        });
    }, [id, getTodoById, navigate]);

    const handleToggle = async () => {
        const updatedTask = await handleToggleTodo(task.id);
        if (updatedTask) {
            setTask(updatedTask);
        }
    };

    const handleUpdate = () => {
        if (!editText.trim()) return;
        handleUpdateTodo(task.id, { text: editText.trim() });
        setTask({ ...task, text: editText.trim() });
    };

    const handleDelete = () => {
        handleDeleteTodo(task.id);
        navigate('/');
    };

    if (loading) {
        return <Preloader />;
    }

    if (!task) {
        return null;
    }

    return (
        <div className={styles['task-detail']}>
            <button
                onClick={() => navigate(-1)}
                className={styles['task-detail__back-button']}
            >
                &larr; назад к списку задач
            </button>
            <h2 className={styles['task-detail__title']}>Задача</h2>
            <div className={styles['task-detail__content']}>
                <p className={styles['task-detail__text']}>{task.text}</p>
                <label className={styles['task-detail__checkbox-label']}>
                    <input
                        type="checkbox"
                        checked={task.isCompleted || false}
                        onChange={handleToggle}
                        className={styles['task-detail__checkbox']}
                    />
                    Completed
                </label>
            </div>
            <div className={styles['task-detail__actions']}>
                <textarea
                    value={editText}
                    onChange={(e) => {
                        setEditText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    className={styles['task-detail__textarea']}
                />
                <button
                    onClick={handleUpdate}
                    className={styles['task-detail__update-button']}
                >
                    Update
                </button>
                <button
                    onClick={handleDelete}
                    className={styles['task-detail__delete-button']}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskDetail;
