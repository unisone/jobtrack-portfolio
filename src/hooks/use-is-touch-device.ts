'use client';

import { useState, useEffect } from 'react';

// Helper to detect touch devices (mobile/tablet)
// Returns null during SSR to avoid hydration mismatch
export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState<boolean | null>(null);

    useEffect(() => {
        // Check for touch device on mount
        setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }, []);

    return isTouch;
}
