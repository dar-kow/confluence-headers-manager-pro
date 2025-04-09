import React from 'react';

interface StatusPreviewProps {
    showStatus: boolean;
    useStatusStyles: boolean;
}

const StatusPreview: React.FC<StatusPreviewProps> = ({
    showStatus,
    useStatusStyles
}) => {
    if (!showStatus) return null;

    return (
        <div className="status-preview">
            <div className="preview-title">Podgląd nagłówków ze statusami:</div>
            <div className="preview-example">
                {useStatusStyles ? (
                    <>
                        <span className="status-badge status-done">DONE</span>
                        <span>TC_000_001.GivenValidData_WhenLogin_ThenUserLoggedIn</span>
                    </>
                ) : (
                    <span>DONE TC_000_001.GivenValidData_WhenLogin_ThenUserLoggedIn</span>
                )}
            </div>
            <div className="preview-example">
                {useStatusStyles ? (
                    <>
                        <span className="status-badge status-progress">IN_PROGRESS</span>
                        <span>TC_000_002.GivenInvalidCredentials_WhenLogin_ThenErrorShown</span>
                    </>
                ) : (
                    <span>IN_PROGRESS TC_000_002.GivenInvalidCredentials_WhenLogin_ThenErrorShown</span>
                )}
            </div>
        </div>
    );
};

export default StatusPreview;