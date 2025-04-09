import React, { useEffect, useRef } from 'react';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusMessageProps {
    message: string;
    type: StatusType;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissTimeout?: number;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
    message,
    type,
    onDismiss,
    autoDismiss = false,
    autoDismissTimeout = 5000
}) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // If auto-dismiss is on, start timer thing
        if (autoDismiss && onDismiss) {
            timerRef.current = setTimeout(() => {
                onDismiss();
            }, autoDismissTimeout);
        }

        // Cleanup timer when component goes bye bye
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [autoDismiss, autoDismissTimeout, onDismiss]);

    return (
        <div className={`status-message ${type}`}>
            <div className="status-message-content">
                {message}
            </div>
            {onDismiss && (
                <button
                    className="status-dismiss-btn"
                    onClick={onDismiss}
                    aria-label="Close"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default StatusMessage;