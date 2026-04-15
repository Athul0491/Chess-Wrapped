'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playSound: (src: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const stored = localStorage.getItem('lichess_wrapped_muted');
        return stored ? Boolean(JSON.parse(stored)) : false;
    });

    // 👇 Keep track of all currently playing audio elements
    const activeAudios = useRef<Set<HTMLAudioElement>>(new Set());

    // 👇 When isMuted changes, update ALL active sounds immediately
    useEffect(() => {
        activeAudios.current.forEach(audio => {
            audio.muted = isMuted;
            // Optional: Pause them if you want silence to mean "stop"
            // if (isMuted) audio.pause();
        });
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('lichess_wrapped_muted', JSON.stringify(newState));
            return newState;
        });
    };

    const playSound = (src: string) => {
        const audio = new Audio(src);
        audio.volume = 0.4;
        audio.muted = isMuted; // Set initial state based on current context

        // Add to active set
        activeAudios.current.add(audio);

        // Remove from set when finished
        audio.onended = () => {
            activeAudios.current.delete(audio);
        };

        // Play (catch error if user hasn't interacted with page yet)
        audio.play().catch(() => {});
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
