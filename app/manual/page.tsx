import Link from 'next/link';
import {
    CalendarCheckIcon,
    ClockIcon,
    ShirtIcon,
    FlowerIcon,
    CameraIcon,
    WaveIcon,
    HandIcon,
    ChatIcon,
    PaletteIcon,
    NoInviteIcon,
    HeartIcon,
    BanIcon,
} from '../components/ManualIcons';

const regras = [
    { id: 1, texto: 'Confirme Sua Presença', icon: <CalendarCheckIcon /> },
    { id: 2, texto: 'Traje Esporte Fino', icon: <ShirtIcon /> },
    { id: 3, texto: 'Convidado Não Convida', icon: <NoInviteIcon /> },
    { id: 4, texto: 'Não Se Atrase, Seja Pontual', icon: <ClockIcon /> },
    { id: 5, texto: 'Não Leve Decoração Pra Casa', icon: <FlowerIcon /> },
    { id: 6, texto: 'Branco é a Cor da Noiva', icon: <BanIcon /> },
    { id: 7, texto: 'Não Compareça de Rosé ou Verde Oliva', icon: <PaletteIcon /> },
    { id: 8, texto: 'Aproveite Bastante', icon: <HeartIcon /> },
    { id: 9, texto: 'Não Atrapalhe os Fotógrafos', icon: <CameraIcon /> },
    { id: 10, texto: 'Não Saia Sem Se Despedir dos Noivos', icon: <WaveIcon /> },
    { id: 11, texto: 'Não Faça Comentários Negativos', icon: <ChatIcon /> },
    { id: 12, texto: 'Evite Confusões', icon: <HandIcon /> },
];

export default function ManualPage() {
    return (
        <main style={{
            minHeight: '100vh',
            background: '#ffffff',
            padding: '1.5rem'
        }}>
            <div style={{ maxWidth: '430px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                    <Link
                        href="/"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.85rem',
                            color: '#666',
                            textDecoration: 'none',
                            position: 'absolute',
                            left: 0,
                            top: 0
                        }}
                    >
                        ← Voltar
                    </Link>
                    <h1 style={{
                        fontFamily: 'Great Vibes, cursive',
                        fontSize: '2.5rem',
                        color: '#2c2c2c',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2
                    }}>Manual dos<br />Convidados</h1>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.8rem',
                        color: '#999'
                    }}>Por favor, siga estas orientações</p>
                </header>

                {/* Grid de regras - 2 colunas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    {regras.map((regra) => (
                        <div
                            key={regra.id}
                            style={{
                                background: '#fafafa',
                                padding: '1.25rem 0.75rem',
                                borderRadius: '0 20px 0 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minHeight: '130px',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <div style={{
                                width: '42px',
                                height: '42px',
                                color: '#b8956e',
                                marginBottom: '0.5rem'
                            }}>
                                {regra.icon}
                            </div>
                            <h3 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                color: '#333',
                                lineHeight: 1.3,
                                margin: 0
                            }}>{regra.texto}</h3>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem',
                        color: '#b8956e'
                    }}>Obrigado pela compreensão! 💕</p>
                </footer>
            </div>
        </main>
    );
}
