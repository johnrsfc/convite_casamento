import Image from 'next/image';
import IconButton from './components/IconButton';
import { GlobeIcon, BookIcon, MapPinIcon, GiftIcon, CheckCircleIcon } from './components/Icons';

export default function Home() {
  return (
    <main className="convite-container">
      {/* Foto do casal com gradiente embutido */}
      <div className="hero-image-container">
        <Image
          src="/Img01.png"
          alt="Larissa e Jonathan"
          width={430}
          height={573}
          className="hero-image"
          priority
          style={{ width: '100%', height: 'auto', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Gradiente branco na parte inferior */}
        <div className="hero-gradient" />
      </div>

      {/* Iniciais - ABAIXO da foto */}
      <div style={{
        textAlign: 'center',
        padding: '0.5rem 1rem 1rem',
        background: 'white'
      }}>
        <div className="iniciais">
          L <span className="iniciais-divider">|</span> J
        </div>
      </div>

      {/* Conteúdo principal */}
      <section style={{
        textAlign: 'center',
        padding: '1rem 1.5rem 1rem',
        background: 'white',
        flex: 1
      }}>
        {/* Citação */}
        <p className="citacao">
          &quot;Como o Senhor uniu nossas almas, vamos unir nossas vidas em sagrado matrimônio.
          Convidamos você a testemunhar e celebrar conosco essa bênção&quot;
        </p>

        {/* Subtítulo */}
        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          letterSpacing: '0.2rem',
          textTransform: 'uppercase',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600
        }}>
          COM A BENÇÃO DE DEUS
        </p>

        {/* Nomes dos noivos */}
        <h1 className="nomes-noivos" style={{ margin: '2rem' }}>
          Larissa & Jonathan
        </h1>

        {/* Convite para casamento */}
        <p style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15rem',
          textTransform: 'uppercase',
          fontFamily: 'Poppins, sans-serif',
          marginTop: '0.25rem',
          fontWeight: 300,
          color: '#6b6b6b'
        }}>
          CONVIDAM PARA O SEU CASAMENTO
        </p>

        {/* Data */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span className="data-casamento">SÁBADO</span>
          <span style={{
            width: '1px',
            height: '20px',
            background: '#b8956e'
          }} />
          <span className="data-casamento">18.ABRIL.2026</span>
        </div>

        {/* Horário e Local */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            fontFamily: 'Poppins, sans-serif'
          }}>
            18:30 HORAS
          </p>
          <p style={{
            fontSize: '0.8rem',
            color: '#000',
            marginTop: '0.25rem',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Mansão O Casarão
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#000',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Av. Renata, 258 - Vila Formosa
          </p>
        </div>
      </section>

      {/* Navegação com ícones */}
      <nav className="nav-icons" style={{ background: 'white' }}>
        <IconButton
          href="/manual"
          icon={<BookIcon />}
          label="Manual dos Convidados"
        />
        <IconButton
          href="/localizacao"
          icon={<MapPinIcon />}
          label="Localização do Evento"
        />
        <IconButton
          href="/presentes"
          icon={<GiftIcon />}
          label="Sugestões de Presente"
        />
        <IconButton
          href="/confirma"
          icon={<CheckCircleIcon />}
          label="Confirma Presença"
        />
      </nav>

      {/* Texto de navegação */}
      <div className="footer-note-container">
        <span className="footer-note">★ UTILIZE OS BOTÕES ACIMA PARA NAVEGAR</span>
      </div>

      {/* Imagem final */}
      <footer className="footer-section">
        <div className="footer-gradient-top" />
        <Image
          src="/img02.png"
          alt="Larissa e Jonathan"
          width={430}
          height={400}
          className="footer-bg-image"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </footer>
    </main>
  );
}
