import Image from 'next/image';
import Link from 'next/link';

// Lista de presentes com imagens, títulos e valores
const presentes = [
    { id: 1, nome: 'Massagem relaxante para o noivo depois de ver a conta do casamento', valor: 250, img: '/presentes/01.jpg' },
    { id: 2, nome: 'Só pra não dizer que não demos nada', valor: 90, img: '/presentes/02.webp' },
    { id: 3, nome: 'Lixa para o cancanhar do Jhow', valor: 50, img: '/presentes/03.webp' },
    { id: 4, nome: 'Toma aqui seus 50 reais', valor: 50, img: '/presentes/04.webp' },
    { id: 5, nome: 'Jogar o boquê na sua direção', valor: 121.84, img: '/presentes/05.jpg' },
    { id: 6, nome: 'Coberto para a noiva estar sempre coberta de razão', valor: 145, img: '/presentes/06.jpg' },
    { id: 7, nome: 'Dar pitaco/falar mal da festa', valor: 137, img: '/presentes/dapitaco.jpg' },
    { id: 8, nome: 'Dose de paciência para a noiva', valor: 100, img: '/presentes/07.jpeg' },
    { id: 9, nome: 'Cueca sexi para noite de núpcias', valor: 120, img: '/presentes/08.jpg' },
    { id: 10, nome: 'Toma aí meu bolsa familia', valor: 137, img: '/presentes/09.jpg' },
    { id: 11, nome: 'Taxa para o boquê não cair na sua namorada', valor: 157, img: '/presentes/10.webp' },
    { id: 12, nome: 'Ajude a pagar a lua de mel do casal', valor: 200, img: '/presentes/11.jpg' },
    { id: 13, nome: 'Langerie para a noiva usar na lua de mel', valor: 180, img: '/presentes/12.jpg' },
    { id: 14, nome: 'Claro que posso pagar esse presente meu marido tem dois empregos', valor: 297, img: '/presentes/13.jpeg' },
    { id: 15, nome: 'Passeio tranqui de lancha', valor: 350, img: '/presentes/14.webp' },
];

function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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
                            className="presente-card"
                        >
                            <div className="presente-img-container">
                                <Image
                                    src={presente.img}
                                    alt={presente.nome}
                                    width={200}
                                    height={150}
                                    className="presente-img"
                                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="presente-info">
                                <h3 className="presente-nome">{presente.nome}</h3>
                                <p className="presente-valor">
                                    R$ {formatarValor(presente.valor)}
                                </p>
                            </div>
                            <Link
                                href={`/presentes/checkout?id=${presente.id}&valor=${presente.valor}&nome=${encodeURIComponent(presente.nome)}`}
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
