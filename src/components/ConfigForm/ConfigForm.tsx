import React, { useState, useEffect } from 'react';
import ParentPageInput from './ParentPageInput';
import ChildPagesSelector from './ChildPagesSelector/ChildPagesSelector';
import FormatSelector from './FormatSelector';
import StatusOptions from './StatusOptions';
import UrlInfoPanel from './UrlInfoPanel';
import { FormData } from '../../services/types';

interface ConfigFormProps {
    onSubmit: (formData: FormData) => void;
    isLoading: boolean;
    initialParentUrl?: string;
    parsedUrl?: {
        domain: string;
        spaceKey: string;
        pageId: string;
        pageName: string;
    } | null;
    onFormDataChange?: (formData: FormData, isValid: boolean) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
    onSubmit,
    isLoading,
    initialParentUrl = '',
    parsedUrl,
    onFormDataChange
}) => {
    // Stan formularza
    const [parentPageUrl, setParentPageUrl] = useState(initialParentUrl);
    const [childPageIds, setChildPageIds] = useState<string[]>([]);
    const [headersAsHeadings, setHeadersAsHeadings] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    // Aktualizuj URL rodzica, gdy zmieni się initialParentUrl
    useEffect(() => {
        if (initialParentUrl) {
            setParentPageUrl(initialParentUrl);
        }
    }, [initialParentUrl]);

    // Sprawdź, czy formularz jest wypełniony poprawnie
    const isFormValid = (): boolean => {
        const valid = Boolean(parentPageUrl && childPageIds.length > 0);
        console.log('ConfigForm validation:', {
            parentPageUrl,
            childPageIdsLength: childPageIds.length,
            valid
        });
        return valid;
    };

    // Powiadom rodzica o zmianach w formularzu
    useEffect(() => {
        if (onFormDataChange) {
            const formData = {
                parentPageUrl,
                childPageIds,
                headersAsHeadings,
                showStatus
            };
            const valid = isFormValid();
            onFormDataChange(formData, valid);
            console.log('Form data changed:', { formData, valid, childPageIds });
        }
    }, [parentPageUrl, childPageIds, headersAsHeadings, showStatus, onFormDataChange]);

    // Obsługa wysyłania formularza
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        onSubmit({
            parentPageUrl,
            childPageIds,
            headersAsHeadings,
            showStatus
        });
    };

    return (
        <form className="config-form" onSubmit={handleSubmit}>
            <ParentPageInput
                value={parentPageUrl}
                onChange={setParentPageUrl}
                disabled={isLoading}
            />

            {parsedUrl && (
                <UrlInfoPanel parsedUrl={parsedUrl} />
            )}

            <ChildPagesSelector
                parentPageUrl={parentPageUrl}
                onChildPagesChange={setChildPageIds}
            />

            <FormatSelector
                value={headersAsHeadings}
                onChange={setHeadersAsHeadings}
                disabled={isLoading}
            />

            <StatusOptions
                showStatus={showStatus}
                onShowStatusChange={setShowStatus}
                disabled={isLoading}
            />

            {/* Przycisk został usunięty stąd i przeniesiony do nagłówka */}
        </form>
    );
};

export default ConfigForm;