import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../components/Preloader/Preloader';
import styles from './TaskDetail.module.css';

const API_URL = 'http://localhost:3001/tasks';

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Task not found');
                return res.json();
            })
            .then((data) => {
                setTask(data);
                setEditText(data.text);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleToggle = () => {
        const updatedCompleted = !task.isCompleted;
        fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCompleted: updatedCompleted }),
        })
            .then(() => {
                setTask({ ...task, isCompleted: updatedCompleted });
            })
            .catch((err) => console.error(err));
    };

    const handleUpdate = () => {
        if (!editText.trim()) return;
        fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: editText.trim() }),
        })
            .then(() => {
                setTask({ ...task, text: editText.trim() });
            })
            .catch((err) => console.error(err));
    };

    const handleDelete = () => {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                navigate('/');
            })
            .catch((err) => console.error(err));
    };

    if (loading) {
        return <Preloader />;
    }

    if (!task) {
        return (
            <div className={styles['task-detail__not-found']}>
                Task not found
            </div>
        );
    }

    return (
        <div className={styles['task-detail']}>
            <button
                onClick={() => navigate(-1)}
                className={styles['task-detail__back-button']}
            >
                назад к списку задач
            </button>
            <h2 className={styles['task-detail__title']}>Task Detail</h2>
            <div className={styles['task-detail__content']}>
                <p className={styles['task-detail__text']}>{task.text}</p>
                <label className={styles['task-detail__checkbox-label']}>
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
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
