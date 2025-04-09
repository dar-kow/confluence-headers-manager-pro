import React from 'react';

interface ManualInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const ManualInput: React.FC<ManualInputProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className="manual-input">
            <label htmlFor="childPageUrls">
                Linki do stron podrzędnych (każdy w nowej linii):
            </label>
            <textarea
                id="childPageUrls"
                rows={5}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="np. https://twoja_nazwa.atlassian.net/wiki/spaces/~63f2e4683ec8aa51d3d10242/pages/327681/Logowanie"
                disabled={disabled}
            />
        </div>
    );
};

export default ManualInput;