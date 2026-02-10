# Task: Implementar confirmação de presença com código único no convite
Objetivo

Aumentar a segurança e o profissionalismo da confirmação de presença, evitando:

Confirmação indevida por terceiros

Visualização de acompanhantes de outros convidados

Busca pública por nomes

Escopo da Task

Implementar um fluxo de confirmação de presença baseado em código único, informado no convite físico ou digital.

Descrição Funcional

Cada convidado terá um código exclusivo de confirmação.

O convidado acessará a página de confirmação no site.

Ele informará apenas o código do convite.

Após validação do código, o sistema exibirá:

Nome do convidado

Lista de acompanhantes vinculados

Opção de confirmar ou recusar presença

O código poderá ser:

Uso único

Ou reutilizável apenas para edição da confirmação (definir regra)

Requisitos Funcionais

O site não deve permitir busca por nome.

Nenhuma informação do convidado deve ser exibida antes da validação do código.

Cada código deve estar vinculado a apenas um convidado.

O sistema deve registrar:

Data e hora da confirmação

Status da confirmação (Confirmado / Não irá)

Caso o código seja inválido:

Exibir mensagem clara e neutra (sem detalhes extras)

Requisitos Não Funcionais

Fluxo simples e direto, acessível para usuários leigos.

Linguagem clara e amigável na interface.

Visual alinhado ao tema do casamento.

Evitar qualquer exposição de dados sensíveis.

Ajustes no Conteúdo do Convite

Incluir no convite:

URL do site de confirmação

Código único do convidado

Exemplo de texto:

“Para confirmar sua presença, acesse nosso site e utilize o código abaixo:
Código do convite: XXXXX”

Critérios de Aceitação

Não é possível confirmar presença sem informar um código válido.

Um convidado não consegue visualizar dados de outro convidado.

A confirmação ocorre com no máximo:

1 campo de entrada

1 ação principal (Confirmar presença)

O fluxo funciona tanto em desktop quanto mobile.

Fora de Escopo (importante deixar explícito)

Login com usuário e senha

Envio de código por SMS ou WhatsApp

Alteração dinâmica de acompanhantes após confirmação

Integração com sistemas externos

Observações

Essa abordagem elimina totalmente o risco de “curiosidade indevida”.

Transmite maior organização e cuidado com os convidados.

Facilita controle e conferência posterior da lista de presença.