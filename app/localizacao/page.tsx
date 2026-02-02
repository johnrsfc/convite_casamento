'use client';

import { useState } from 'react';
import Link from 'next/link';

// Ícone do Waze (fantasminha característico)
const WazeIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 1.33.26 2.61.74 3.77-.03.65-.15 1.6-.58 2.62-.23.52-.02 1.12.48 1.38.23.12.49.18.74.18.34 0 .68-.12.95-.35 1.04-.88 1.95-1.27 2.58-1.45.05-.01.11-.03.16-.04C8.36 19.3 10.1 20 12 20c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        <circle fill="#333" cx="8.5" cy="10" r="1.5" />
        <circle fill="#333" cx="15.5" cy="10" r="1.5" />
        <path fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" d="M8.5 14c1 1.5 5.5 1.5 7 0" />
    </svg>
);

// Ícone do Google Maps
const GoogleMapsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

export default function LocalizacaoPage() {
    const [showPopup, setShowPopup] = useState(true);

    const endereco = "Av. Reneta, 258 - Vila Formosa";
    const local = "Mansão O Casarão";

    // Links para os apps de navegação
    const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(endereco + " - " + local)}`;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco + " - " + local)}`;

    return (
        <main style={{
            minHeight: '100vh',
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            {/* Popup */}
            <div style={{
                background: '#ffffff',
                borderRadius: '0 24px 0 24px',
                padding: '2rem 1.5rem',
                maxWidth: '360px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Botão fechar */}
                <Link
                    href="/"
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0',
                        color: '#fff',
                        fontSize: '1.5rem',
                        textDecoration: 'none'
                    }}
                >
                    ✕
                </Link>

                {/* Título */}
                <h2 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Escolha seu App de Viagem
                </h2>

                <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.75rem',
                    color: '#999',
                    marginBottom: '1.5rem'
                }}>
                    Clique no ícone para abrir a navegação
                </p>

                {/* Ícones dos apps */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Waze */}
                    <a
                        href={wazeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none'
                        }}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: '#33ccff',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            padding: '12px',
                            transition: 'transform 0.2s ease'
                        }}>
                            <WazeIcon />
                        </div>
                        <span style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.75rem',
                            color: '#333',
                            fontWeight: 500
                        }}>Waze</span>
                    </a>

                    {/* Google Maps */}
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none'
                        }}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: '#4285F4',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            padding: '12px',
                            transition: 'transform 0.2s ease'
                        }}>
                            <GoogleMapsIcon />
                        </div>
                        <span style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.75rem',
                            color: '#333',
                            fontWeight: 500
                        }}>Google Maps</span>
                    </a>
                </div>

                {/* Divisor */}
                <div style={{
                    width: '60px',
                    height: '1px',
                    background: '#e0e0e0',
                    margin: '0 auto 1.5rem'
                }} />

                {/* Endereço */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.7rem',
                        color: '#999',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>Endereço</p>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem',
                        color: '#333',
                        fontWeight: 500,
                        lineHeight: 1.5
                    }}>
                        {endereco}
                    </p>
                    <p style={{
                        fontFamily: 'Great Vibes, cursive',
                        fontSize: '1.5rem',
                        color: '#b8956e',
                        marginTop: '0.25rem'
                    }}>
                        {local}
                    </p>
                </div>

                {/* Botão voltar */}
                <Link
                    href="/"
                    style={{
                        display: 'inline-block',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.8rem',
                        color: '#666',
                        textDecoration: 'none',
                        padding: '0.75rem 2rem',
                        border: '1px solid #ddd',
                        borderRadius: '0 12px 0 12px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    ← Voltar ao Convite
                </Link>
            </div>
        </main>
    );
}
