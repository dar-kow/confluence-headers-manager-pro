/**
 * Formats URL for Confluence page - makes it pretty!
 * @param baseUrl - Base URL of Confluence
 * @param spaceKey - Space key (ya know, that weird abbrev)
 * @param pageId - ID of the page
 * @param pageTitle - Page title
 * @param headerId - Header ID (optional)
 * @returns Nicely formatted URL
 */
export const formatPageUrl = (
    baseUrl: string,
    spaceKey: string,
    pageId: string,
    pageTitle: string,
    headerId?: string
): string => {
    // Format the page title (remove weird chars, replace spaces w/ plus signs)
    const formattedTitle = pageTitle
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '+');

    const url = `${baseUrl}/spaces/${spaceKey}/pages/${pageId}/${formattedTitle}`;

    // Add header ID if we got one
    return headerId ? `${url}#${headerId}` : url;
};

/**
 * Grabs page ID from a Confluence URL - handy util!
 * @param url - Confluence page URL
 * @returns Page ID or null if couldn't find it :/
 */
export const extractPageIdFromUrl = (url: string): string | null => {
    // Example URL: https://your_name.atlassian.net/wiki/spaces/~123/pages/456/Title
    const regex = /\/pages\/(\d+)/;
    const match = url.match(regex);

    return match?.[1] || null;
};

/**
 * Checks if URL is legit Confluence URL or some garbage
 * @param url - URL to check
 * @returns true if it looks like confluence, false if not
 */
export const isValidConfluenceUrl = (url: string): boolean => {
    return url.includes('atlassian.net/wiki/spaces/') && url.includes('/pages/');
};

/**
 * Cuts text down 2 size w/ ellipsis
 * @param text - Text to chop
 * @param maxLength - Max len (100 by default)
 * @returns Trimmed txt
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Waits a bit - useful 4 debounce stuff
 * @param ms - Time in ms to wait
 * @returns Promise that resolves after waitin
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};