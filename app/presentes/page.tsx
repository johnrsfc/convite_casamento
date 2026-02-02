import Image from 'next/image';
import Link from 'next/link';

// Lista de presentes com valores sugeridos
const presentes = [
    { id: 0, nome: 'O que seu bolso tiver 😄', valor: 0, especial: true },
    { id: 1, nome: 'Jantar Romântico', valor: 200 },
    { id: 2, nome: 'Cesta de Café da Manhã', valor: 150 },
    { id: 3, nome: 'Dia no Spa', valor: 300 },
    { id: 4, nome: 'Kit Churrasco', valor: 250 },
    { id: 5, nome: 'Lua de Mel', valor: 500 },
    { id: 6, nome: 'Utensílios de Cozinha', valor: 180 },
];

export default function PresentesPage() {
    return (
        <main className="presentes-page">
            {/* Imagem de fundo fixa */}
            <div className="presentes-bg">
                <Image
                    src="/bgpPagePresente.png"
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    priority
                />
            </div>

            {/* Conteúdo */}
            <div className="presentes-content">
                {/* Header */}
                <header className="presentes-header">
                    <h1 className="presentes-title">Larissa &amp;<br />Jonathan</h1>
                    <div className="presentes-date">18.04.2026</div>
                    <p className="presentes-local">Mansão O Casarão</p>
                </header>

                {/* Texto explicativo */}
                <section className="presentes-intro">
                    <p>
                        Escolha na lista um item do valor que seu coração ditar.
                        Os produtos são simbólicos; receberemos o valor correspondente
                        para realizar nossos sonhos. Agradecemos desde já!
                    </p>
                </section>

                {/* Grid de presentes */}
                <section className="presentes-grid">
                    {presentes.map((presente) => (
                        <div
                            key={presente.id}
                            className={`presente-card ${presente.especial ? 'presente-card-especial' : ''}`}
                        >
                            <div className="presente-info">
                                <h3 className="presente-nome">{presente.nome}</h3>
                                <p className="presente-valor">
                                    {presente.especial ? 'R$ Você escolhe!' : `R$ ${presente.valor},00`}
                                </p>
                                <span className="presente-hint">
                                    * valor pode ser ajustado
                                </span>
                            </div>
                            <Link
                                href={`/presentes/checkout?id=${presente.id}&valor=${presente.especial ? 100 : presente.valor}&nome=${encodeURIComponent(presente.nome)}`}
                                className="presente-btn"
                            >
                                PRESENTEAR
                            </Link>
                        </div>
                    ))}
                </section>

                {/* Botão voltar */}
                <div className="presentes-footer">
                    <Link href="/" className="presentes-back">
                        ← Voltar ao Convite
                    </Link>
                </div>
            </div>
        </main>
    );
}
