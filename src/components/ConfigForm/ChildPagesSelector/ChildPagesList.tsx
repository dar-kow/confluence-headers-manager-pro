import React from 'react';
import { ChildPage } from '../../../services/types';

interface ChildPagesListProps {
    pages: ChildPage[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    loading?: boolean;
}

const ChildPagesList: React.FC<ChildPagesListProps> = ({
    pages,
    selectedIds,
    onChange,
    loading = false
}) => {
    // Handle checkbox change
    const handleCheckboxChange = (pageId: string, checked: boolean) => {
        if (checked) {
            // Add to selected
            onChange([...selectedIds, pageId]);
        } else {
            // Remove from selected
            onChange(selectedIds.filter(id => id !== pageId));
        }
    };

    if (loading) {
        return <div className="loading-message">Pobieranie stron podrzędnych...</div>;
    }

    if (pages.length === 0) {
        return <div className="empty-message">Nie znaleziono stron podrzędnych</div>;
    }

    return (
        <div className="child-pages">
            <h3>Wykryte strony podrzędne:</h3>
            <div className="child-pages-list">
                {pages.map(page => (
                    <div key={page.id} className="child-page">
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