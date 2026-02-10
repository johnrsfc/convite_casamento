'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

// Lista de presentes (mesma da página principal)
const presentes: Record<number, { nome: string; valor: number }> = {
    1: { nome: 'Massagem relaxante para o noivo depois de ver a conta do casamento', valor: 250 },
    2: { nome: 'Só pra não dizer que não demos nada', valor: 90 },
    3: { nome: 'Lixa para o cancanhar do Jhow', valor: 50 },
    4: { nome: 'Toma aqui seus 50 reais', valor: 50 },
    5: { nome: 'Jogar o boquê na sua direção', valor: 121.84 },
    6: { nome: 'Coberto para a noiva estar sempre coberta de razão', valor: 145 },
    7: { nome: 'Dar pitaco/falar mal da festa', valor: 137 },
    8: { nome: 'Dose de paciência para a noiva', valor: 100 },
    9: { nome: 'Cueca sexi para noite de núpcias', valor: 120 },
    10: { nome: 'Toma aí meu bolsa familia', valor: 137 },
    11: { nome: 'Taxa para o boquê não cair na sua namorada', valor: 157 },
    12: { nome: 'Ajude a pagar a lua de mel do casal', valor: 200 },
    13: { nome: 'Langerie para a noiva usar na lua de mel', valor: 180 },
    14: { nome: 'Claro que posso pagar esse presente meu marido tem dois empregos', valor: 297 },
    15: { nome: 'Passeio tranqui de lancha', valor: 350 },
};

interface PixData {
    qrCode: string;
    qrCodeText: string;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const valorParam = searchParams.get('valor');
    const nomeParam = searchParams.get('nome');

    const presenteFromList = id ? presentes[parseInt(id)] : null;
    const presente = presenteFromList || { nome: nomeParam || 'Presente', valor: parseInt(valorParam || '100') };
    const valorSugerido = valorParam || presente.valor.toString();

    const [valorCustom, setValorCustom] = useState(valorSugerido);
    const [formaPagamento, setFormaPagamento] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState<'selecao' | 'dados' | 'pix' | 'sucesso'>('selecao');
    const [pixData, setPixData] = useState<PixData | null>(null);
    const [copiado, setCopiado] = useState(false);

    // Dados do pagador
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');

    // Dados do cartão
    const [cartaoNumero, setCartaoNumero] = useState('');
    const [cartaoNome, setCartaoNome] = useState('');
    const [cartaoValidade, setCartaoValidade] = useState('');
    const [cartaoCvv, setCartaoCvv] = useState('');

    const [erro, setErro] = useState('');

