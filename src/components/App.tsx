import React, { useState } from 'react';
import Header from './Header';
import ConfigForm from './ConfigForm/ConfigForm';
import ConfirmationDialog from './ConfirmationDialog';
import StatusMessage from './StatusMessage';
import Footer from './Footer';
import { useConfluenceApi } from '../hooks/useConfluenceApi';
import { FormData, StatusType } from '../services/types';
import '../App.css';

const App: React.FC = () => {
    // App state
    const [pendingSubmission, setPendingSubmission] = useState<FormData | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: StatusType } | null>(null);

    // Hooks
    const { isLoading, checkParentPageContent, extractHeaders } = useConfluenceApi();

    // Form submit handler
    const handleSubmit = async (formData: FormData) => {
        try {
            // Check if parent page already has content
            const hasContent = await checkParentPageContent(formData.parentPageUrl);

            if (hasContent) {
                // Save data & show confirm dialog
                setPendingSubmission(formData);
                setShowConfirmDialog(true);
            } else {
                // Continue without asking
                processSubmission(formData);
            }
        } catch (error) {
            setStatus({
                message: `Wystąpił błąd: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error'
            });
        }
    };

    // Confirm dialog handler
    const handleConfirm = () => {
        setShowConfirmDialog(false);
        if (pendingSubmission) {
            processSubmission(pendingSubmission);
        }
    };

    // Cancel dialog handler
    const handleCancel = () => {
        setShowConfirmDialog(false);
        setPendingSubmission(null);
    };

    // Process form submission function
    const processSubmission = async (formData: FormData) => {
        try {
            const result = await extractHeaders(formData);

            setStatus({
                message: `Sukces! ${result.message}. Zaktualizowano ${result.headersCount} nagłówków.`,
                type: 'success'
            });
        } catch (error) {
            setStatus({
                message: `Wystąpił błąd: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error'
            });
        } finally {
            setPendingSubmission(null);
        }
    };

    return (
        <div className="app">
            <Header />

            <main className="container">
                <ConfigForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />

                {status && (
                    <StatusMessage
                        message={status.message}
                        type={status.type}
                    />
                )}

                <Footer />
            </main>

            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default App;