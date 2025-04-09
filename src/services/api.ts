import axios from 'axios';
import { FormData } from './types';

// Axios config
const client = axios.create({
    baseURL: '/api', // will be full API server URL in prod
    headers: {
        'Content-Type': 'application/json'
    }
});

export const api = {
    /**
     * Checks if parent page already has content
     */
    checkParentPage: async (parentPageUrl: string) => {
        const response = await client.post('/check-parent-page', { parentPageUrl });
        return response.data;
    },

    /**
     * Gets child pages for a given parent page
     */
    getChildPages: async (parentPageUrl: string) => {
        const response = await client.post('/child-pages', { parentPageUrl });
        return response.data;
    },

    /**
     * Parses child page URLs to IDs
     */
    parseUrls: async (urls: string[]) => {
        const response = await client.post('/parse-urls', { urls });
        return response.data;
    },

    /**
     * Extracts headers from child pages and updates parent page
     */
    extractHeaders: async (formData: FormData) => {
        const response = await client.post('/extract-headers', formData);
        return response.data;
    }
};