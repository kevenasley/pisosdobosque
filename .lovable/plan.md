# Plano de Correção: Fluxo de Leads e WhatsApp

A regra principal é garantir que o WhatsApp abra **imediatamente** após a validação do formulário, sem esperar por respostas de rede ou do servidor, enquanto a aba original processa o envio e navega para a página de agradecimento.

## Alterações

### 1. Componente de Captura de Leads (`src/components/lead/LeadCapture.tsx`)

- **Reorganização do `onSubmit`**:
  - Validar campos localmente.
  - Se válido, gerar `leadId` e disparar eventos de tracking iniciais.
  - **Abrir WhatsApp IMEDIATAMENTE** usando `window.open` com a mensagem montada, antes de qualquer `await`.
  - Iniciar o envio para o backend em segundo plano.
  - Atualizar o estado para `submitting = true`.
- **Feedback Visual**:
  - Alterar o texto do botão para "Enviando dados...".
  - Adicionar um spinner discreto (usando `lucide-react` ou CSS).
  - Desabilitar o botão durante o envio para evitar cliques duplos.
- **Navegação**:
  - Após a conclusão do `submitLeadClient` (sucesso ou falha final), navegar para `/obrigado?src=form`.
  - Garantir que o erro de backend não impeça a experiência, mas seja logado.

### 2. Utilitário de Envio (`src/lib/lead-client.ts`)

- Nenhuma alteração estrutural necessária (apenas garantir que o componente utilize `keepalive: true` se for necessário sobreviver a navegação, embora aqui a navegação ocorra *após* o await).

## Detalhes Técnicos

- **Ordem de Execução**:
  1. `parsed = schema.safeParse(...)`
  2. `window.open(whatsappUrl, "_blank")`
  3. `setSubmitting(true)`
  4. `await submitLeadClient(...)`
  5. `window.location.href = "/obrigado?src=form"`

- **UI do Botão**:
```tsx
{submitting ? (
  <>
    <Loader2 className="h-4 w-4 animate-spin" />
    Enviando dados...
  </>
) : (
  <>
    <WhatsAppIcon className="h-4 w-4" />
    Falar no WhatsApp
  </>
)}
```

## Verificação e Testes

- **Build**: `npm run build` para garantir que a tipagem e os caminhos estão corretos.
- **Teste Funcional**:
  - Verificar se o WhatsApp abre na hora do clique.
  - Verificar se o botão muda para "Enviando dados...".
  - Verificar se os dados chegam à planilha (via logs de rede).
  - Verificar se a página muda para `/obrigado`.
  - Testar clique duplo (deve ser bloqueado pelo `disabled`).
