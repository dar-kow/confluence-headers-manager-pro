import React, { useState, useEffect, useRef } from 'react';
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
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Refs for lifecycle control
    const isInitialMount = useRef(true);
    const isFetchingPages = useRef(false);
    const lastParentUrl = useRef('');

    // API hook
    const { getChildPages, parseUrls, isLoading } = useConfluenceApi();

    // Debug helper function
    const addDebugInfo = (info: string) => {
        setDebugInfo(prev => prev + '\n' + new Date().toISOString() + ': ' + info);
        console.log('DEBUG:', info);
    };

    // Fetch child pages - function kept outside useEffect
    const fetchChildPages = async () => {
        // Guard against multiple calls
        if (isFetchingPages.current) {
            addDebugInfo('⚠️ Już trwa pobieranie stron - ignoruję duplikat wywołania');
            return;
        }

        if (!parentPageUrl) {
            setError('Brak URL strony nadrzędnej');
            addDebugInfo('⚠️ Brak URL strony nadrzędnej');
            return;
        }

        // Check if URL has changed
        if (parentPageUrl === lastParentUrl.current && detectedPages.length > 0) {
            addDebugInfo('ℹ️ URL nie zmienił się, używam istniejących danych');
            return;
        }

        // Set flag that we're fetching
        isFetchingPages.current = true;
        lastParentUrl.current = parentPageUrl;

        try {
            setError(null);
            addDebugInfo(`🔄 Pobieranie stron dla: ${parentPageUrl}`);

            // Check if we have auth credentials
            chrome.storage.sync.get(['confluenceEmail', 'confluenceApiToken'], async (result) => {
                if (!result.confluenceEmail || !result.confluenceApiToken) {
                    const authError = 'Brak danych uwierzytelniających. Skonfiguruj email i token API.';
                    setError(authError);
                    addDebugInfo('⚠️ ' + authError);
                    setAutoDetect(false);
                    isFetchingPages.current = false;
                    return;
                }

                try {
                    const pages = await getChildPages(parentPageUrl);
                    addDebugInfo(`✅ Pobrano ${pages.length} stron`);

                    if (!pages || pages.length === 0) {
                        const noPageError = 'Nie znaleziono stron podrzędnych';
                        setError(noPageError);
                        addDebugInfo('⚠️ ' + noPageError);
                        isFetchingPages.current = false;
                        return;
                    }

                    // Set pages and IDs in one render
                    setDetectedPages(pages);

                    // Pass selected pages to parent
                    const pageIds = pages.map((page: ChildPage) => page.id);
                    addDebugInfo(`ℹ️ IDs stron: ${pageIds.join(', ')}`);

                    // Setting IDs in a separate function - reduces recursion
                    setTimeout(() => {
                        setSelectedPageIds(pageIds);
                        onChildPagesChange(pageIds);
                        isFetchingPages.current = false;
                    }, 0);

                } catch (apiError) {
                    const errorMsg = `Błąd API: ${apiError instanceof Error ? apiError.message : 'Nieznany błąd'}`;
                    setError(errorMsg);
                    addDebugInfo('❌ ' + errorMsg);
                    setAutoDetect(false);
                    isFetchingPages.current = false;
                }
            });
        } catch (error) {
            const errorMsg = `Ogólny błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
            console.error('Błąd podczas pobierania stron podrzędnych:', error);
            setError(errorMsg);
            addDebugInfo('❌ ' + errorMsg);
            setAutoDetect(false);
            isFetchingPages.current = false;
        }
    };

    // Effect for auto-detecting pages - with recursion safeguards
    useEffect(() => {
        // Skip first mount to avoid double calls in strict mode
        if (isInitialMount.current) {
            isInitialMount.current = false;
            addDebugInfo('🔵 Inicjalizacja komponentu');
            return;
        }

        if (autoDetect && parentPageUrl) {
            addDebugInfo(`🔵 Automatyczne wykrywanie aktywne dla: ${parentPageUrl}`);
            fetchChildPages();
        } else if (!autoDetect) {
            addDebugInfo('ℹ️ Automatyczne wykrywanie wyłączone');
        }

        // Only parentPageUrl and autoDetect as dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentPageUrl, autoDetect]);

    // Handle mode change
    const handleModeChange = (isAuto: boolean) => {
        addDebugInfo(`🔵 Zmiana trybu na: ${isAuto ? 'automatyczny' : 'ręczny'}`);
        setAutoDetect(isAuto);
        setError(null);

        // Jeśli wyłączono tryb auto, wyczyść zaznaczone strony
        if (!isAuto) {
            setSelectedPageIds([]);
            onChildPagesChange([]);
            addDebugInfo('🔄 Wyczyszczono wybrane strony po wyłączeniu trybu auto');
        }
    };

    // Handle manual URL input changes
    const handleManualUrlsChange = async (urls: string) => {
        setManualUrls(urls);

        // If field is empty, clear selected pages
        if (!urls.trim()) {
            setSelectedPageIds([]);
            onChildPagesChange([]);
            addDebugInfo('ℹ️ Wyczyszczono pole URL - usunięto wszystkie wybrane strony');
            return;
        }

        // Parse links to page IDs
        try {
            setError(null);
            const urlList = urls.trim().split('\n').filter(url => url.trim() !== '');

            if (urlList.length > 0) {
                addDebugInfo(`🔄 Parsowanie URL ręcznych: ${urlList.join(', ')}`);
                const pageIds = await parseUrls(urlList);
                addDebugInfo(`✅ Sparsowane ID: ${pageIds.join(', ')}`);
                setSelectedPageIds(pageIds);
                onChildPagesChange(pageIds);
            }
        } catch (error) {
            console.error('Błąd podczas parsowania URL-i:', error);
            setError(`Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
        }
    };

    // Handle selected pages change
    const handleSelectedPagesChange = (pageIds: string[]) => {
        addDebugInfo(`ℹ️ Zmiana zaznaczonych stron: ${pageIds.length} stron`);
        setSelectedPageIds(pageIds);
        onChildPagesChange(pageIds);
        console.log('Selected pages changed:', pageIds); // Dodajemy logowanie
    };

    // Manual refresh
    const handleRefresh = () => {
        if (autoDetect && parentPageUrl) {
            addDebugInfo('🔄 Ręczne odświeżenie listy stron');
            // Reset the fetching flag
            isFetchingPages.current = false;
            fetchChildPages();
        }
    };

    return (
        <div className="child-pages-selector">
            <div className="selector-header">
                <AutoDetect
                    value={autoDetect}
                    onChange={handleModeChange}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {autoDetect ? (
                detectedPages.length > 0 ? (
                    <ChildPagesList
                        pages={detectedPages}
                        selectedIds={selectedPageIds}
                        onChange={handleSelectedPagesChange}
                        loading={isLoading}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    isLoading || isFetchingPages.current ? (
                        <div className="loading-message">Wyszukiwanie stron podrzędnych...</div>
                    ) : (
                        <div className="info-message">
                            {error || "Nie wykryto stron podrzędnych. Sprawdź autoryzację i uprawnienia."}
                        </div>
                    )
                )
            ) : (
                <ManualInput
                    value={manualUrls}
                    onChange={handleManualUrlsChange}
                    disabled={isLoading}
                />
            )}

            {/* Debug section - hidden by default, shown when problems occur */}
            <div className="debug-section">
                <details>
                    <summary>Informacje diagnostyczne</summary>
                    <pre className="debug-info">{debugInfo || "Brak informacji diagnostycznych"}</pre>
                </details>
            </div>
        </div>
    );
};

export default ChildPagesSelector;