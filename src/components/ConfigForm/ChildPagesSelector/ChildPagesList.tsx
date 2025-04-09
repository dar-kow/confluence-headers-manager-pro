import React from 'react';
import { ChildPage } from '../../../services/types';

interface ChildPagesListProps {
    pages: ChildPage[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    loading?: boolean;
    onRefresh?: () => void;
}

const ChildPagesList: React.FC<ChildPagesListProps> = ({
    pages,
    selectedIds,
    onChange,
    loading = false,
    onRefresh
}) => {
    // Handle page selection change
    const handleCheckboxChange = (pageId: string, checked: boolean) => {
        let newSelectedIds;
        if (checked) {
            // Add to selected
            newSelectedIds = [...selectedIds, pageId];
        } else {
            // Remove from selected
            newSelectedIds = selectedIds.filter(id => id !== pageId);
        }

        console.log('Checkbox changed:', {
            pageId,
            checked,
            newSelectedIds,
            selectedBefore: selectedIds.length,
            selectedAfter: newSelectedIds.length
        });

        onChange(newSelectedIds);
    };

    // Handle select all checkbox
    const handleSelectAll = (checked: boolean) => {
        let newSelectedIds: string[];
        if (checked) {
            // Select all pages
            newSelectedIds = pages.map(page => page.id);
        } else {
            // Deselect all pages
            newSelectedIds = [];
        }

        console.log('Select all changed:', {
            checked,
            newSelectedIds,
            selectedBefore: selectedIds.length,
            selectedAfter: newSelectedIds.length
        });

        onChange(newSelectedIds);
    };

    const allSelected = pages.length > 0 && selectedIds.length === pages.length;

    if (loading) {
        return <div className="loading-message">Pobieranie stron podrzędnych...</div>;
    }

    if (pages.length === 0) {
        return <div className="info-message">Nie znaleziono stron podrzędnych</div>;
    }

    return (
        <div className="child-pages-container">
            <div className="child-pages-controls">
                <div className="select-all-container">
                    <input
                        type="checkbox"
                        id="select-all-pages"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label htmlFor="select-all-pages">Zaznacz wszystkie</label>
                </div>

                {onRefresh && (
                    <button
                        type="button"
                        className="refresh-icon-button small"
                        onClick={onRefresh}
                        disabled={loading}
                        title="Odśwież listę stron"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="child-pages-grid">
                {pages.map(page => (
                    <div key={page.id} className={`child-page-item ${selectedIds.includes(page.id) ? 'selected' : ''}`}>
                        <input
                            type="checkbox"
                            id={`page-${page.id}`}
                            value={page.id}
                            checked={selectedIds.includes(page.id)}
                            onChange={(e) => handleCheckboxChange(page.id, e.target.checked)}
                        />
                        <label htmlFor={`page-${page.id}`}>{page.title}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChildPagesList;