import React, { useState, useEffect } from 'react';

interface AuthSettingsProps {
    onAuthChange: (email: string, apiToken: string) => void;
}

const AuthSettings: React.FC<AuthSettingsProps> = ({ onAuthChange }) => {
    const [email, setEmail] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Ładowanie zapisanych danych uwierzytelniających
    useEffect(() => {
        chrome.storage.sync.get(['confluenceEmail', 'confluenceApiToken'], (result) => {
            if (result.confluenceEmail) setEmail(result.confluenceEmail);
            if (result.confluenceApiToken) setApiToken(result.confluenceApiToken);

            // Jeśli mamy zapisane dane, przekazujemy je
            if (result.confluenceEmail && result.confluenceApiToken) {
                onAuthChange(result.confluenceEmail, result.confluenceApiToken);
            }
        });
    }, [onAuthChange]);

    // Obsługa zapisywania danych
    const handleSave = () => {
        chrome.storage.sync.set({
            confluenceEmail: email,
            confluenceApiToken: apiToken
        }, () => {
            onAuthChange(email, apiToken);
            setIsVisible(false);
        });
    };

    return (
        <div className="auth-settings">
            {!isVisible ? (
                <div className="auth-info">
                    <button
                        className="link-button"
                        onClick={() => setIsVisible(true)}
                    >
                        Ustawienia autoryzacji Confluence
                    </button>
                    {email && apiToken && (
                        <span className="auth-status">✓ Skonfigurowano</span>
                    )}
                </div>
            ) : (
                <div className="auth-form">
                    <h3>Autoryzacja Confluence API</h3>
                    <div className="form-group">
                        <label htmlFor="confluenceEmail">Email/Nazwa użytkownika:</label>
                        <input
                            type="text"
                            id="confluenceEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="twój.email@domena.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confluenceApiToken">Token API:</label>
                        <input
                            type="password"
                            id="confluenceApiToken"
                            value={apiToken}
                            onChange={(e) => setApiToken(e.target.value)}
                            placeholder="Twój token API Atlassian"
                        />
                        <div className="input-info">
                            <a
                                href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Jak wygenerować token API?
                            </a>
                        </div>
                    </div>
                    <div className="auth-buttons">
                        <button
                            className="secondary-button"
                            onClick={() => setIsVisible(false)}
                        >
                            Anuluj
                        </button>
                        <button
                            className="primary-button"
                            onClick={handleSave}
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthSettings;