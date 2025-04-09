import React from 'react';

interface CollapsibleUrlPanelProps {
    parsedUrl: {
        domain: string;
        spaceKey: string;
        pageId: string;
        pageName: string;
    } | null;
}

const CollapsibleUrlPanel: React.FC<CollapsibleUrlPanelProps> = ({ parsedUrl }) => {
    if (!parsedUrl) return null;

    return (
        <div className="debug-section">
            <details>
                <summary>Szczegóły URL (do weryfikacji)</summary>
                <div className="url-info-panel">
                    <div className="url-info-item">
                        <span className="url-info-label">Domena:</span>
                        <span className="url-info-value">{parsedUrl.domain}</span>
                    </div>
                    <div className="url-info-item">
                        <span className="url-info-label">Przestrzeń:</span>
                        <span className="url-info-value">{parsedUrl.spaceKey}</span>
                    </div>
                    <div className="url-info-item">
                        <span className="url-info-label">Strona:</span>
                        <span className="url-info-value">
                            {parsedUrl.pageName || parsedUrl.pageId}
                        </span>
                    </div>
                </div>
            </details>
        </div>
    );
};

export default CollapsibleUrlPanel;