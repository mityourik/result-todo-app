import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../components/Preloader/Preloader';
import {
    deleteTodo,
    getTodoById,
    updateTodo,
} from '../../store/slices/todosSlice';
import styles from './TaskDetail.module.css';

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const todo = useSelector((state) => state.todos.currentTodo);
    const status = useSelector((state) => state.todos.status);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        dispatch(getTodoById(Number(id)));
    }, [dispatch, id]);

    useEffect(() => {
        if (todo) {
            setEditText(todo.text);
        }
    }, [todo]);

    const handleToggle = () => {
        if (todo) {
            dispatch(
                updateTodo({
                    id: todo.id,
                    updates: { isCompleted: !todo.isCompleted },
                })
            );
        }
    };

    const handleUpdate = () => {
        if (!editText.trim() || !todo) return;
        dispatch(
            updateTodo({
                id: todo.id,
                updates: { text: editText.trim() },
            })
        );
    };

    const handleDelete = () => {
        if (todo) {
            dispatch(deleteTodo(todo.id));
            navigate('/');
        }
    };

    if (status === 'loading') {
        return <Preloader />;
    }

    if (!todo) {
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
                <p className={styles['task-detail__text']}>{todo.text}</p>
                <label className={styles['task-detail__checkbox-label']}>
                    <input
                        type="checkbox"
                        checked={todo.isCompleted || false}
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
