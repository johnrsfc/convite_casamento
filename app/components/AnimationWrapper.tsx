'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import para evitar hydration issues
const OpeningAnimation = dynamic(() => import('./OpeningAnimation'), { ssr: false });

export default function AnimationWrapper({ children }: { children: React.ReactNode }) {
    const [showAnimation, setShowAnimation] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Verifica se já viu a animação nesta sessão
        const hasSeenAnimation = sessionStorage.getItem('hasSeenOpeningAnimation');
        if (hasSeenAnimation) {
            setShowAnimation(false);
        }
        setMounted(true);
    }, []);

    const handleComplete = () => {
        sessionStorage.setItem('hasSeenOpeningAnimation', 'true');
        setShowAnimation(false);
    };

    // Não renderiza nada até montar (evita hydration mismatch)
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <>
            {showAnimation && <OpeningAnimation onComplete={handleComplete} />}
            <div style={{
                opacity: showAnimation ? 0 : 1,
                transition: 'opacity 0.5s ease-in',
                visibility: showAnimation ? 'hidden' : 'visible'
            }}>
                {children}
            </div>
        </>
    );
}
