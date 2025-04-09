import React, { useEffect, useState } from 'react';

interface SuccessOverlayProps {
    message: string;
    onClose?: () => void;
    autoCloseDelay?: number;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
    message,
    onClose,
    autoCloseDelay = 2500
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Automatyczne zamknięcie po określonym czasie
        if (autoCloseDelay > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    setTimeout(onClose, 300); // Daj czas na animację wyjścia
                }
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [autoCloseDelay, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            setTimeout(onClose, 300); // Daj czas na animację wyjścia
        }
    };

    return (
        <div className={`success-overlay ${isVisible ? 'visible' : 'hiding'}`}>
            <div className="success-container">
                <div className="checkmark-circle">
                    <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle-svg" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
                <p className="success-message">{message}</p>
                <button
                    className="success-dismiss-btn"
                    onClick={handleClose}
                    aria-label="Zamknij komunikat sukcesu"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessOverlay;