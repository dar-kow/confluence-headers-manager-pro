import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthSettings from './AuthSettings';
import ConfigForm from './ConfigForm/ConfigForm';
import StatusMessage from './StatusMessage';
import ConfirmationDialog from './ConfirmationDialog';
import SuccessOverlay from './SuccessOverlay';
import Spinner from './Spinner';
import { useConfluenceApi } from '../hooks/useConfluenceApi';
import { FormData, StatusType } from '../services/types';
import { setAuthCredentials } from '../services/chrome-api';

const App: React.FC = () => {
    const [status, setStatus] = useState<{ message: string; type: StatusType } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<FormData | null>(null);
    const [currentURL, setCurrentURL] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const { extractHeaders, checkParentPageContent, isLoading } = useConfluenceApi();

    // Pobierz aktualny URL przy ładowaniu
    useEffect(() => {
        // Pobierz aktywną kartę, aby automatycznie wypełnić URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url) {
                setCurrentURL(tabs[0].url);
            }
        });
    }, []);

    // Obsługa zmiany danych uwierzytelniających
    const handleAuthChange = (email: string, apiToken: string) => {
        setAuthCredentials(email, apiToken);
        setIsAuthenticated(Boolean(email && apiToken));
    };

    // Obsługa zmiany danych formularza
    const handleFormDataChange = (newFormData: FormData, valid: boolean) => {
        setFormData(newFormData);
        // Wykonaj własną walidację, niezależnie od przekazanej wartości valid
        const isDataValid = Boolean(
            newFormData.parentPageUrl &&
            newFormData.childPageIds &&
            newFormData.childPageIds.length > 0
        );
        setIsFormValid(isDataValid);

        // Dodaj debugowanie
        console.log('Form validation:', {
            hasUrl: Boolean(newFormData.parentPageUrl),
            childIds: newFormData.childPageIds,
            childCount: newFormData.childPageIds?.length || 0,
            isDataValid
        });
    };

    // Funkcja do wywołania po kliknięciu w przycisk w headerze
    const handleHeaderButtonClick = () => {
        if (formData && isFormValid) {
            handleFormSubmit(formData);
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            // Sprawdź, czy mamy dane uwierzytelniające
            if (!isAuthenticated) {
                setStatus({
                    message: 'Skonfiguruj dane uwierzytelniające do Confluence API',
                    type: 'warning'
                });
                return;
            }

            // Sprawdź, czy strona nadrzędna ma już treść
            const hasContent = await checkParentPageContent(formData.parentPageUrl);

            if (hasContent) {
                // Zapisz dane i pokaż potwierdzenie
                setPendingSubmission(formData);
                setIsConfirmDialogOpen(true);
            } else {
                // Kontynuuj bez potwierdzenia
                await processSubmission(formData);
            }
        } catch (error) {
            setStatus({
                message: `Błąd: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error'
            });
        }
    };

    const handleConfirm = () => {
        setIsConfirmDialogOpen(false);
        if (pendingSubmission) {
            processSubmission(pendingSubmission);
        }
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
        setPendingSubmission(null);
    };

    const processSubmission = async (formData: FormData) => {
        try {
            const result = await extractHeaders(formData);

            // Pokazujemy overlay z animacją sukcesu zamiast StatusMessage
            setSuccessMessage(`Sukces! Zaktualizowano ${result.headersCount} nagłówków.`);
        } catch (error) {
            setStatus({
                message: `Błąd: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error'
            });
        } finally {
            setPendingSubmission(null);
        }
    };

    const clearStatus = () => {
        setStatus(null);
    };

    const clearSuccess = () => {
        setSuccessMessage(null);
    };

    // Funkcja do parsowania URL i pokazywania informacji o domenie, przestrzeni i stronie
    const parsePageUrl = (url: string) => {
        try {
            if (!url) return null;

            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            // Wyciągnij spaceKey i pageId z URL
            const spaceKeyMatch = url.match(/\/spaces\/([^\/]+)/);
            const pageIdMatch = url.match(/\/pages\/(\d+)(?:\/([^\/]+))?/);

            const spaceKey = spaceKeyMatch?.[1] || '';
            const pageId = pageIdMatch?.[1] || '';
            const pageName = pageIdMatch?.[2] || '';

            return {
                domain,
                spaceKey,
                pageId,
                pageName: pageName.replace(/\+/g, ' ')
            };
        } catch (error) {
            return null;
        }
    };

    // Parsuj URL strony nadrzędnej
    const parsedUrl = parsePageUrl(currentURL);

    return (
        <div className="app extension-app">
            {/* Globalny overlay sukcesu */}
            {successMessage && (
                <SuccessOverlay
                    message={successMessage}
                    onClose={clearSuccess}
                    autoCloseDelay={3000}
                />
            )}

            {/* Globalny spinner na cały popup */}
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner message="Przetwarzanie danych..." />
                </div>
            )}

            <Header
                onStartAutomation={handleHeaderButtonClick}
                isButtonDisabled={!isFormValid || !isAuthenticated || isLoading}
            />

            <main className="container">
                <AuthSettings onAuthChange={handleAuthChange} />

                <ConfigForm
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    initialParentUrl={currentURL}
                    parsedUrl={parsedUrl}
                    onFormDataChange={handleFormDataChange}
                />

                {status && (
                    <StatusMessage
                        message={status.message}
                        type={status.type}
                        onDismiss={clearStatus}
                    />
                )}
            </main>

            <Footer />

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default App;