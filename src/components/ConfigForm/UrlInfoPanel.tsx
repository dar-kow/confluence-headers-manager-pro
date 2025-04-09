import React from 'react';

interface UrlInfoPanelProps {
    parsedUrl: {
        domain: string;
        spaceKey: string;
        pageId: string;
        pageName: string;
    } | null;
}

const UrlInfoPanel: React.FC<UrlInfoPanelProps> = ({ parsedUrl }) => {
    if (!parsedUrl) return null;

    return (
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
    );
};

export default UrlInfoPanel;