import React from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    title = 'Uwaga',
    message = 'Strona nadrzędna już zawiera treść, która zostanie zastąpiona. Czy na pewno chcesz kontynuować?',
    confirmText = 'Kontynuuj',
    cancelText = 'Anuluj',
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog">
            <div className="confirmation-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="confirmation-buttons">
                    <button onClick={onCancel} className="cancel-btn">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="confirm-btn">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;