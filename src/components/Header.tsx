import React from 'react';

interface HeaderProps {
    title?: string;
    onStartAutomation?: () => void;
    isButtonDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    title = 'Confluence Headers Manager',
    onStartAutomation,
    isButtonDisabled = true
}) => {
    return (
        <header className="header">
            <div className="header-content">
                <h1>{title}</h1>
                {onStartAutomation && (
                    <button
                        className="header-action-button"
                        onClick={onStartAutomation}
                        disabled={isButtonDisabled}
                        title={isButtonDisabled ? "Wypełnij formularz, aby aktywować" : "sudo extract_headers.sh ;)"}
                    >
                        Hackuj Confluence!
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;