'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRateLimit } from './use-rate-limit';
import { LichessValidationService } from '@/lib/services/lichess-validation-service';

interface UseUsernameValidationReturn {
    username: string;
    setUsername: (username: string) => void;
    isLoading: boolean;
    error: string | null;
    handleSubmit: () => Promise<void>;
    clearError: () => void;
}

export function useUsernameValidation(): UseUsernameValidationReturn {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔥 Lichess validation only
    const rateLimitedValidate = useRateLimit(
        (username: string, year?: number) =>
            LichessValidationService.validateComplete(username, year),
        { delayMs: 2000, maxAttempts: 50 }
    );

    const handleSubmit = async () => {
        if (!username.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await rateLimitedValidate(username.trim());

            if (result.valid) {
                router.push(`/wrapped/${encodeURIComponent(result.username!)}`);
            } else {
                setIsLoading(false);
                setError(result.error || 'Something went wrong');
            }
        } catch (error) {
            setIsLoading(false);
            setError(error instanceof Error ? error.message : 'Please wait before trying again');
        }
    };

    const clearError = () => setError(null);

    return {
        username,
        setUsername,
        isLoading,
        error,
        handleSubmit,
        clearError,
    };
}
