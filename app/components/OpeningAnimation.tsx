'use client';

import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    type: 'heart' | 'petal';
    rotation: number;
}

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Gerar partículas (corações e pétalas)
        const newParticles: Particle[] = [];
        for (let i = 0; i < 25; i++) {
            newParticles.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 2,
                size: 15 + Math.random() * 20,
                type: Math.random() > 0.5 ? 'heart' : 'petal',
                rotation: Math.random() * 360
            });
        }
        setParticles(newParticles);

        // Fade out após 3.5s e completar após 4s
        const fadeTimer = setTimeout(() => setFadeOut(true), 3500);
        const completeTimer = setTimeout(() => onComplete(), 4200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div
            onClick={onComplete}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'linear-gradient(180deg, #fff 0%, #faf8f5 50%, #f5ebe0 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.7s ease-out'
            }}
        >
            {/* Partículas caindo */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: '-50px',
                        fontSize: `${p.size}px`,
                        opacity: 0.7,
                        animation: `fall ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        transform: `rotate(${p.rotation}deg)`,
                        pointerEvents: 'none'
                    }}
                >
                    {p.type === 'heart' ? '💕' : '🌸'}
                </div>
            ))}

            {/* Conteúdo central */}
            <div style={{
                textAlign: 'center',
                animation: 'fadeInUp 1.5s ease-out',
                zIndex: 1
            }}>
                {/* Iniciais com animação */}
                <div style={{
                    fontFamily: 'Great Vibes, cursive',
                    fontSize: '4rem',
                    color: '#b8956e',
                    marginBottom: '1rem',
                    animation: 'pulse 2s ease-in-out infinite'
                }}>
                    L & J
                </div>

                {/* Coração central */}
                <div style={{
                    fontSize: '3rem',
                    animation: 'heartbeat 1.5s ease-in-out infinite',
                    marginBottom: '1.5rem'
                }}>
                    ❤️
                </div>

                {/* Texto */}
                <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.9rem',
                    color: '#666',
                    letterSpacing: '0.2rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    animation: 'fadeIn 2s ease-out 0.5s both'
                }}>
                    Nosso Casamento
                </p>

                <p style={{
                    fontFamily: 'Great Vibes, cursive',
                    fontSize: '1.8rem',
                    color: '#333',
                    animation: 'fadeIn 2s ease-out 1s both'
                }}>
                    18 de Abril de 2026
                </p>

                {/* Dica para pular */}
                <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.7rem',
                    color: '#999',
                    marginTop: '3rem',
                    animation: 'fadeIn 1s ease-out 2.5s both'
                }}>
                    Toque para continuar
                </p>
            </div>

            {/* CSS das animações */}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-50px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.7;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.15); }
                }
            `}</style>
        </div>
    );
}
