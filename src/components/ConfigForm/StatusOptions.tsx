import React, { useState } from 'react';

interface StatusOptionsProps {
    showStatus: boolean;
    onShowStatusChange: (show: boolean) => void;
    disabled?: boolean;
}

interface TooltipPosition {
    x: number;
    y: number;
    visible: boolean;
    windowWidth: number;
    position: 'center' | 'left' | 'right';
}

const StatusOptions: React.FC<StatusOptionsProps> = ({
    showStatus,
    onShowStatusChange,
    disabled = false
}) => {
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
        x: 0,
        y: 0,
        visible: false,
        windowWidth: window.innerWidth,
        position: 'center'
    });

    const tooltipText = "Wyświetla statusy w oryginalnej formie Confluence";

    const getPosition = (x: number, windowWidth: number): 'center' | 'left' | 'right' => {
        const edgeThreshold = 200;

        if (x < edgeThreshold) {
            return 'left';
        } else if (x > windowWidth - edgeThreshold) {
            return 'right';
        }
        return 'center';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const position = getPosition(e.clientX, window.innerWidth);
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            windowWidth: window.innerWidth,
            position
        });
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        const position = getPosition(e.clientX, window.innerWidth);
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            windowWidth: window.innerWidth,
            position
        });
    };

    const handleMouseLeave = () => {
        setTooltipPosition(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className="format-selector">
            <div className="checkbox-container">
                <div className="checkbox-option">
                    <label style={{ textAlign: 'center' }}>
                        <input
                            type="checkbox"
                            name="statusOption"
                            checked={showStatus}
                            onChange={() => onShowStatusChange(!showStatus)}
                            disabled={disabled}
                        />
                        <span className="checkbox-label">Nagłówki ze statusami</span>
                        <span
                            className="info-icon"
                            aria-hidden="true"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            ℹ️
                        </span>
                    </label>

                    {tooltipPosition.visible && (
                        <div
                            className={`smart-follow-cursor-tooltip position-${tooltipPosition.position}`}
                            style={{
                                left: `${tooltipPosition.x}px`,
                                top: `${tooltipPosition.y}px`
                            }}
                            data-position={tooltipPosition.position}
                        >
                            {tooltipText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusOptions;