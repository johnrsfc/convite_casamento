'use client';

import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);
        // Cria o elemento de áudio uma vez
        const audio = new Audio('/musica/musica.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        // Tenta tocar automaticamente após interação do usuário
        const tryAutoplay = () => {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                // Navegador bloqueou, usuário terá que clicar no botão
            });
            // Remove listener após primeira tentativa
            document.removeEventListener('click', tryAutoplay);
            document.removeEventListener('touchstart', tryAutoplay);
        };

        // Escuta a primeira interação do usuário pra desbloquear o áudio
        document.addEventListener('click', tryAutoplay, { once: true });
        document.addEventListener('touchstart', tryAutoplay, { once: true });

        return () => {
            audio.pause();
            audio.src = '';
            document.removeEventListener('click', tryAutoplay);
            document.removeEventListener('touchstart', tryAutoplay);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => { });
        }
    };

    if (!mounted) return null;

    return (
        <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
            style={{
                position: 'fixed',
                bottom: '1.25rem',
                right: '1.25rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#b8956e',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 15px rgba(184, 149, 110, 0.4)',
                cursor: 'pointer',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'transform 0.2s ease, background 0.2s ease',
            }}
        >
            {isPlaying ? '⏸' : '♫'}
        </button>
    );
}