    const formatarCPF = (valor: string) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
    };

    const formatarCartao = (valor: string) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4').slice(0, 19);
    };

    const formatarValidade = (valor: string) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length >= 2) {
            return numeros.slice(0, 2) + '/' + numeros.slice(2, 4);
        }
        return numeros;
    };

    const handleContinuar = () => {
        if (parseInt(valorCustom) < 10) {
            setErro('Valor mínimo é R$ 10');
            return;
        }
        setErro('');
        setEtapa('dados');
    };

    const handlePagar = async () => {
        if (!nome || !email || !cpf) {
            setErro('Preencha todos os campos');
            return;
        }

        if (formaPagamento === 'CREDIT_CARD' && (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCvv)) {
            setErro('Preencha todos os dados do cartão');
            return;
        }

        setErro('');
        setLoading(true);

        try {
            const response = await fetch('/api/pagamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    presenteNome: presente.nome,
                    presenteValor: parseFloat(valorCustom),
                    pagadorNome: nome,
                    pagadorEmail: email,
                    pagadorCpf: cpf,
                    formaPagamento,
                    ...(formaPagamento === 'CREDIT_CARD' && {
                        cartao: {
                            numero: cartaoNumero,
                            nome: cartaoNome,
                            validade: cartaoValidade,
                            cvv: cartaoCvv
                        }
                    })
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.error || 'Erro ao processar pagamento');
                setLoading(false);
                return;
            }

            if (formaPagamento === 'PIX' && data.pix) {
                setPixData(data.pix);
                setEtapa('pix');
            } else if (formaPagamento === 'CREDIT_CARD') {
                setEtapa('sucesso');
            }
        } catch (error) {
            setErro('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const copiarPix = () => {
        if (pixData?.qrCodeText) {
            navigator.clipboard.writeText(pixData.qrCodeText);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 3000);
        }
    };

    // Estilos comuns
    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '0 8px 0 8px',
        outline: 'none',
        background: '#fafafa'
    };

    const labelStyle = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.7rem',
        color: '#666',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
        display: 'block'
    };

    // Tela de sucesso
    if (etapa === 'sucesso') {
        return (
            <main style={{ minHeight: '100vh', background: '#fff', padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '360px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#b8956e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', color: '#fff' }}>✓</div>
                    <h1 style={{ fontFamily: 'Great Vibes, cursive', fontSize: '2.5rem', color: '#2c2c2c', marginBottom: '1rem' }}>Obrigado!</h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Seu presente foi registrado com sucesso! Larissa & Jonathan agradecem muito por fazer parte deste momento especial.
                    </p>
                    <Link href="/" style={{ display: 'inline-block', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666', textDecoration: 'none', padding: '0.75rem 2rem', border: '1px solid #ddd', borderRadius: '0 12px 0 12px' }}>
                        ← Voltar ao Convite
                    </Link>
                </div>
            </main>
        );
    }

    // Tela do PIX
    if (etapa === 'pix' && pixData) {
        return (
            <main style={{ minHeight: '100vh', background: '#fff', padding: '1.5rem' }}>
                <div style={{ maxWidth: '430px', margin: '0 auto' }}>
                    <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontFamily: 'Great Vibes, cursive', fontSize: '2rem', color: '#2c2c2c' }}>Pagamento PIX</h1>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#999' }}>Escaneie o QR Code ou copie o código</p>
                    </header>

                    <div style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '0 16px 0 16px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#b8956e', marginBottom: '1rem' }}>
                            R$ {valorCustom},00
                        </p>

                        {pixData.qrCode && (
                            <img
                                src={`data:image/png;base64,${pixData.qrCode}`}
                                alt="QR Code PIX"
                                style={{ width: '200px', height: '200px', margin: '0 auto 1rem', borderRadius: '8px' }}
                            />
                        )}

                        <button
                            onClick={copiarPix}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#fff',
                                background: copiado ? '#4CAF50' : '#b8956e',
                                border: 'none',
                                borderRadius: '0 12px 0 12px',
                                cursor: 'pointer',
                                marginBottom: '1rem'
                            }}
                        >
                            {copiado ? '✓ Código copiado!' : 'Copiar código PIX'}
                        </button>

                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#999', lineHeight: 1.5 }}>
                            Após o pagamento, o sistema será notificado automaticamente.
                        </p>
                    </div>

                    <button onClick={() => setEtapa('sucesso')} style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666', background: 'transparent', border: '1px solid #ddd', borderRadius: '0 12px 0 12px', cursor: 'pointer' }}>
                        Já fiz o pagamento
                    </button>
                </div>
            </main>
        );
    }

    // Tela de dados
    if (etapa === 'dados') {
        return (
            <main style={{ minHeight: '100vh', background: '#fff', padding: '1.5rem' }}>
                <div style={{ maxWidth: '430px', margin: '0 auto' }}>
                    <header style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                        <button onClick={() => setEtapa('selecao')} style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
                        <h1 style={{ fontFamily: 'Great Vibes, cursive', fontSize: '2rem', color: '#2c2c2c' }}>Seus Dados</h1>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: '#27ae60', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            Seus dados estão protegidos
                        </p>
                    </header>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Seu nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>CPF</label>
                        <input type="text" value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))} placeholder="000.000.000-00" style={inputStyle} maxLength={14} />
                    </div>

                    {/* Forma de pagamento */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Forma de pagamento</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setFormaPagamento('PIX')} style={{ flex: 1, padding: '1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: formaPagamento === 'PIX' ? '#fff' : '#333', background: formaPagamento === 'PIX' ? '#b8956e' : '#f5f5f5', border: 'none', borderRadius: '0 8px 0 8px', cursor: 'pointer' }}>
                                PIX
                            </button>
                            <button onClick={() => setFormaPagamento('CREDIT_CARD')} style={{ flex: 1, padding: '1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: formaPagamento === 'CREDIT_CARD' ? '#fff' : '#333', background: formaPagamento === 'CREDIT_CARD' ? '#b8956e' : '#f5f5f5', border: 'none', borderRadius: '0 8px 0 8px', cursor: 'pointer' }}>
                                Cartão
                            </button>
                        </div>
                    </div>

                    {/* Dados do cartão */}
                    {formaPagamento === 'CREDIT_CARD' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Número do cartão</label>
                                <input type="text" value={cartaoNumero} onChange={(e) => setCartaoNumero(formatarCartao(e.target.value))} placeholder="0000 0000 0000 0000" style={inputStyle} maxLength={19} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Nome no cartão</label>
                                <input type="text" value={cartaoNome} onChange={(e) => setCartaoNome(e.target.value.toUpperCase())} placeholder="NOME COMO ESTÁ NO CARTÃO" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Validade</label>
                                    <input type="text" value={cartaoValidade} onChange={(e) => setCartaoValidade(formatarValidade(e.target.value))} placeholder="MM/AA" style={inputStyle} maxLength={5} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>CVV</label>
                                    <input type="text" value={cartaoCvv} onChange={(e) => setCartaoCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" style={inputStyle} maxLength={4} />
                                </div>
                            </div>
                        </div>
                    )}

                    {erro && <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#e74c3c', marginBottom: '1rem', textAlign: 'center' }}>{erro}</p>}

                    <button onClick={handlePagar} disabled={loading} style={{ width: '100%', padding: '1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#fff', background: loading ? '#ccc' : '#b8956e', border: 'none', borderRadius: '0 12px 0 12px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {loading ? 'Processando...' : `Pagar R$ ${valorCustom},00`}
                    </button>

                    {/* Selo de segurança */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: '#666' }}>
                            Pagamento seguro via <strong style={{ color: '#27ae60' }}>Asaas</strong>
                        </span>
                    </div>
                </div>
            </main >
        );
    }

    // Tela inicial de seleção de valor
    return (
        <main style={{ minHeight: '100vh', background: '#fff', padding: '1.5rem' }}>
            <div style={{ maxWidth: '430px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                    <Link href="/presentes" style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666', textDecoration: 'none' }}>← Voltar</Link>
                    <h1 style={{ fontFamily: 'Great Vibes, cursive', fontSize: '2.2rem', color: '#2c2c2c', marginBottom: '0.5rem' }}>Presentear</h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666' }}>{presente.nome}</p>
                </header>

                <div style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '0 16px 0 16px', marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Valor sugerido: R$ {valorSugerido},00</label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                        {['50', '100', '150', '200', '300', '500'].map((valor) => (
                            <button
                                key={valor}
                                onClick={() => setValorCustom(valor)}
                                style={{
                                    padding: '0.75rem',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: valorCustom === valor ? '#fff' : '#333',
                                    background: valorCustom === valor ? '#b8956e' : '#fff',
                                    border: valorCustom === valor ? 'none' : '1px solid #ddd',
                                    borderRadius: '0 8px 0 8px',
                                    cursor: 'pointer'
                                }}
                            >
                                R$ {valor}
                            </button>
                        ))}
                    </div>

                    <label style={labelStyle}>Ou digite outro valor:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#666' }}>R$</span>
                        <input
                            type="number"
                            value={valorCustom}
                            onChange={(e) => setValorCustom(e.target.value)}
                            min="10"
                            style={{ ...inputStyle, flex: 1 }}
                        />
                    </div>
                </div>

                {erro && <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#e74c3c', marginBottom: '1rem', textAlign: 'center' }}>{erro}</p>}

                <button onClick={handleContinuar} style={{ width: '100%', padding: '1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#fff', background: '#b8956e', border: 'none', borderRadius: '0 12px 0 12px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Continuar
                </button>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Carregando...</p></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
