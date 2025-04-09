export interface FormData {
    parentPageUrl: string;
    childPageIds: string[];
    headersAsHeadings: boolean;
    showStatus?: boolean;       // Whether to show statuses in headers
}

export interface ChildPage {
    id: string;
    title: string;
    version?: {
        number: number;
    };
}

export type StatusType = 'success' | 'error' | 'warning';

export interface ApiResponse {
    success: boolean;
    message: string;
    headersCount: number;
    newVersion?: number;
}

export interface HeaderStatus {
    text: string;         // Status text (e.g. "DONE")
    color: string;        // Status color (e.g. "Green")
    originalHtml: string; // Original HTML of the status macro
}

export interface Header {
    text: string;        // Original header text
    level: number;       // Header level (1-6)
    id?: string;         // Optional header ID
    pageId: string;      // Page ID to which the header belongs
}

export interface HeaderWithStatus extends Header {
    status?: HeaderStatus;
    originalId: string;  // Original Confluence header ID
    pageTitle: string;   // Page title for URL
    cleanText: string;   // Clean header text without status
}