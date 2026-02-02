import { NextResponse } from 'next/server';

// Configura a URL da planilha Google Sheets (publicada como CSV)
// O usuário deve substituir esta URL pela sua planilha real
const SHEETS_URL = process.env.GOOGLE_SHEETS_URL || '';

// Lista de convidados mockada para desenvolvimento
// Remova quando integrar com Google Sheets real
const MOCK_CONVIDADOS = [
  { nome: 'João Silva', maxAcompanhantes: 2, acompanhantes: ['Maria Silva', 'Pedro Silva'] },
  { nome: 'Ana Santos', maxAcompanhantes: 1, acompanhantes: [] },
  { nome: 'Carlos Oliveira', maxAcompanhantes: 3, acompanhantes: ['Lucia Oliveira'] },
  { nome: 'Fernanda Costa', maxAcompanhantes: 0, acompanhantes: [] },
  { nome: 'Roberto Lima', maxAcompanhantes: 2, acompanhantes: [] },
  { nome: 'Patricia Ferreira', maxAcompanhantes: 1, acompanhantes: ['Bruno Ferreira'] },
  { nome: 'Marcos Souza', maxAcompanhantes: 4, acompanhantes: [] },
  { nome: 'Juliana Almeida', maxAcompanhantes: 1, acompanhantes: [] },
];

export async function GET() {
  try {
    // Se tiver URL do Google Sheets configurada, busca de lá
    if (SHEETS_URL) {
      const response = await fetch(SHEETS_URL);
      const csv = await response.text();
      
      // Parse CSV simples
      const linhas = csv.split('\n').slice(1); // Remove header
      const convidados = linhas.map(linha => {
        const cols = linha.split(',');
        return {
          nome: cols[0]?.trim() || '',
          maxAcompanhantes: parseInt(cols[1]) || 0,
          acompanhantes: cols[2] ? cols[2].split(';').map(a => a.trim()) : [],
          jaConfirmou: cols[3]?.toLowerCase() === 'sim'
        };
      }).filter(c => c.nome);
      
      return NextResponse.json(convidados);
    }
    
    // Retorna dados mockados para desenvolvimento
    return NextResponse.json(MOCK_CONVIDADOS);
    
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    return NextResponse.json([], { status: 500 });
  }
}
