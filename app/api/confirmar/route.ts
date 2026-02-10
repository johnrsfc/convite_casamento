import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

interface Acompanhante {
  nome: string;
  idade: string;
  confirmado: boolean;
}

interface ConfirmacaoRequest {
  codigo: string;
  convidadoPrincipal: string;
  acompanhantes: Acompanhante[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmacaoRequest = await request.json();

    const { codigo, convidadoPrincipal, acompanhantes } = body;

    if (!codigo || !convidadoPrincipal) {
      return NextResponse.json(
        { error: 'Código e nome do convidado são obrigatórios' },
        { status: 400 }
      );
    }

    if (APPS_SCRIPT_URL) {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo,
          convidadoPrincipal,
          acompanhantes,
          dataConfirmacao: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no Google Sheets');
      }
    } else {
      console.log('=== CONFIRMAÇÃO DE PRESENÇA ===');
      console.log('Código:', codigo);
      console.log('Convidado Principal:', convidadoPrincipal);
      console.log('Acompanhantes:', acompanhantes);
      console.log('Data:', new Date().toLocaleString('pt-BR'));
      console.log('================================');
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmação registrada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    return NextResponse.json(
      { error: 'Erro ao processar confirmação' },
      { status: 500 }
    );
  }
}
