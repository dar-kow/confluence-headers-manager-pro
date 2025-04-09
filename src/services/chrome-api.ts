import axios, { AxiosRequestConfig } from 'axios';
import { FormData } from './types';
import { HeaderExtractor, HeaderWithStatus } from './header-extractor';

// Storing authentication credentials
let authCredentials = {
    email: '',
    apiToken: ''
};

/**
 * Sets API authentication credentials
 */
export const setAuthCredentials = (email: string, apiToken: string) => {
    authCredentials.email = email;
    authCredentials.apiToken = apiToken;
};

/**
 * Creates Axios configuration with basic authentication
 */
const createAuthConfig = (): AxiosRequestConfig => {
    if (!authCredentials.email || !authCredentials.apiToken) {
        throw new Error('Brak danych uwierzytelniających. Skonfiguruj email i token API.');
    }

    return {
        auth: {
            username: authCredentials.email,
            password: authCredentials.apiToken
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

/**
 * API adapter for Chrome extension, handling communication with Confluence API
 */
export const chromeApi = {
    /**
     * Checks if the parent page already contains content
     */
    async checkParentPage(parentPageUrl: string) {
        try {
            // Extract domain and page ID from URL
            const urlObj = new URL(parentPageUrl);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}/wiki`;
            const pageId = this.extractPageId(parentPageUrl);

            // Fetch page content to check if it already has content
            const config = createAuthConfig();
            const response = await axios.get(
                `${baseUrl}/rest/api/content/${pageId}?expand=body.storage`,
                config
            );

            // Check if the page has content (more than basic HTML)
            const hasContent = response.data?.body?.storage?.value &&
                response.data.body.storage.value.length > 100;

            return { hasContent };
        } catch (error) {
            console.error('Error checking parent page:', error);
            throw new Error('Nie można sprawdzić zawartości strony. Sprawdź dane uwierzytelniające.');
        }
    },

    /**
     * Fetches child pages for a given parent page
     */
    async getChildPages(parentPageUrl: string) {
        try {
            // Extract domain from URL
            const urlObj = new URL(parentPageUrl);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}/wiki`;

            // Extract page ID from URL
            const pageId = this.extractPageId(parentPageUrl);

            // Call Confluence API with authentication
            const config = createAuthConfig();

            console.log(`Pobieranie stron podrzędnych: ${baseUrl}/rest/api/content/${pageId}/child/page`);

            // Fetch child pages with expand parameter to get full information
            const response = await axios.get(
                `${baseUrl}/rest/api/content/${pageId}/child/page?expand=version`,
                config
            );

            console.log('Odpowiedź z API:', response.data);

            // Check if we have results
            if (!response.data?.results || !Array.isArray(response.data.results)) {
                console.warn('Brak wyników lub nieprawidłowa struktura odpowiedzi:', response.data);
                return [];
            }

            // Map response to expected format
            const childPages = response.data.results.map((page: any) => ({
                id: page.id,
                title: page.title,
                version: {
                    number: page.version?.number || 1
                }
            }));

            console.log('Przetworzone strony podrzędne:', childPages);
            return childPages;
        } catch (error) {
            console.error('Error fetching child pages:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Axios response error:', error.response.data);
            }
            throw new Error(`Nie można pobrać stron podrzędnych: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
        }
    },

    /**
     * Parses child page URLs to IDs
     */
    async parseUrls(urls: string[]) {
        try {
            const pageIds = urls.map(url => this.extractPageId(url)).filter(Boolean);
            return pageIds;
        } catch (error) {
            console.error('Error parsing URLs:', error);
            throw error;
        }
    },

    /**
     * Extracts headers from child pages and updates parent page
     */
    async extractHeaders(formData: FormData) {
        try {
            // Extract domain from URL
            const urlObj = new URL(formData.parentPageUrl);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}/wiki`;

            // Extract parent page ID
            const parentPageId = this.extractPageId(formData.parentPageUrl);

            // Initialize header extractor
            const headerExtractor = new HeaderExtractor();

            // Fetch parent page content
            const config = createAuthConfig();
            const parentPage = await axios.get(
                `${baseUrl}/rest/api/content/${parentPageId}?expand=body.storage,version`,
                config
            );

            // Get page version
            const currentVersion = parentPage.data.version.number;

            // For each child page, fetch content and extract headers
            const allHeaders: HeaderWithStatus[] = [];

            for (const childPageId of formData.childPageIds) {
                try {
                    // Fetch child page content
                    const childPageResponse = await axios.get(
                        `${baseUrl}/rest/api/content/${childPageId}?expand=body.storage`,
                        config
                    );

                    const childPage = childPageResponse.data;
                    const pageContent = childPage.body.storage.value;

                    // Use header extractor to properly process headers
                    const headers = headerExtractor.extractHeaders(
                        pageContent,
                        childPageId,
                        childPage.title
                    );

                    allHeaders.push(...headers);
                } catch (err) {
                    console.error(`Error processing child page ${childPageId}:`, err);
                    // Continue with next page
                }
            }

            // Generate new content using HeaderExtractor class
            const spaceKey = this.extractSpaceKey(formData.parentPageUrl);

            // Use status parameter if it exists
            const showStatus = formData.showStatus || false;

            const newContent = headerExtractor.generateHeadersHtml(
                allHeaders,
                baseUrl,
                spaceKey,
                formData.headersAsHeadings,
                showStatus
            );

            // Update parent page
            const updateResponse = await axios.put(
                `${baseUrl}/rest/api/content/${parentPageId}`,
                {
                    id: parentPageId,
                    type: 'page',
                    title: parentPage.data.title,
                    body: {
                        storage: {
                            value: newContent,
                            representation: 'storage'
                        }
                    },
                    version: {
                        number: currentVersion + 1
                    }
                },
                config
            );

            return {
                success: true,
                message: `Zaktualizowano stronę "${parentPage.data.title}"`,
                headersCount: allHeaders.length,
                newVersion: updateResponse.data.version.number
            };
        } catch (error) {
            console.error('Error extracting headers:', error);
            throw new Error('Nie udało się zaktualizować nagłówków. Sprawdź dane uwierzytelniające i uprawnienia.');
        }
    },

    /**
     * Helper function to extract page ID from URL
     */
    extractPageId(url: string): string {
        // Example URL: https://darecki.atlassian.net/wiki/spaces/~123/pages/456/Title
        const regex = /\/pages\/(\d+)/;
        const match = url.match(regex);

        if (!match || !match[1]) {
            throw new Error(`Nie można wyciągnąć ID strony z URL: ${url}`);
        }

        return match[1];
    },

    /**
     * Helper function to extract space key from URL
     */
    extractSpaceKey(url: string): string {
        // Example URL: https://darecki.atlassian.net/wiki/spaces/~123/pages/456/Title
        const regex = /\/spaces\/([^\/]+)/;
        const match = url.match(regex);

        if (!match || !match[1]) {
            throw new Error(`Nie można wyciągnąć klucza przestrzeni z URL: ${url}`);
        }

        return match[1];
    }
};