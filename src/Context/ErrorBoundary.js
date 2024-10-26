import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const errorHandler = (error, info) => {
            console.error('Error captured:', error, info);
            setHasError(true);
        };

        window.addEventListener('error', errorHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    if (hasError) {
        return <h1>Quelque chose s'est mal passé.</h1>;
    }

    return children;
};

export default ErrorBoundary;
