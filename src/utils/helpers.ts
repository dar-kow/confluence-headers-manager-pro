/**
 * Formats URL for Confluence page
 * @param baseUrl - Base Confluence URL
 * @param spaceKey - Space key
 * @param pageId - Page ID
 * @param pageTitle - Page title
 * @param headerId - Header ID (optional)
 * @returns Formatted URL
 */
export const formatPageUrl = (
    baseUrl: string,
    spaceKey: string,
    pageId: string,
    pageTitle: string,
    headerId?: string
): string => {
    // Format page title (remove special chars, replace spaces with plus signs)
    const formattedTitle = pageTitle
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '+');

    const url = `${baseUrl}/spaces/${spaceKey}/pages/${pageId}/${formattedTitle}`;

    // Add header ID if it exists
    return headerId ? `${url}#${headerId}` : url;
};

/**
 * Extracts page ID from Confluence URL
 * @param url - Confluence page URL
 * @returns Page ID or null if not found
 */
export const extractPageIdFromUrl = (url: string): string | null => {
    // Example URL: https://your_name.atlassian.net/wiki/spaces/~123/pages/456/Title
    const regex = /\/pages\/(\d+)/;
    const match = url.match(regex);

    return match?.[1] || null;
};

/**
 * Checks if given URL is a valid Confluence URL
 * @param url - URL to check
 * @returns true if URL is valid
 */
export const isValidConfluenceUrl = (url: string): boolean => {
    return url.includes('atlassian.net/wiki/spaces/') && url.includes('/pages/');
};

/**
 * Trims text to specified length with ellipsis
 * @param text - Text to trim
 * @param maxLength - Max length (defaults to 100)
 * @returns Trimmed text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Delays function execution (useful for debounce)
 * @param ms - Delay time in milliseconds
 * @returns Promise that resolves after given time
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};