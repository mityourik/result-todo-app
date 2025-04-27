import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className={styles['not-found']}>
            <h1>404 - Страница не найдена</h1>
            <button onClick={() => navigate('/')}>&larr; На главную</button>
        </div>
    );
}

export default NotFound;
