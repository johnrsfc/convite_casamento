'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Convidado {
    nome: string;
    maxAcompanhantes: number;
    acompanhantes?: string[];
    jaConfirmou?: boolean;
}

interface Acompanhante {
    nome: string;
    idade: string;
    confirmado: boolean;
}

export default function ConfirmaPresencaPage() {
    const [busca, setBusca] = useState('');
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [convidadoSelecionado, setConvidadoSelecionado] = useState<Convidado | null>(null);
    const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([]);
    const [confirmacaoEnviada, setConfirmacaoEnviada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingConvidados, setLoadingConvidados] = useState(true);
    const [showSugestoes, setShowSugestoes] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Carregar lista de convidados do Google Sheets
    useEffect(() => {
        async function carregarConvidados() {
            try {
                const response = await fetch('/api/convidados');
                if (response.ok) {
                    const data = await response.json();
                    setConvidados(data);
                }
            } catch (error) {
                console.error('Erro ao carregar convidados:', error);
            } finally {
                setLoadingConvidados(false);
            }
        }
        carregarConvidados();
    }, []);

    // Filtrar sugestões
    const sugestoes = busca.length >= 2
        ? convidados.filter(c =>
            c.nome.toLowerCase().includes(busca.toLowerCase()) && !c.jaConfirmou
        )
        : [];

    // Selecionar convidado
    const selecionarConvidado = (convidado: Convidado) => {
        setConvidadoSelecionado(convidado);
        setBusca(convidado.nome);
        setShowSugestoes(false);

        // Preparar acompanhantes
        const novoAcompanhantes: Acompanhante[] = [];
        if (convidado.acompanhantes && convidado.acompanhantes.length > 0) {
            convidado.acompanhantes.forEach(nome => {
                novoAcompanhantes.push({ nome, idade: '', confirmado: false });
            });
        } else {
            for (let i = 0; i < convidado.maxAcompanhantes; i++) {
                novoAcompanhantes.push({ nome: '', idade: '', confirmado: false });
            }
        }
        setAcompanhantes(novoAcompanhantes);
    };

    // Atualizar acompanhante
    const atualizarAcompanhante = (index: number, campo: keyof Acompanhante, valor: string | boolean) => {
        const novos = [...acompanhantes];
        novos[index] = { ...novos[index], [campo]: valor };
        setAcompanhantes(novos);
    };

    // Enviar confirmação
    const enviarConfirmacao = async () => {
        if (!convidadoSelecionado) return;

        setLoading(true);
        try {
            const response = await fetch('/api/confirmar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    convidadoPrincipal: convidadoSelecionado.nome,
                    acompanhantes: acompanhantes.filter(a => a.confirmado)
                })
            });

            if (response.ok) {
                setConfirmacaoEnviada(true);
            }
        } catch (error) {
            console.error('Erro ao confirmar:', error);
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

                {/* Campo de busca */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <label style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.75rem',
                        color: '#666',
                        display: 'block',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>Busque seu nome</label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setShowSugestoes(true);
                            if (convidadoSelecionado) setConvidadoSelecionado(null);
                        }}
                        onFocus={() => setShowSugestoes(true)}
                        placeholder={loadingConvidados ? "Carregando..." : "Digite seu nome..."}
                        disabled={loadingConvidados}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '0 12px 0 12px',
                            outline: 'none',
                            background: '#fafafa'
                        }}
                    />

                    {/* Sugestões */}
                    {showSugestoes && sugestoes.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '0 0 12px 12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {sugestoes.map((c, i) => (
                                <button
                                    key={i}
                                    onClick={() => selecionarConvidado(c)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        textAlign: 'left',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '0.9rem',
                                        color: '#333',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: i < sugestoes.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {c.nome}
                                    {c.maxAcompanhantes > 0 && (
                                        <span style={{ color: '#999', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                            (+{c.maxAcompanhantes} acompanhante{c.maxAcompanhantes > 1 ? 's' : ''})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Acompanhantes */}
                {convidadoSelecionado && acompanhantes.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.75rem',
                            color: '#666',
                            display: 'block',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>Acompanhantes (selecione quem vai)</label>

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

                {/* Botão Confirmar */}
                {convidadoSelecionado && (
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
                    Caso não encontre seu nome, entre em contato com os noivos.
                </p>
            </div>
        </main>
    );
}
