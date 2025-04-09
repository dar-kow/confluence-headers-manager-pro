import axios from 'axios';
import { FormData } from './types';

// Axios setup 
const client = axios.create({
    baseURL: '/api', // in prod will be full URL to API server
    headers: {
        'Content-Type': 'application/json'
    }
});

export const api = {
    /**
     * Check if parent pg already has stuff in it
     */
    checkParentPage: async (parentPageUrl: string) => {
        const response = await client.post('/check-parent-page', { parentPageUrl });
        return response.data;
    },

    /**
     * Gets child pgs for given parent - simple API call
     */
    getChildPages: async (parentPageUrl: string) => {
        const response = await client.post('/child-pages', { parentPageUrl });
        return response.data;
    },

    /**
     * Turns URLs into IDs - saves time!
     */
    parseUrls: async (urls: string[]) => {
        const response = await client.post('/parse-urls', { urls });
        return response.data;
    },

    /**
     * Grabs hdrs from child pgs & updates parent
     */
    extractHeaders: async (formData: FormData) => {
        const response = await client.post('/extract-headers', formData);
        return response.data;
    }
};