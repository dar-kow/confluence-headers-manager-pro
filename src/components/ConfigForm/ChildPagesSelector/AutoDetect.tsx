import React from 'react';

interface AutoDetectProps {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const AutoDetect: React.FC<AutoDetectProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className="checkbox-container">
            <label>
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                Automatycznie wykryj i użyj wszystkich stron podrzędnych
            </label>
        </div>
    );
};

export default AutoDetect;