const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
    }

    if (message) {
        return (
            <div className={ isError ? 'error' : 'notification'}>
            {message}
            </div>
        )
    }
}

export default Notification