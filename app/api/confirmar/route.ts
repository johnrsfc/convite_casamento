import { NextRequest, NextResponse } from 'next/server';

// URL do Google Apps Script para salvar confirmações
// O usuário deve criar um Apps Script e substituir esta URL
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

interface Acompanhante {
  nome: string;
  idade: string;
  confirmado: boolean;
}

interface ConfirmacaoRequest {
  convidadoPrincipal: string;
  acompanhantes: Acompanhante[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmacaoRequest = await request.json();
    
    const { convidadoPrincipal, acompanhantes } = body;
    
    if (!convidadoPrincipal) {
      return NextResponse.json(
        { error: 'Nome do convidado é obrigatório' },
        { status: 400 }
      );
    }

    // Se tiver URL do Apps Script, envia para lá
    if (APPS_SCRIPT_URL) {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          convidadoPrincipal,
          acompanhantes,
          dataConfirmacao: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar no Google Sheets');
      }
    } else {
      // Modo desenvolvimento - apenas loga
      console.log('=== CONFIRMAÇÃO DE PRESENÇA ===');
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
