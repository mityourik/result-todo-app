import styles from './Preloader.module.css';

const Preloader = () => {
    return (
        <div className={styles.prloader}>
            <div className={styles.preloader__loading__spinner} />
        </div>
    );
};

export default Preloader;
