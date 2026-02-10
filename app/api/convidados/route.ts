import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

// Mock para desenvolvimento
const MOCK_CONVIDADOS = [
  { codigo: 'ABC123', nome: 'João Silva', maxAcompanhantes: 2, acompanhantes: ['Maria Silva', 'Pedro Silva'], jaConfirmou: false },
  { codigo: 'DEF456', nome: 'Ana Santos', maxAcompanhantes: 1, acompanhantes: [], jaConfirmou: false },
  { codigo: 'GHI789', nome: 'Carlos Oliveira', maxAcompanhantes: 3, acompanhantes: ['Lucia Oliveira'], jaConfirmou: false },
  { codigo: 'JKL012', nome: 'Fernanda Costa', maxAcompanhantes: 0, acompanhantes: [], jaConfirmou: false },
];

// Busca convidado pelo código via Google Apps Script (tempo real, sem cache)
async function buscarConvidadoPorCodigo(codigo: string) {
  if (!APPS_SCRIPT_URL) {
    // Modo dev: usa mock
    return MOCK_CONVIDADOS.find(c => c.codigo.toUpperCase() === codigo.toUpperCase()) || null;
  }

  const url = `${APPS_SCRIPT_URL}?action=buscarCodigo&codigo=${encodeURIComponent(codigo)}`;
  console.log('Buscando convidado via Apps Script:', url);

  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();

  console.log('Resposta Apps Script:', JSON.stringify(data));

  if (data.error || !data.nome) {
    return null;
  }

  return {
    codigo: data.codigo || codigo,
    nome: data.nome,
    maxAcompanhantes: data.maxAcompanhantes || 0,
    acompanhantes: data.acompanhantes || [],
    jaConfirmou: data.jaConfirmou || false
  };
}

// POST - Validar código e retornar dados do convidado
export async function POST(request: NextRequest) {
  try {
    const { codigo } = await request.json();

    if (!codigo || typeof codigo !== 'string') {
      return NextResponse.json(
        { error: 'Código é obrigatório' },
        { status: 400 }
      );
    }

    const codigoLimpo = codigo.trim().toUpperCase();
    const convidado = await buscarConvidadoPorCodigo(codigoLimpo);

    if (!convidado) {
      return NextResponse.json(
        { error: 'Código não encontrado. Verifique seu convite.' },
        { status: 404 }
      );
    }

    if (convidado.jaConfirmou) {
      return NextResponse.json(
        { error: 'Este convite já foi confirmado.' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      nome: convidado.nome,
      maxAcompanhantes: convidado.maxAcompanhantes,
      acompanhantes: convidado.acompanhantes
    });

  } catch (error) {
    console.error('Erro ao validar código:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
