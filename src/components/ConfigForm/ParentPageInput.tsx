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

    const handleRefresh = () => {
        // Pobierz aktualny URL z aktywnej karty
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url) {
                onChange(tabs[0].url);
            }
        });
    };

    return (
        <div className="parent-page-input">
            <div className="input-header">
                <label htmlFor="parentPageUrl">Link do strony nadrzędnej:</label>
                <div className="input-actions">
                    <button
                        type="button"
                        className="refresh-icon-button small"
                        onClick={handleRefresh}
                        title="Pobierz URL z aktualnej karty"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                        </svg>
                    </button>
                </div>
            </div>
            <input
                type="text"
                id="parentPageUrl"
                value={value}
                onChange={handleChange}
                placeholder="np. https://darecki.atlassian.net/wiki/spaces/~63f2e4683ec8aa51d3d10242/pages/393217/Przypadki+lista"
                disabled={disabled}
                required
            />
        </div>
    );
};

export default ParentPageInput;