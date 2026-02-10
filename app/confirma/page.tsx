'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Acompanhante {
    nome: string;
    idade: string;
    confirmado: boolean;
}

interface ConvidadoData {
    nome: string;
    maxAcompanhantes: number;
    acompanhantes: string[];
}

export default function ConfirmaPresencaPage() {
    const [codigo, setCodigo] = useState('');
    const [convidado, setConvidado] = useState<ConvidadoData | null>(null);
    const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([]);
    const [confirmacaoEnviada, setConfirmacaoEnviada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // Validar código
    const validarCodigo = async () => {
        if (!codigo.trim()) {
            setErro('Digite o código do seu convite');
            return;
        }

        setErro('');
        setLoading(true);

        try {
            const response = await fetch('/api/convidados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo: codigo.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.error || 'Código inválido');
                setConvidado(null);
                setLoading(false);
                return;
            }

            setConvidado(data);

            // Preparar acompanhantes
            const novosAcompanhantes: Acompanhante[] = [];
            if (data.acompanhantes && data.acompanhantes.length > 0) {
                data.acompanhantes.forEach((nome: string) => {
                    novosAcompanhantes.push({ nome, idade: '', confirmado: false });
                });
            } else {
                for (let i = 0; i < data.maxAcompanhantes; i++) {
                    novosAcompanhantes.push({ nome: '', idade: '', confirmado: false });
                }
            }
            setAcompanhantes(novosAcompanhantes);
        } catch {
            setErro('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Atualizar acompanhante
    const atualizarAcompanhante = (index: number, campo: keyof Acompanhante, valor: string | boolean) => {
        const novos = [...acompanhantes];
        novos[index] = { ...novos[index], [campo]: valor };
        setAcompanhantes(novos);
    };

    // Enviar confirmação
    const enviarConfirmacao = async () => {
        if (!convidado) return;

        setLoading(true);
        try {
            const response = await fetch('/api/confirmar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo: codigo.trim(),
                    convidadoPrincipal: convidado.nome,
                    acompanhantes: acompanhantes.filter(a => a.confirmado)
                })
            });

            if (response.ok) {
                setConfirmacaoEnviada(true);
            } else {
                setErro('Erro ao enviar confirmação. Tente novamente.');
            }
        } catch {
            setErro('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Tela de sucesso
    if (confirmacaoEnviada) {
        return (
            <main style={{
                minHeight: '100vh',
                background: '#ffffff',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '360px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#b8956e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '2.5rem'
                    }}>
                        ✓
                    </div>
                    <h1 style={{
                        fontFamily: 'Great Vibes, cursive',
                        fontSize: '2.5rem',
                        color: '#2c2c2c',
                        marginBottom: '1rem'
                    }}>Presença Confirmada!</h1>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '2rem',
                        lineHeight: 1.6
                    }}>
                        Obrigado por confirmar sua presença. Estamos muito felizes em contar com você neste dia especial!
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.85rem',
                            color: '#666',
                            textDecoration: 'none',
                            padding: '0.75rem 2rem',
                            border: '1px solid #ddd',
                            borderRadius: '0 12px 0 12px'
                        }}
                    >
                        ← Voltar ao Convite
                    </Link>
                </div>
            </main>
        );
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '1rem',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '0 12px 0 12px',
        outline: 'none',
        background: '#fafafa',
        WebkitAppearance: 'none',
        appearance: 'none' as const
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.75rem',
        color: '#666',
        display: 'block',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
    };

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
                        fontSize: '2.2rem',
                        color: '#2c2c2c',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2
                    }}>Confirme sua<br />Presença</h1>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.75rem',
                        color: '#999'
                    }}>18 de Abril de 2026 • Mansão O Casarão</p>
                </header>

                {/* Campo de código */}
                {!convidado && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Código do Convite</label>
                        <input
                            type="text"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                            value={codigo}
                            maxLength={6}
                            onChange={(e) => {
                                setCodigo(e.target.value.toUpperCase().slice(0, 6));
                                setErro('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') validarCodigo();
                            }}
                            placeholder="Ex: ABC123"
                            style={{
                                ...inputStyle,
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                letterSpacing: '0.2em',
                                fontWeight: 600
                            }}
                        />

                        {erro && (
                            <p style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.8rem',
                                color: '#e74c3c',
                                marginTop: '0.75rem',
                                textAlign: 'center'
                            }}>{erro}</p>
                        )}

                        <button
                            onClick={validarCodigo}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                marginTop: '1rem',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#fff',
                                background: loading ? '#ccc' : '#b8956e',
                                border: 'none',
                                borderRadius: '0 16px 0 16px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                        >
                            {loading ? 'Validando...' : 'Validar Código'}
                        </button>
                    </div>
                )}

                {/* Dados do convidado (após validação) */}
                {convidado && (
                    <>
                        {/* Nome do convidado */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                            padding: '1.5rem',
                            background: '#faf8f5',
                            borderRadius: '0 16px 0 16px'
                        }}>
                            <p style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.7rem',
                                color: '#999',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '0.5rem'
                            }}>Convidado</p>
                            <p style={{
                                fontFamily: 'Great Vibes, cursive',
                                fontSize: '1.8rem',
                                color: '#2c2c2c'
                            }}>{convidado.nome}</p>
                        </div>

                        {/* Acompanhantes */}
                        {acompanhantes.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Acompanhantes (selecione quem vai)</label>

                                {acompanhantes.map((ac, i) => (
                                    <div key={i} style={{
                                        background: '#fafafa',
                                        padding: '1rem',
                                        borderRadius: '0 12px 0 12px',
                                        marginBottom: '0.75rem',
                                        border: ac.confirmado ? '1px solid #b8956e' : '1px solid #e0e0e0'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={ac.confirmado}
                                                onChange={(e) => atualizarAcompanhante(i, 'confirmado', e.target.checked)}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    accentColor: '#b8956e'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                {ac.nome ? (
                                                    <span style={{
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '0.9rem',
                                                        color: '#333'
                                                    }}>{ac.nome}</span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder={`Acompanhante ${i + 1}`}
                                                        value={ac.nome}
                                                        onChange={(e) => atualizarAcompanhante(i, 'nome', e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontSize: '0.85rem',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: '6px',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            {ac.confirmado && (
                                                <input
                                                    type="number"
                                                    placeholder="Idade"
                                                    value={ac.idade}
                                                    onChange={(e) => atualizarAcompanhante(i, 'idade', e.target.value)}
                                                    style={{
                                                        width: '60px',
                                                        padding: '0.5rem',
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '0.85rem',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        outline: 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {erro && (
                            <p style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.8rem',
                                color: '#e74c3c',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>{erro}</p>
                        )}

                        {/* Botão Confirmar */}
                        <button
                            onClick={enviarConfirmacao}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#fff',
                                background: loading ? '#ccc' : '#b8956e',
                                border: 'none',
                                borderRadius: '0 16px 0 16px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                        >
                            {loading ? 'Enviando...' : 'Confirmar Presença'}
                        </button>

                        {/* Botão voltar para trocar código */}
                        <button
                            onClick={() => {
                                setConvidado(null);
                                setCodigo('');
                                setAcompanhantes([]);
                                setErro('');
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginTop: '0.75rem',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.8rem',
                                color: '#999',
                                background: 'transparent',
                                border: '1px solid #e0e0e0',
                                borderRadius: '0 12px 0 12px',
                                cursor: 'pointer'
                            }}
                        >
                            Usar outro código
                        </button>
                    </>
                )}

                {/* Info */}
                <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.7rem',
                    color: '#999',
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    lineHeight: 1.5
                }}>
                    O código está no seu convite. Em caso de dúvida, entre em contato com os noivos.
                </p>
            </div>
        </main>
    );
}
