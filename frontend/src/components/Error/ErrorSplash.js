import styles from './Error.module.css';


const ErrorSplash = ()=>{
    return (
        <div className={styles.error}>
            <div className={styles.error_text}>Error 404 Not Found</div>
        </div>
    )
}

export default ErrorSplash