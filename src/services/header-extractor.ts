import * as cheerio from 'cheerio';

// Interface for status
export interface HeaderStatus {
    text: string;         // Status text (e.g. "DONE")
    color: string;        // Status color (e.g. "Green")
    originalHtml: string; // Original HTML of the status macro
}

// Basic interface for header
export interface Header {
    text: string;        // Original header text
    level: number;       // Header level (1-6)
    id?: string;         // Optional header ID
    pageId: string;      // ID of the page to which the header belongs
}

// Extended header interface with status
export interface HeaderWithStatus extends Header {
    status?: HeaderStatus;
    originalId: string;  // Original Confluence header ID
    pageTitle: string;   // Page title for URL
    cleanText: string;   // Clean header text without status
}

export class HeaderExtractor {
    /**
     * Extracts headers from the HTML content of a Confluence page.
     * The method handles special status macros used in Confluence.
     * 
     * @param content HTML content of the page
     * @param pageId Confluence page ID
     * @param pageTitle Confluence page title
     * @returns Array of header objects
     */
    extractHeaders(content: string, pageId: string, pageTitle: string): HeaderWithStatus[] {
        const headers: HeaderWithStatus[] = [];

        try {
            const $ = cheerio.load(content, {
                xml: {
                    xmlMode: true,      // Enable XML mode for better handling of custom tags
                    decodeEntities: true // Decode HTML entities
                }
            });

            // Find all headers (h1-h6)
            $('h1, h2, h3, h4, h5, h6').each((_, element) => {
                const headerElement = $(element);
                const headerLevel = parseInt(element.tagName.replace('h', ''));
                const headerId = headerElement.attr('id') || '';

                // Try to find the Confluence status macro
                const statusMacro = headerElement.find('ac\\:structured-macro[ac\\:name="status"]');
                let statusText = '';
                let statusColor = '';
                let statusHtml = '';
                let cleanHeaderText = '';

                if (statusMacro.length > 0) {
                    // Extract status title (e.g. "DONE")
                    statusText = statusMacro.find('ac\\:parameter[ac\\:name="title"]').text();

                    // Extract status color (e.g. "Green")
                    statusColor = statusMacro.find('ac\\:parameter[ac\\:name="colour"]').text();

                    // Preserve original HTML of the status macro
                    statusHtml = $.html(statusMacro);

                    // Remove status macro from header text to get clean text
                    const clonedHeader = headerElement.clone();
                    clonedHeader.find('ac\\:structured-macro').remove();
                    cleanHeaderText = clonedHeader.text().trim();
                } else {
                    // If there's no status macro, use the full header text
                    cleanHeaderText = headerElement.text().trim();
                }

                // Create fragment identifier compatible with Confluence
                let originalId = headerId;
                if (!originalId && statusText) {
                    // If there's no ID but there is a status, create ID in the "STATUS-text" format
                    originalId = `${statusText}-${cleanHeaderText.replace(/\s+/g, '-')}`;
                } else if (!originalId) {
                    // If there's neither ID nor status, create ID from text only
                    originalId = cleanHeaderText.replace(/\s+/g, '-');
                }

                // Create header object
                const header: HeaderWithStatus = {
                    text: headerElement.text().trim(),  // Full text with status macro
                    cleanText: cleanHeaderText,         // Text without status macro
                    level: headerLevel,
                    id: this.createHeaderId(cleanHeaderText),
                    originalId: originalId,
                    pageId: pageId,
                    pageTitle: pageTitle
                };

                // Add status information if it exists
                if (statusText) {
                    header.status = {
                        text: statusText,
                        color: statusColor,
                        originalHtml: statusHtml
                    };
                }

                headers.push(header);
            });
        } catch (error) {
            console.error('Error while extracting headers with Cheerio:', error);

            // Fallback to regex method for simpler cases
            return this.extractHeadersWithRegex(content, pageId, pageTitle);
        }

        return headers;
    }

