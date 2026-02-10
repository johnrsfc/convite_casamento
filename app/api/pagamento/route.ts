import { NextRequest, NextResponse } from 'next/server';

// Configuração via variáveis de ambiente (.env.local)
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox';
const ASAAS_BASE_URL = ASAAS_ENVIRONMENT === 'production' 
  ? 'https://api.asaas.com/v3'
  : 'https://api-sandbox.asaas.com/v3';

interface CreatePaymentRequest {
  presenteNome: string;
  presenteValor: number;
  pagadorNome: string;
  pagadorEmail: string;
  pagadorCpf: string;
  formaPagamento: 'PIX' | 'CREDIT_CARD';
  // Dados do cartão (opcional, só para cartão)
  cartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

// Criar ou buscar cliente no Asaas
async function getOrCreateCustomer(nome: string, email: string, cpf: string) {
  console.log('=== ASAAS DEBUG ===');
  console.log('Environment:', ASAAS_ENVIRONMENT);
  console.log('Base URL:', ASAAS_BASE_URL);
  console.log('API Key prefix:', ASAAS_API_KEY.substring(0, 20));
  console.log('API Key length:', ASAAS_API_KEY.length);
  console.log('CPF:', cpf.replace(/\D/g, ''));
  
  // Primeiro tenta buscar cliente existente
  const searchResponse = await fetch(`${ASAAS_BASE_URL}/customers?cpfCnpj=${cpf.replace(/\D/g, '')}`, {
    headers: {
      'accept': 'application/json',
      'access_token': ASAAS_API_KEY
    }
  });
  
  const searchData = await searchResponse.json();
  console.log('Busca cliente:', JSON.stringify(searchData));
  
  if (searchData.data && searchData.data.length > 0) {
    console.log('Cliente encontrado:', searchData.data[0].id);
    return searchData.data[0].id;
  }
  
  // Se não existe, cria novo cliente
  const createBody = {
    name: nome,
    email: email,
    cpfCnpj: cpf.replace(/\D/g, '')
  };
  console.log('Criando cliente:', JSON.stringify(createBody));
  
  const createResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': ASAAS_API_KEY
    },
    body: JSON.stringify(createBody)
  });
  
  const createData = await createResponse.json();
  console.log('Resposta criação:', JSON.stringify(createData));
  
  if (createData.errors) {
    console.error('Erros Asaas:', createData.errors);
    return null;
  }
  
  return createData.id;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json();
    
    const { presenteNome, presenteValor, pagadorNome, pagadorEmail, pagadorCpf, formaPagamento, cartao } = body;

    if (!pagadorNome || !pagadorEmail || !pagadorCpf) {
      return NextResponse.json(
        { error: 'Dados do pagador são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar ou buscar cliente
    const customerId = await getOrCreateCustomer(pagadorNome, pagadorEmail, pagadorCpf);

    if (!customerId) {
      return NextResponse.json(
        { error: 'Erro ao criar cliente no Asaas' },
        { status: 500 }
      );
    }

    // Criar cobrança
    // Remover emojis e caracteres especiais da descrição
    const descricaoLimpa = presenteNome.replace(/[^\w\sÀ-ÿ]/gi, '').trim();
    const paymentData: Record<string, unknown> = {
      customer: customerId,
      billingType: formaPagamento,
      value: presenteValor,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Presente de Casamento: ${descricaoLimpa || 'Presente'}`,
      externalReference: `presente_${Date.now()}`
    };

    const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('Erro Asaas:', paymentResult);
      return NextResponse.json(
        { error: paymentResult.errors?.[0]?.description || 'Erro ao criar cobrança' },
        { status: 500 }
      );
    }

    // Se for PIX, busca o QR Code
    if (formaPagamento === 'PIX') {
      const pixResponse = await fetch(`${ASAAS_BASE_URL}/payments/${paymentResult.id}/pixQrCode`, {
        headers: {
          'accept': 'application/json',
          'access_token': ASAAS_API_KEY
        }
      });

      const pixData = await pixResponse.json();

      return NextResponse.json({
        success: true,
        paymentId: paymentResult.id,
        status: paymentResult.status,
        formaPagamento: 'PIX',
        pix: {
          qrCode: pixData.encodedImage,
          qrCodeText: pixData.payload,
          expirationDate: pixData.expirationDate
        }
      });
    }

    // Se for cartão, processa o pagamento
    if (formaPagamento === 'CREDIT_CARD' && cartao) {
      const [mes, ano] = cartao.validade.split('/');
      
      const cardPaymentResponse = await fetch(`${ASAAS_BASE_URL}/payments/${paymentResult.id}/payWithCreditCard`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'access_token': ASAAS_API_KEY
        },
        body: JSON.stringify({
          creditCard: {
            holderName: cartao.nome,
            number: cartao.numero.replace(/\s/g, ''),
            expiryMonth: mes,
            expiryYear: `20${ano}`,
            ccv: cartao.cvv
          },
          creditCardHolderInfo: {
            name: pagadorNome,
            email: pagadorEmail,
            cpfCnpj: pagadorCpf.replace(/\D/g, ''),
            postalCode: '01310100',
            addressNumber: '1',
            phone: '11999999999'
          }
        })
      });

      const cardResult = await cardPaymentResponse.json();

      if (!cardPaymentResponse.ok) {
        return NextResponse.json(
          { error: cardResult.errors?.[0]?.description || 'Erro ao processar cartão' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        paymentId: paymentResult.id,
        status: cardResult.status,
        formaPagamento: 'CREDIT_CARD'
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.id,
      status: paymentResult.status
    });

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    );
  }
}
