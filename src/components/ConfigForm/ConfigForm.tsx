import React, { useState } from 'react';
import ParentPageInput from './ParentPageInput';
import ChildPagesSelector from './ChildPagesSelector/ChildPagesSelector';
import FormatSelector from './FormatSelector';
import Spinner from '../Spinner';
import { FormData } from '../../services/types';

interface ConfigFormProps {
    onSubmit: (formData: FormData) => void;
    isLoading: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ onSubmit, isLoading }) => {
    // Form state
    const [parentPageUrl, setParentPageUrl] = useState('');
    const [childPageIds, setChildPageIds] = useState<string[]>([]);
    const [headersAsHeadings, setHeadersAsHeadings] = useState(false);

    // Form submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!parentPageUrl) {
            alert('Podaj link do strony nadrzędnej');
            return;
        }

        if (childPageIds.length === 0) {
            alert('Wybierz co najmniej jedną stronę podrzędną');
            return;
        }

        onSubmit({
            parentPageUrl,
            childPageIds,
            headersAsHeadings
        });
    };

    return (
        <div className="config-form">
            <h2>Automatyzacja nagłówków w Confluence</h2>
            <p>To narzędzie pozwala na automatyczne wyciąganie nagłówków ze stron Confluence i umieszczanie ich na stronie nadrzędnej jako linki.</p>

            <div className="info-box">
                <p>Możesz po prostu wkleić pełny link URL do strony Confluence, zamiast wprowadzać ID!</p>
            </div>

            <form onSubmit={handleSubmit}>
                <ParentPageInput
                    value={parentPageUrl}
                    onChange={setParentPageUrl}
                />

                <ChildPagesSelector
                    parentPageUrl={parentPageUrl}
                    onChildPagesChange={setChildPageIds}
                />

                <FormatSelector
                    value={headersAsHeadings}
                    onChange={setHeadersAsHeadings}
                />

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    Uruchom automatyzację
                </button>

                {isLoading && <Spinner />}
            </form>
        </div>
    );
};

export default ConfigForm;