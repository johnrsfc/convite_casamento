# Integração com Google Sheets - Sistema RSVP

## Passo 1: Criar a Planilha

AKfycbzBs3Cfr1j4eOKfNu72Zq7yhxmC9Tzrg1M0IVqrfd5CK_R6CGGG5ZImmzhHVdCfg6dXgA

https://script.google.com/macros/s/AKfycbzBs3Cfr1j4eOKfNu72Zq7yhxmC9Tzrg1M0IVqrfd5CK_R6CGGG5ZImmzhHVdCfg6dXgA/exec

Crie uma planilha no Google Sheets com as seguintes colunas na primeira aba (Lista):

| Nome | MaxAcompanhantes | Acompanhantes | JaConfirmou |
|------|------------------|---------------|-------------|
| João Silva | 2 | Maria Silva;Pedro Silva | não |
| Ana Santos | 1 | | não |
| Carlos Oliveira | 3 | Lucia Oliveira | não |

- **Nome**: Nome do convidado principal
- **MaxAcompanhantes**: Número máximo de acompanhantes permitidos
- **Acompanhantes**: Nomes separados por `;` (ponto e vírgula)
- **JaConfirmou**: "sim" ou "não" (atualizado automaticamente)

---

## Passo 2: Publicar como CSV

1. Vá em **Arquivo > Compartilhar > Publicar na Web**
2. Selecione a aba "Lista"
3. Escolha o formato **CSV**
4. Clique em **Publicar**
5. Copie a URL gerada

---

## Passo 3: Criar o Apps Script para Salvar Confirmações

1. Na planilha, vá em **Extensões > Apps Script**
2. Cole o seguinte código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Confirmacoes');
  const data = JSON.parse(e.postData.contents);
  
  const timestamp = new Date().toLocaleString('pt-BR');
  
  // Salva cada confirmação
  sheet.appendRow([
    timestamp,
    data.convidadoPrincipal,
    data.acompanhantes.map(a => `${a.nome} (${a.idade} anos)`).join(', '),
    data.acompanhantes.length
  ]);
  
  // Marca como confirmado na lista principal
  const listaSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lista');
  const range = listaSheet.getDataRange();
  const values = range.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.convidadoPrincipal) {
      listaSheet.getRange(i + 1, 4).setValue('sim');
      break;
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Crie uma segunda aba chamada **"Confirmacoes"** com as colunas:
   - Data/Hora | Convidado Principal | Acompanhantes | Total

4. Clique em **Implantar > Nova implantação**
5. Selecione **Aplicativo da Web**
6. Configure:
   - Executar como: **Você**
   - Quem tem acesso: **Qualquer pessoa**
7. Clique em **Implantar** e copie a URL
https://docs.google.com/spreadsheets/d/e/2PACX-1vR5uYEZv4vvEOL6E6WlC1a1Lgwu4tGsqx9GV1Tp57oE6HBasaxEPqWZdWzcoVdIjgN43ft5boqq90Qi/pubhtml?gid=0&single=true
---

## Passo 4: Configurar as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/pub?gid=0&single=true&output=csv
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
```

Reinicie o servidor Next.js para aplicar as variáveis.

---

## Testando

1. Acesse http://localhost:3000/confirma
2. Busque um nome da sua lista
3. Selecione os acompanhantes
4. Confirme a presença
5. Verifique a planilha - a confirmação deve aparecer na aba "Confirmacoes"

---

## Estrutura de Arquivos

```
app/
├── confirma/
│   └── page.tsx          # Página de confirmação
├── api/
│   ├── convidados/
│   │   └── route.ts      # Busca lista do Google Sheets
│   └── confirmar/
│       └── route.ts      # Salva confirmação via Apps Script
```
