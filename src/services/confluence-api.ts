import axios from 'axios';

/**
 * Interface for Confluence URL information
 */
export interface ConfluenceUrlInfo {
    baseUrl: string;
    spaceKey: string;
    pageId: string;
    pageTitle?: string;
}

/**
 * Interface for header
 */
export interface Header {
    text: string;
    level: string;
    pageId: string;
    pageTitle: string;
    headerId?: string;
}

/**
 * Confluence API class for interacting with Confluence API
 */
export class ConfluenceAPI {
    private baseUrl: string = '';
    private email: string = '';
    private apiToken: string = '';

    /**
     * Sets the base URL for Confluence API
     * @param url Base Confluence URL
     */
    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    /**
     * Sets API credentials
     * @param email User email
     * @param apiToken API token
     */
    setCredentials(email: string, apiToken: string): void {
        this.email = email;
        this.apiToken = apiToken;
    }

    /**
     * Fetches a Confluence page
     * @param pageId Page ID
     * @returns Page data
     */
    async getPage(pageId: string): Promise<any> {
        try {
            if (!this.baseUrl) {
                throw new Error('Base URL not set');
            }

            const config = {
                auth: {
                    username: this.email,
                    password: this.apiToken
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.get(
                `${this.baseUrl}/rest/api/content/${pageId}?expand=body.storage,version`,
                config
            );

            // Transform the response to a more convenient format
            return {
                id: response.data.id,
                title: response.data.title,
                content: response.data.body?.storage?.value || '',
                version: response.data.version
            };
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }
    }

    /**
     * Fetches child pages for a given parent page
     * @param parentPageId Parent page ID
     * @returns Array of child pages
     */
    async getChildPages(parentPageId: string): Promise<any[]> {
        try {
            if (!this.baseUrl) {
                throw new Error('Base URL not set');
            }

            const config = {
                auth: {
                    username: this.email,
                    password: this.apiToken
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.get(
                `${this.baseUrl}/rest/api/content/${parentPageId}/child/page?expand=version`,
                config
            );

            // Transform the response to a more convenient format
            return response.data.results.map((page: any) => ({
                id: page.id,
                title: page.title,
                version: page.version
            }));
        } catch (error) {
            console.error('Error fetching child pages:', error);
            throw error;
        }
    }

    /**
     * Updates a Confluence page
     * @param page Page data
     * @param newContent New page content
     * @returns Updated page data
     */
    async updatePage(page: any, newContent: string): Promise<any> {
        try {
            if (!this.baseUrl) {
                throw new Error('Base URL not set');
            }

            const config = {
                auth: {
                    username: this.email,
                    password: this.apiToken
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.put(
                `${this.baseUrl}/rest/api/content/${page.id}`,
                {
                    id: page.id,
                    type: 'page',
                    title: page.title,
                    body: {
                        storage: {
                            value: newContent,
                            representation: 'storage'
                        }
                    },
                    version: {
                        number: page.version.number + 1
                    }
                },
                config
            );

            return {
                id: response.data.id,
                title: response.data.title,
                version: response.data.version
            };
        } catch (error) {
            console.error('Error updating page:', error);
            throw error;
        }
    }

    /**
     * Parses a Confluence page URL into components
     * @param url Confluence page URL
     * @returns URL information
     */
    static parseConfluenceUrl(url: string): ConfluenceUrlInfo {
        try {
            const urlObj = new URL(url);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}/wiki`;

            // Extract spaceKey and pageId from URL
            const spaceKeyMatch = url.match(/\/spaces\/([^\/]+)/);
            const pageIdMatch = url.match(/\/pages\/(\d+)(?:\/([^\/]+))?/);

            if (!spaceKeyMatch || !pageIdMatch) {
                throw new Error('Invalid Confluence URL format');
            }

            const spaceKey = spaceKeyMatch[1];
            const pageId = pageIdMatch[1];
            const pageTitle = pageIdMatch[2] ? decodeURIComponent(pageIdMatch[2].replace(/\+/g, ' ')) : undefined;

            return {
                baseUrl,
                spaceKey,
                pageId,
                pageTitle
            };
        } catch (error) {
            console.error('Error parsing Confluence URL:', error);
            throw error;
        }
    }
}