import { useState } from 'react';
import { api } from '../services/api';
import { FormData, ApiResponse } from '../services/types';

export const useConfluenceApi = () => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Checks if parent page already has content
     */
    const checkParentPageContent = async (parentPageUrl: string): Promise<boolean> => {
        if (!parentPageUrl) {
            return false;
        }

        try {
            setIsLoading(true);
            const response = await api.checkParentPage(parentPageUrl);
            return response.hasContent;
        } catch (error) {
            console.error('Error while checking parent page:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Gets child pages for given parent page
     */
    const getChildPages = async (parentPageUrl: string) => {
        if (!parentPageUrl) {
            return [];
        }

        try {
            setIsLoading(true);
            const response = await api.getChildPages(parentPageUrl);
            return response.childPages;
        } catch (error) {
            console.error('Error while fetching child pages:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Parses child page URLs to IDs
     */
    const parseUrls = async (urls: string[]): Promise<string[]> => {
        if (!urls || urls.length === 0) {
            return [];
        }

        try {
            setIsLoading(true);
            const response = await api.parseUrls(urls);
            return response.pageIds;
        } catch (error) {
            console.error('Error while parsing URLs:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Extracts headers from child pages & updates parent page
     */
    const extractHeaders = async (formData: FormData): Promise<ApiResponse> => {
        try {
            setIsLoading(true);
            const response = await api.extractHeaders(formData);
            return response;
        } catch (error) {
            console.error('Error during header extraction:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        checkParentPageContent,
        getChildPages,
        parseUrls,
        extractHeaders
    };
};