import React, { useState, useEffect } from 'react';

interface FormatSelectorProps {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

interface TooltipPosition {
    x: number;
    y: number;
    visible: boolean;
    content: string;
    windowWidth: number;
    position: 'center' | 'left' | 'right'; // Added position property
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
        x: 0,
        y: 0,
        visible: false,
        content: '',
        windowWidth: window.innerWidth,
        position: 'center'
    });

    // Determine position based on cursor location relative to screen width
    const getPosition = (x: number, windowWidth: number): 'center' | 'left' | 'right' => {
        const edgeThreshold = 200; // Pixels from edge to trigger alternative positioning

        if (x < edgeThreshold) {
            return 'left'; // Near left edge
        } else if (x > windowWidth - edgeThreshold) {
            return 'right'; // Near right edge
        }
        return 'center'; // In the center area
    };

    const handleMouseMove = (e: React.MouseEvent, content: string) => {
        const position = getPosition(e.clientX, window.innerWidth);
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            content,
            windowWidth: window.innerWidth,
            position
        });
    };

    const handleMouseEnter = (e: React.MouseEvent, content: string) => {
        const position = getPosition(e.clientX, window.innerWidth);
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            content,
            windowWidth: window.innerWidth,
            position
        });
    };

    const handleMouseLeave = () => {
        setTooltipPosition(prev => ({ ...prev, visible: false }));
    };

    const listTooltip = "Nagłówki będą wyświetlane jako lista punktowana z linkami do oryginalnych sekcji.";
    const headingsTooltip = "Nagłówki zachowają oryginalną strukturę i hierarchię - tak jak w źródle.";

    return (
        <div className="format-selector">
            <div className="simple-radio-group">
                <div className="simple-radio-option">
                    <label>
                        <input
                            type="radio"
                            name="headersFormat"
                            value="list"
                            checked={!value}
                            onChange={() => onChange(false)}
                            disabled={disabled}
                        />
                        <span className="radio-label">Lista nagłówków</span>
                        <span
                            className="info-icon"
                            aria-hidden="true"
                            onMouseMove={(e) => handleMouseMove(e, listTooltip)}
                            onMouseEnter={(e) => handleMouseEnter(e, listTooltip)}
                            onMouseLeave={handleMouseLeave}
                        >
                            ℹ️
                        </span>
                    </label>
                </div>

                <div className="simple-radio-option">
                    <label>
                        <input
                            type="radio"
                            name="headersFormat"
                            value="headings"
                            checked={value}
                            onChange={() => onChange(true)}
                            disabled={disabled}
                        />
                        <span className="radio-label">Nagłówki z hierarchią</span>
                        <span
                            className="info-icon"
                            aria-hidden="true"
                            onMouseMove={(e) => handleMouseMove(e, headingsTooltip)}
                            onMouseEnter={(e) => handleMouseEnter(e, headingsTooltip)}
                            onMouseLeave={handleMouseLeave}
                        >
                            ℹ️
                        </span>
                    </label>
                </div>
            </div>

            {tooltipPosition.visible && (
                <div
                    className={`smart-follow-cursor-tooltip position-${tooltipPosition.position}`}
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`
                    }}
                    data-position={tooltipPosition.position}
                >
                    {tooltipPosition.content}
                </div>
            )}
        </div>
    );
};

export default FormatSelector;