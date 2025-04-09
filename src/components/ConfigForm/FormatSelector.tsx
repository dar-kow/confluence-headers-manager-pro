import React from 'react';

interface FormatSelectorProps {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className="format-selector">
            <div className="format-selector-title">Format wynikowych nagłówków:</div>

            <div className="radio-group">
                <div className="radio-option">
                    <label>
                        <input
                            type="radio"
                            name="headersFormat"
                            value="list"
                            checked={!value}
                            onChange={() => onChange(false)}
                            disabled={disabled}
                        />
                        Lista nagłówków z linkami
                    </label>
                    <div className="option-description">
                        Nagłówki będą wyświetlane jako lista wypunktowana z linkami do oryginalnych sekcji.
                    </div>
                </div>

                <div className="radio-option">
                    <label>
                        <input
                            type="radio"
                            name="headersFormat"
                            value="headings"
                            checked={value}
                            onChange={() => onChange(true)}
                            disabled={disabled}
                        />
                        Nagłówki zachowujące hierarchię
                    </label>
                    <div className="option-description">
                        Nagłówki będą wyświetlane z zachowaniem oryginalnej struktury i hierarchii.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormatSelector;