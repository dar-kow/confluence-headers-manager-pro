import React from 'react';

interface ParentPageInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const ParentPageInput: React.FC<ParentPageInputProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="parent-page-input">
            <label htmlFor="parentPageUrl">Link do strony nadrzędnej:</label>
            <input
                type="text"
                id="parentPageUrl"
                value={value}
                onChange={handleChange}
                placeholder="np. https://twoja_nazwa.atlassian.net/wiki/spaces/~63f2e4683ec8aa51d3d10242/pages/393217/Przypadki+lista"
                disabled={disabled}
                required
            />
            <div className="input-info">
                Możesz po prostu wkleić pełny link URL do strony Confluence, zamiast wprowadzać ID!
            </div>
        </div>
    );
};

export default ParentPageInput;