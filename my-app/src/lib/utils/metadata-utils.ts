import { Metadata } from 'next';
import { sanitizeUsername, escapeHtml } from './security-utils';

/**
 * Generate metadata for wrapped pages
 */
export function generateWrappedMetadata(
    rawUsername: string,
    year: number = 2025
): Metadata {
    const username = sanitizeUsername(rawUsername);
    const safeUsername = escapeHtml(username);

    return {
        title: `${safeUsername}'s ${year} Chess Wrapped`,
        description: `Check out ${safeUsername}'s Lichess stats for ${year}!`,
        openGraph: {
            title: `${safeUsername}'s Chess Wrapped`,
            description: `Check out my ${year} Lichess journey!`,
            images: ['/og-image.jpg'],
            type: 'website',
            siteName: 'Chess Wrapped',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${safeUsername}'s Chess Wrapped`,
            description: `My ${year} Lichess stats`,
            images: ['/og-image.jpg'],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/**
 * Generate default metadata for root layout
 */
export function generateDefaultMetadata(): Metadata {
    return {
        title: 'Chess Wrapped 2025',
        description: 'Visualize your year on Lichess. Artistically.',
        keywords: ['chess', 'lichess', 'wrapped', 'statistics', 'analytics', 'chess stats'],
        authors: [{ name: 'Chess Wrapped' }],
        openGraph: {
            title: 'Chess Wrapped',
            description: 'Your year on Lichess, wrapped beautifully.',
            images: ['/og-image.jpg'],
            type: 'website',
            siteName: 'Chess Wrapped',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Chess Wrapped',
            description: 'Your year on Lichess, wrapped beautifully.',
            images: ['/og-image.jpg'],
        },
        icons: {
            icon: '/icon.png',
            shortcut: '/icon.png',
            apple: '/icon.png',
        },
        robots: {
            index: true,
            follow: true,
        },
        metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
    };
}

