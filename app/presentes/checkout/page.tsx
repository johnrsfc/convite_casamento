'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

// Lista de presentes (mesma da página principal)
const presentes: Record<number, string> = {
    1: 'Jantar Romântico',
    2: 'Cesta de Café da Manhã',
    3: 'Dia no Spa',
    4: 'Kit Churrasco',
    5: 'Lua de Mel',
    6: 'Utensílios de Cozinha',
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const valorSugerido = searchParams.get('valor');

    const [valorCustom, setValorCustom] = useState(valorSugerido || '100');
    const [loading, setLoading] = useState(false);

    const presenteNome = id ? presentes[parseInt(id)] : 'Presente';

    const handlePresentear = () => {
        setLoading(true);

        // TODO: Integrar com API do PagSeguro
        // Por enquanto, redireciona para o link de pagamento do PagSeguro
        // Você pode criar um link de pagamento no painel do PagSeguro e colocar aqui

        // Exemplo de URL do PagSeguro (substituir pela sua):
        const pagSeguroUrl = `https://pagseguro.uol.com.br/checkout/v2/payment.html`;

        // Simula redirecionamento (substituir por integração real)
        setTimeout(() => {
            alert(`Redirecionando para pagamento de R$ ${valorCustom},00\n\nPara integrar com PagSeguro:\n1. Crie uma conta no PagSeguro\n2. Gere um link de pagamento\n3. Substitua a URL no código`);
            setLoading(false);
        }, 1000);
    };

    return (
        <main className="checkout-page">
            <div className="checkout-container">
                {/* Header */}
                <header className="checkout-header">
                    <Link href="/presentes" className="checkout-back">
                        ← Voltar
                    </Link>
                    <h1 className="checkout-title">Presentear</h1>
                </header>

                {/* Card do presente */}
                <div className="checkout-card">
                    <h2 className="checkout-presente-nome">{presenteNome}</h2>
                    <p className="checkout-label">Valor sugerido: R$ {valorSugerido},00</p>

                    {/* Seleção de valor */}
                    <div className="checkout-valor-section">
                        <label className="checkout-label">Escolha o valor que deseja presentear:</label>
                        <div className="checkout-valor-options">
                            {['50', '100', '150', '200', '300', '500'].map((valor) => (
                                <button
                                    key={valor}
                                    className={`checkout-valor-btn ${valorCustom === valor ? 'active' : ''}`}
                                    onClick={() => setValorCustom(valor)}
                                >
                                    R$ {valor}
                                </button>
                            ))}
                        </div>

                        {/* Valor personalizado */}
                        <div className="checkout-custom-valor">
                            <label className="checkout-label">Ou digite outro valor:</label>
                            <div className="checkout-input-wrapper">
                                <span>R$</span>
                                <input
                                    type="number"
                                    value={valorCustom}
                                    onChange={(e) => setValorCustom(e.target.value)}
                                    min="10"
                                    className="checkout-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botão de pagamento */}
                    <button
                        className="checkout-submit"
                        onClick={handlePresentear}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : `PRESENTEAR R$ ${valorCustom},00`}
                    </button>

                    <p className="checkout-info">
                        Você será redirecionado para o PagSeguro para finalizar o pagamento de forma segura.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="checkout-page"><p>Carregando...</p></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
