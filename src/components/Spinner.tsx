import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
    message = 'Przetwarzanie...'
}) => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-message">{message}</p>
        </div>
    );
};

export default Spinner;
