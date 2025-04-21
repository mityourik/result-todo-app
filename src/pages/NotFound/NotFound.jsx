import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className={styles.notFound}>
            <h1>404 - Page Not Found</h1>
            <button onClick={() => navigate(-1)}>&larr; Back</button>
        </div>
    );
}

export default NotFound;