    /**
     * Backup method for extracting headers using regex.
     * Tries to handle Confluence status macros using regular expressions.
     */
    private extractHeadersWithRegex(content: string, pageId: string, pageTitle: string): HeaderWithStatus[] {
        const headers: HeaderWithStatus[] = [];

        try {
            // Regex for extracting headers with status macros
            const headerRegex = /<h(\d)[^>]*?(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h\1>/g;

            // Regex for extracting status macros
            const statusMacroRegex = /(<ac:structured-macro[^>]*?ac:name="status"[^>]*>[\s\S]*?<ac:parameter[^>]*?ac:name="title"[^>]*>(.*?)<\/ac:parameter>[\s\S]*?<ac:parameter[^>]*?ac:name="colour"[^>]*>(.*?)<\/ac:parameter>[\s\S]*?<\/ac:structured-macro>)/;

            let match;
            while ((match = headerRegex.exec(content)) !== null) {
                const headerLevel = parseInt(match[1]);
                const headerId = match[2] || '';
                const headerContent = match[3];

                // Check if there's a status macro in the header content
                const statusMatch = headerContent.match(statusMacroRegex);
                let statusText = '';
                let statusColor = '';
                let statusHtml = '';
                let cleanHeaderText = headerContent;

                if (statusMatch) {
                    const fullMacro = statusMatch[1];
                    statusText = statusMatch[2];
                    statusColor = statusMatch[3];
                    statusHtml = fullMacro;

                    // Remove status macro from header text
                    cleanHeaderText = headerContent.replace(statusMacroRegex, '').trim();
                }

                // Remove all remaining HTML tags
                cleanHeaderText = cleanHeaderText.replace(/<[^>]*>/g, '').trim();

                // Create fragment identifier
                let originalId = headerId;
                if (!originalId && statusText) {
                    originalId = `${statusText}-${cleanHeaderText.replace(/\s+/g, '-')}`;
                } else if (!originalId) {
                    originalId = cleanHeaderText.replace(/\s+/g, '-');
                }

                // Create header object
                const header: HeaderWithStatus = {
                    text: headerContent.replace(/<[^>]*>/g, '').trim(),
                    cleanText: cleanHeaderText,
                    level: headerLevel,
                    id: this.createHeaderId(cleanHeaderText),
                    originalId: originalId,
                    pageId: pageId,
                    pageTitle: pageTitle
                };

                // Add status information if it exists
                if (statusText) {
                    header.status = {
                        text: statusText,
                        color: statusColor,
                        originalHtml: statusHtml
                    };
                }

                headers.push(header);
            }
        } catch (error) {
            console.error('Error while extracting headers with regex:', error);
        }

        return headers;
    }

    /**
     * Creates a header ID based on text.
     */
    private createHeaderId(text: string): string {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }

    /**
     * Formats Confluence page URL with fragment.
     */
    formatPageUrl(baseUrl: string, spaceKey: string, pageId: string, pageTitle: string, headerId: string): string {
        // Format page title for URL (remove disallowed characters, replace spaces with +)
        const formattedTitle = pageTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, '+');
        return `${baseUrl}/spaces/${spaceKey}/pages/${pageId}/${formattedTitle}#${headerId}`;
    }

    /**
     * Generates Confluence status macro based on status object.
     * @param status Status object
     * @returns HTML of Confluence status macro
     */
    generateStatusMacro(status: HeaderStatus): string {
        // If we have the original HTML macro, use it
        if (status.originalHtml) {
            return status.originalHtml;
        }

        // Otherwise generate a new macro
        return `<ac:structured-macro ac:name="status" ac:schema-version="1">
  <ac:parameter ac:name="colour">${status.color}</ac:parameter>
  <ac:parameter ac:name="title">${status.text}</ac:parameter>
</ac:structured-macro>`;
    }

