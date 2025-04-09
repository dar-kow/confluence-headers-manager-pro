import { useState, useEffect, useCallback } from 'react';
import { useConfluenceApi } from './useConfluenceApi';
import { ChildPage } from '../services/types';

interface UseChildPagesProps {
    parentPageUrl: string;
    autoDetect: boolean;
}

export const useChildPages = ({ parentPageUrl, autoDetect }: UseChildPagesProps) => {
    // States n stuff
    const [detectedPages, setDetectedPages] = useState<ChildPage[]>([]);
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
    const [manualUrls, setManualUrls] = useState('');
    const [error, setError] = useState<string | null>(null);

    // API hook from conf
    const { getChildPages, parseUrls, isLoading } = useConfluenceApi();

    // Get dem child pages
    const fetchChildPages = useCallback(async () => {
        if (!parentPageUrl) {
            return;
        }

        try {
            setError(null);
            const pages = await getChildPages(parentPageUrl);
            setDetectedPages(pages);

            // Auto-select all detected pgs
            setSelectedPageIds(pages.map((page: ChildPage) => page.id));
        } catch (err) {
            setError('Failed to fetch child pages');
            console.error('Error while fetching child pages:', err);
        }
    }, [parentPageUrl, getChildPages]);

    // Effect 4 auto detection
    useEffect(() => {
        if (autoDetect && parentPageUrl) {
            fetchChildPages();
        }
    }, [autoDetect, parentPageUrl, fetchChildPages]);

    // Handle manual URLs input change
    const handleManualUrlsChange = useCallback(async (urls: string) => {
        setManualUrls(urls);

        // If the field is empty, clear selected pages
        if (!urls.trim()) {
            setSelectedPageIds([]);
            return;
        }

        // Parse links to page IDs
        try {
            setError(null);
            const urlList = urls.trim().split('\n').filter(url => url.trim() !== '');

            if (urlList.length > 0) {
                const pageIds = await parseUrls(urlList);
                setSelectedPageIds(pageIds);
            }
        } catch (err) {
            setError('Failed to process entered URLs');
            console.error('Error while parsing URLs:', err);
        }
    }, [parseUrls]);

    // Handle selected pages change
    const handleSelectedPagesChange = useCallback((pageIds: string[]) => {
        setSelectedPageIds(pageIds);
    }, []);

    // Reset all data
    const resetData = useCallback(() => {
        setDetectedPages([]);
        setSelectedPageIds([]);
        setManualUrls('');
        setError(null);
    }, []);

    return {
        detectedPages,
        selectedPageIds,
        manualUrls,
        error,
        isLoading,
        fetchChildPages,
        handleManualUrlsChange,
        handleSelectedPagesChange,
        resetData
    };
};