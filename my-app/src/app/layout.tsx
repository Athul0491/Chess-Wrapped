import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { generateDefaultMetadata } from '@/lib/utils/metadata-utils';

export const metadata: Metadata = generateDefaultMetadata();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-[#211f1c] text-white antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