    /**
     * Generates HTML with headers as a list.
     * @param allHeaders Array of headers
     * @param baseUrl Base Confluence URL
     * @param spaceKey Space key
     * @param showStatus Whether to display header statuses
     * @returns HTML with headers as a list
     */
    generateHeadersAsList(
        allHeaders: HeaderWithStatus[],
        baseUrl: string,
        spaceKey: string,
        showStatus: boolean = false
    ): string {
        // Group headers by page
        const headersByPage: Record<string, { title: string; headers: HeaderWithStatus[] }> = {};

        allHeaders.forEach(header => {
            if (!headersByPage[header.pageId]) {
                headersByPage[header.pageId] = {
                    title: header.pageTitle,
                    headers: []
                };
            }
            headersByPage[header.pageId].headers.push(header);
        });

        // Generate HTML
        let content = `<h1>Spis nagłówków z podstron</h1>\n<p>Automatycznie wygenerowany spis:</p>\n`;

        Object.keys(headersByPage).forEach(pageId => {
            const page = headersByPage[pageId];
            content += `<h2>${page.title}</h2>\n<ul>\n`;

            page.headers.forEach(header => {
                // Indentation for different header levels
                const indent = '  '.repeat(header.level - 1);

                // Link to the page with header anchor
                const pageUrl = this.formatPageUrl(baseUrl, spaceKey, header.pageId, header.pageTitle, header.originalId);

                if (showStatus && header.status) {
                    // With status macro
                    content += `${indent}<li>${this.generateStatusMacro(header.status)}<a href="${pageUrl}">${header.cleanText}</a></li>\n`;
                } else {
                    // Without status
                    content += `${indent}<li><a href="${pageUrl}">${header.cleanText}</a></li>\n`;
                }
            });

            content += `</ul>\n`;
        });

        return content;
    }

    /**
     * Generates HTML with headers as headings.
     * @param allHeaders Array of headers
     * @param baseUrl Base Confluence URL
     * @param spaceKey Space key
     * @param showStatus Whether to display header statuses
     * @returns HTML with headers as headings
     */
    generateHeadersAsHeadings(
        allHeaders: HeaderWithStatus[],
        baseUrl: string,
        spaceKey: string,
        showStatus: boolean = false
    ): string {
        // Group headers by page
        const headersByPage: Record<string, { title: string; headers: HeaderWithStatus[] }> = {};

        allHeaders.forEach(header => {
            if (!headersByPage[header.pageId]) {
                headersByPage[header.pageId] = {
                    title: header.pageTitle,
                    headers: []
                };
            }
            headersByPage[header.pageId].headers.push(header);
        });

        // Generate HTML
        let content = `<h1>Spis nagłówków z podstron</h1>\n<p>Automatycznie wygenerowany spis:</p>\n`;

        Object.keys(headersByPage).forEach(pageId => {
            const page = headersByPage[pageId];
            content += `<h2>${page.title}</h2>\n`;

            page.headers.forEach(header => {
                // Determine header level - always one level higher than the original
                // (because the main page starts with h2 for page title)
                const outputLevel = Math.min(header.level + 2, 6); // Maximum h6

                // Link to the page with header anchor
                const pageUrl = this.formatPageUrl(baseUrl, spaceKey, header.pageId, header.pageTitle, header.originalId);

                if (showStatus && header.status) {
                    // With status macro
                    content += `<h${outputLevel}>${this.generateStatusMacro(header.status)}<a href="${pageUrl}">${header.cleanText}</a></h${outputLevel}>\n`;
                } else {
                    // Without status
                    content += `<h${outputLevel}><a href="${pageUrl}">${header.cleanText}</a></h${outputLevel}>\n`;
                }
            });
        });

        return content;
    }

    /**
     * Generates HTML with headers.
     * @param allHeaders Array of headers
     * @param baseUrl Base Confluence URL
     * @param spaceKey Space key
     * @param asHeadings Whether to generate as headings (true) or as a list (false)
     * @param showStatus Whether to display header statuses
     * @returns HTML with headers
     */
    generateHeadersHtml(
        allHeaders: HeaderWithStatus[],
        baseUrl: string,
        spaceKey: string,
        asHeadings: boolean = false,
        showStatus: boolean = false
    ): string {
        if (asHeadings) {
            return this.generateHeadersAsHeadings(allHeaders, baseUrl, spaceKey, showStatus);
        } else {
            return this.generateHeadersAsList(allHeaders, baseUrl, spaceKey, showStatus);
        }
    }
}