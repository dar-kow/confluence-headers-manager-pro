import React, { useState, useEffect, useCallback } from 'react';
import AutoDetect from './AutoDetect';
import ManualInput from './ManualInput';
import ChildPagesList from './ChildPagesList';
import { useConfluenceApi } from '../../../hooks/useConfluenceApi';
import { ChildPage } from '../../../services/types';

interface ChildPagesSelectorProps {
    parentPageUrl: string;
    onChildPagesChange: (childPageIds: string[]) => void;
}

const ChildPagesSelector: React.FC<ChildPagesSelectorProps> = ({
    parentPageUrl,
    onChildPagesChange
}) => {
    // Component state
    const [autoDetect, setAutoDetect] = useState(false);
    const [manualUrls, setManualUrls] = useState('');
    const [detectedPages, setDetectedPages] = useState<ChildPage[]>([]);
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

    // API hook
    const { getChildPages, parseUrls, isLoading } = useConfluenceApi();

    // Fetch child pages
    const fetchChildPages = useCallback(async () => {
        if (!parentPageUrl) return;

        try {
            const pages = await getChildPages(parentPageUrl);
            setDetectedPages(pages);

            // Auto-select all detected pages
            setSelectedPageIds(pages.map((page: ChildPage) => page.id));
        } catch (error) {
            console.error('Błąd podczas pobierania stron podrzędnych:', error);
            setAutoDetect(false);
        }
    }, [parentPageUrl, getChildPages, setDetectedPages, setSelectedPageIds, setAutoDetect]);

    // Effect for auto-detecting pages
    useEffect(() => {
        if (autoDetect && parentPageUrl) {
            fetchChildPages();
        }
    }, [autoDetect, parentPageUrl, fetchChildPages]);

    // Effect for updating selected child pages
    useEffect(() => {
        onChildPagesChange(selectedPageIds);
    }, [selectedPageIds, onChildPagesChange]);

    // Mode change handler
    const handleModeChange = (isAuto: boolean) => {
        setAutoDetect(isAuto);

        if (!isAuto) {
            // Reset selected pages when switching to manual mode
            setSelectedPageIds([]);
        }
    };

    // Manual URLs change handler
    const handleManualUrlsChange = async (urls: string) => {
        setManualUrls(urls);

        // Clear selected pages if field is empty
        if (!urls.trim()) {
            setSelectedPageIds([]);
            return;
        }

        // Parse links to page IDs
        try {
            const urlList = urls.trim().split('\n').filter(url => url.trim() !== '');

            if (urlList.length > 0) {
                const pageIds = await parseUrls(urlList);
                setSelectedPageIds(pageIds);
            }
        } catch (error) {
            console.error('Błąd podczas parsowania URL-i:', error);
        }
    };

    // Selected pages change handler
    const handleSelectedPagesChange = (pageIds: string[]) => {
        setSelectedPageIds(pageIds);
    };

    return (
        <div className="child-pages-selector">
            <AutoDetect
                value={autoDetect}
                onChange={handleModeChange}
                disabled={isLoading}
            />

            {autoDetect ? (
                <ChildPagesList
                    pages={detectedPages}
                    selectedIds={selectedPageIds}
                    onChange={handleSelectedPagesChange}
                    loading={isLoading}
                />
            ) : (
                <ManualInput
                    value={manualUrls}
                    onChange={handleManualUrlsChange}
                    disabled={isLoading}
                />
            )}
        </div>
    );
};

export default ChildPagesSelector;