import { useState } from 'react';
import { chromeApi } from '../services/chrome-api';
import { FormData } from '../services/types';

export const useConfluenceApi = () => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Checks if parent pg has content already
     * might be empty, might not be ¯\_(ツ)_/¯
     */
    const checkParentPageContent = async (parentPageUrl: string): Promise<boolean> => {
        if (!parentPageUrl) {
            return false;
        }

        try {
            setIsLoading(true);
            const response = await chromeApi.checkParentPage(parentPageUrl);
            return response.hasContent;
        } catch (error) {
            console.error('Error checking parent pg:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetches child pgs for parent - gets the kiddos
     */
    const getChildPages = async (parentPageUrl: string) => {
        if (!parentPageUrl) {
            return [];
        }

        try {
            setIsLoading(true);
            const response = await chromeApi.getChildPages(parentPageUrl);
            return response;
        } catch (error) {
            console.error('Error fetching child pgs:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Turns URLs into IDs - cuz we need IDs not URLs duh
     */
    const parseUrls = async (urls: string[]): Promise<string[]> => {
        if (!urls || urls.length === 0) {
            return [];
        }

        try {
            setIsLoading(true);
            const response = await chromeApi.parseUrls(urls);
            return response;
        } catch (error) {
            console.error('Error parsing URLs:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Gets hdrs from child pgs & updates parent
     * the good stuff happens here!
     */
    const extractHeaders = async (formData: FormData) => {
        try {
            setIsLoading(true);
            const response = await chromeApi.extractHeaders(formData);
            return response;
        } catch (error) {
            console.error('Error extracting hdrs:', error);
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