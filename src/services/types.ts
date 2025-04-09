export interface FormData {
    parentPageUrl: string;
    childPageIds: string[];
    headersAsHeadings: boolean;
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