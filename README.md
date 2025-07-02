# Pizzaria Delivery System - React Application

## Descrição

Este projeto é um sistema de delivery para pizzaria desenvolvido em React com TypeScript. Ele oferece uma experiência completa de pedidos online, desde a seleção de produtos até a finalização do pedido via WhatsApp.

## Funcionalidades Principais

- **Cardápio interativo** com categorias de produtos (Pizzas e Bebidas)
- **Sistema de carrinho** com adição/remoção de itens e quantidades
- **Opção de pizza meio a meio** com seleção de dois sabores
- **Formulário de dados do cliente** para entrega
- **Múltiplas formas de pagamento** (Dinheiro, Cartão, PIX)
- **Confirmação de pedido** com resumo completo
- **Integração com WhatsApp** para envio do pedido
- **Responsividade** para dispositivos móveis e desktop
- **Verificação de horário de funcionamento**

## Tecnologias Utilizadas

- React com TypeScript
- Lucide React para ícones
- Tailwind CSS para estilização
- React Hooks (useState, useEffect)

## Como Executar o Projeto

1. Certifique-se de ter o Node.js instalado
2. Clone este repositório
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o projeto:
   ```bash
   npm start
   ```

## Estrutura do Código

O componente principal `DeliverySystem` contém:

- Estados para gerenciar o carrinho, dados do cliente e fluxo do pedido
- Lista de produtos (pizzas e bebidas) com detalhes como preços, descrições e tempos de preparo
- Lógica para cálculo de totais e tempo estimado de entrega
- Componentes visuais para cada etapa do processo (cardápio, dados, confirmação)
- Modais para seleção de meio a meio e visualização do carrinho

## Personalização

Para adaptar o sistema à sua pizzaria:

1. Modifique a lista de produtos no arquivo (`produtos`)
2. Ajuste os horários de funcionamento na verificação com `useEffect`
3. Altere as informações de contato no header
4. Personalize as cores e estilos no Tailwind CSS

## Melhorias Futuras

- Integração com API para gerenciamento de pedidos
- Sistema de login para clientes cadastrados
- Histórico de pedidos
- Avaliação de produtos
- Cupons de desconto

## Licença

Este projeto está licenciado sob a licença MIT.