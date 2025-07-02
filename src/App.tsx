import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, MessageCircle, Phone, Clock, MapPin, CreditCard, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  tipo: 'pizza' | 'bebida';
  destaque?: boolean;
  tempoPreparo?: number;
  tamanhos?: { nome: string; preco: number }[];
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  observacoes?: string;
  meioAMeio?: { primeiraMetade: Produto; segundaMetade: Produto };
  tamanho?: string;
}

const DeliverySystem: React.FC = () => {
  // Estados
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    formaPagamento: 'dinheiro',
    trocoPara: ''
  });
  const [etapaPedido, setEtapaPedido] = useState<'cardapio' | 'dados' | 'confirmacao'>('cardapio');
  const [tempoEstimado, setTempoEstimado] = useState<number>(0);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Pizzas');
  const [mostrarModalMeioAMeio, setMostrarModalMeioAMeio] = useState(false);
  const [pizzaSelecionada, setPizzaSelecionada] = useState<Produto | null>(null);
  const [horarioFuncionamento, setHorarioFuncionamento] = useState({
    aberto: false,
    mensagem: ''
  });

  // Cardápio de produtos
  const produtos: Produto[] = [
    // Pizzas
    {
      id: 1,
      nome: 'Margherita',
      descricao: 'Molho de tomate, mussarela premium, manjericão fresco e azeite de oliva extra virgem',
      preco: 42.90,
      imagem: '🍕',
      categoria: 'Tradicionais',
      tipo: 'pizza',
      destaque: true,
      tempoPreparo: 25,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 32.90 },
        { nome: 'Média (35cm)', preco: 42.90 },
        { nome: 'Grande (45cm)', preco: 52.90 }
      ]
    },
    {
      id: 2,
      nome: 'Pepperoni Supreme',
      descricao: 'Molho de tomate artesanal, mussarela, pepperoni importado e orégano',
      preco: 49.90,
      imagem: '🍕',
      categoria: 'Tradicionais',
      tipo: 'pizza',
      destaque: true,
      tempoPreparo: 30,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 39.90 },
        { nome: 'Média (35cm)', preco: 49.90 },
        { nome: 'Grande (45cm)', preco: 59.90 }
      ]
    },
    {
      id: 3,
      nome: 'Portuguesa Nobre',
      descricao: 'Molho de tomate, mussarela, presunto premium, ovos caipiras, cebola roxa, azeitona preta',
      preco: 52.90,
      imagem: '🍕',
      categoria: 'Tradicionais',
      tipo: 'pizza',
      tempoPreparo: 35,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 42.90 },
        { nome: 'Média (35cm)', preco: 52.90 },
        { nome: 'Grande (45cm)', preco: 62.90 }
      ]
    },
    {
      id: 4,
      nome: 'Calabresa Artesanal',
      descricao: 'Molho de tomate caseiro, mussarela, calabresa artesanal, cebola caramelizada',
      preco: 45.90,
      imagem: '🍕',
      categoria: 'Tradicionais',
      tipo: 'pizza',
      tempoPreparo: 28,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 35.90 },
        { nome: 'Média (35cm)', preco: 45.90 },
        { nome: 'Grande (45cm)', preco: 55.90 }
      ]
    },
    {
      id: 5,
      nome: 'Frango com Catupiry',
      descricao: 'Molho de tomate, mussarela, frango desfiado ao molho, catupiry original',
      preco: 54.90,
      imagem: '🍕',
      categoria: 'Especiais',
      tipo: 'pizza',
      destaque: true,
      tempoPreparo: 32,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 44.90 },
        { nome: 'Média (35cm)', preco: 54.90 },
        { nome: 'Grande (45cm)', preco: 64.90 }
      ]
    },
    {
      id: 6,
      nome: 'Quatro Queijos Gourmet',
      descricao: 'Mussarela, gorgonzola, parmesão reggiano, provolone defumado e azeitonas',
      preco: 58.90,
      imagem: '🍕',
      categoria: 'Especiais',
      tipo: 'pizza',
      tempoPreparo: 35,
      tamanhos: [
        { nome: 'Pequena (25cm)', preco: 48.90 },
        { nome: 'Média (35cm)', preco: 58.90 },
        { nome: 'Grande (45cm)', preco: 68.90 }
      ]
    },
    // Bebidas
    {
      id: 101,
      nome: 'Refrigerante Lata',
      descricao: 'Coca-Cola, Guaraná, Fanta ou Sprite',
      preco: 6.90,
      imagem: '🥤',
      categoria: 'Bebidas',
      tipo: 'bebida'
    },
    {
      id: 102,
      nome: 'Suco Natural 500ml',
      descricao: 'Laranja, Maracujá, Abacaxi com Hortelã ou Morango',
      preco: 12.90,
      imagem: '🧃',
      categoria: 'Bebidas',
      tipo: 'bebida'
    },
    {
      id: 103,
      nome: 'Água Mineral 500ml',
      descricao: 'Água mineral sem gás',
      preco: 4.90,
      imagem: '💧',
      categoria: 'Bebidas',
      tipo: 'bebida'
    },
    {
      id: 104,
      nome: 'Cerveja Artesanal',
      descricao: 'Chopp artesanal da casa 300ml',
      preco: 14.90,
      imagem: '🍺',
      categoria: 'Bebidas',
      tipo: 'bebida'
    }
  ];

  // Verificar horário de funcionamento
  useEffect(() => {
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay(); // 0 = Domingo, 6 = Sábado
    
    const aberto = (dia >= 1 && dia <= 6 && hora >= 18 && hora < 23) || 
                   (dia === 0 && hora >= 18 && hora < 22);
    
    setHorarioFuncionamento({
      aberto,
      mensagem: aberto ? 
        'Aberto agora • Fechamos às ' + (dia === 0 ? '22:00' : '23:00') :
        'Fechado agora • Abre hoje às 18:00'
    });
  }, []);

  // Categorias únicas
  const categorias = ['Pizzas', 'Bebidas'];

  // Filtrar produtos por busca e categoria
  const produtosFiltrados = produtos.filter(produto => {
    const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      produto.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const categoriaMatch = categoriaAtiva === 'Pizzas' ? produto.tipo === 'pizza' : produto.tipo === 'bebida';
    
    return buscaMatch && categoriaMatch;
  });

  // Calcular tempo estimado de preparo
  useEffect(() => {
    if (carrinho.length > 0) {
      const maxTempoPizza = Math.max(...carrinho
        .filter(item => item.produto.tipo === 'pizza')
        .map(item => item.produto.tempoPreparo || 0));
      
      const tempoBase = (maxTempoPizza > 0 ? maxTempoPizza : 20) + 15; // 15 minutos para entrega
      setTempoEstimado(tempoBase);
    } else {
      setTempoEstimado(0);
    }
  }, [carrinho]);

  // Adicionar item ao carrinho
  const adicionarAoCarrinho = (produto: Produto, meioAMeio?: { primeiraMetade: Produto; segundaMetade: Produto }, tamanho?: string) => {
    const itemExistenteIndex = carrinho.findIndex(item => 
      item.produto.id === produto.id && 
      (!item.meioAMeio || (meioAMeio && 
       item.meioAMeio.primeiraMetade.id === meioAMeio.primeiraMetade.id && 
       item.meioAMeio.segundaMetade.id === meioAMeio.segundaMetade.id)) &&
      item.tamanho === tamanho
    );
    
    if (itemExistenteIndex >= 0) {
      const novoCarrinho = [...carrinho];
      novoCarrinho[itemExistenteIndex].quantidade += 1;
      setCarrinho(novoCarrinho);
    } else {
      const novoItem: ItemCarrinho = {
        produto,
        quantidade: 1,
        tamanho
      };
      
      if (meioAMeio) {
        novoItem.meioAMeio = meioAMeio;
        novoItem.produto = {
          ...produto,
          nome: `Meio a Meio (${meioAMeio.primeiraMetade.nome} / ${meioAMeio.segundaMetade.nome})`,
          preco: produto.preco + 5 // Adicional para meio a meio
        };
      }
      
      setCarrinho([...carrinho, novoItem]);
    }
    
    setMostrarModalMeioAMeio(false);
  };

  // Remover item do carrinho
  const removerDoCarrinho = (index: number) => {
    const novoCarrinho = [...carrinho];
    
    if (novoCarrinho[index].quantidade > 1) {
      novoCarrinho[index].quantidade -= 1;
    } else {
      novoCarrinho.splice(index, 1);
    }
    
    setCarrinho(novoCarrinho);
  };

  // Calcular total do carrinho
  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  };

  // Avançar para próxima etapa
  const avancarEtapa = () => {
    if (etapaPedido === 'cardapio' && carrinho.length > 0) {
      setEtapaPedido('dados');
    } else if (etapaPedido === 'dados') {
      if (dadosCliente.nome && dadosCliente.telefone && dadosCliente.endereco) {
        setEtapaPedido('confirmacao');
      } else {
        alert('Preencha todos os dados obrigatórios!');
      }
    }
  };

  // Voltar para etapa anterior
  const voltarEtapa = () => {
    if (etapaPedido === 'confirmacao') {
      setEtapaPedido('dados');
    } else if (etapaPedido === 'dados') {
      setEtapaPedido('cardapio');
    }
  };

  // Gerar mensagem do WhatsApp
  const gerarMensagemWhatsApp = () => {
    const telefone = dadosCliente.telefone.replace(/\D/g, '');
    const numeroCompleto = telefone.startsWith('55') ? telefone : `55${telefone}`;

    let mensagem = `🍕 *PEDIDO - PIZZARIA BELLA GOURMET*\n\n`;
    mensagem += `👤 *Cliente:* ${dadosCliente.nome}\n`;
    mensagem += `📱 *Telefone:* ${dadosCliente.telefone}\n`;
    mensagem += `📍 *Endereço:* ${dadosCliente.endereco}\n`;
    mensagem += `💳 *Pagamento:* ${dadosCliente.formaPagamento === 'dinheiro' ? `Dinheiro (Troco para R$ ${dadosCliente.trocoPara || '--'})` : dadosCliente.formaPagamento}\n`;
    mensagem += `⏱ *Tempo estimado:* ${tempoEstimado} minutos\n\n`;
    
    mensagem += `🛒 *ITENS DO PEDIDO:*\n`;
    
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.produto.nome}* (${item.quantidade}x)\n`;
      if (item.tamanho) {
        mensagem += `   📏 Tamanho: ${item.tamanho}\n`;
      }
      if (item.meioAMeio) {
        mensagem += `   🍴 Meio a Meio: ${item.meioAMeio.primeiraMetade.nome} / ${item.meioAMeio.segundaMetade.nome}\n`;
      }
      mensagem += `   💵 R$ ${(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
      if (item.observacoes) {
        mensagem += `   📝 Obs: ${item.observacoes}\n`;
      }
      mensagem += `\n`;
    });
    
    mensagem += `🎯 *TOTAL: R$ ${calcularTotal().toFixed(2).replace('.', ',')}*\n\n`;
    mensagem += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    mensagem += `🔔 Por favor, confirme o recebimento deste pedido e informe o tempo exato de entrega.`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${numeroCompleto}?text=${mensagemCodificada}`, '_blank');
  };

  // Adicionar observação ao item
  const adicionarObservacao = (index: number, observacao: string) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho[index].observacoes = observacao;
    setCarrinho(novoCarrinho);
  };

  // Abrir modal de meio a meio
  const abrirModalMeioAMeio = (pizza: Produto) => {
    setPizzaSelecionada(pizza);
    setMostrarModalMeioAMeio(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xl relative">
        {/* Barra de status de abertura */}
        <div className={`py-2 text-center text-sm font-medium ${horarioFuncionamento.aberto ? 'bg-green-600' : 'bg-gray-800'}`}>
          {horarioFuncionamento.mensagem}
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white rounded-full p-2 mr-4 shadow-lg">
                <span className="text-3xl">🍕</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif">Bella Gourmet</h1>
                <p className="text-red-100 text-sm">Pizzaria Artesanal • Delivery Premium</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-red-800 px-4 py-2 rounded-full">
                <Phone size={18} />
                <span>(11) 98765-4321</span>
              </div>
              
              <button
                onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
                className="relative bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-lg"
              >
                <ShoppingCart size={20} />
                <span className="hidden md:inline">Meu Pedido</span>
                {carrinho.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {carrinho.reduce((total, item) => total + item.quantidade, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de progresso */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div 
              className={`flex-1 text-center py-2 border-b-2 ${etapaPedido === 'cardapio' ? 'border-red-600 text-red-600 font-medium' : 'border-gray-200 text-gray-500'}`}
            >
              <span className="hidden sm:inline">1. </span>Cardápio
            </div>
            <div 
              className={`flex-1 text-center py-2 border-b-2 ${etapaPedido === 'dados' ? 'border-red-600 text-red-600 font-medium' : 'border-gray-200 text-gray-500'}`}
            >
              <span className="hidden sm:inline">2. </span>Dados
            </div>
            <div 
              className={`flex-1 text-center py-2 border-b-2 ${etapaPedido === 'confirmacao' ? 'border-red-600 text-red-600 font-medium' : 'border-gray-200 text-gray-500'}`}
            >
              <span className="hidden sm:inline">3. </span>Confirmação
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cardápio */}
        {etapaPedido === 'cardapio' && (
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-800 font-serif">Cardápio Premium</h2>
              
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar pizza ou bebida..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Categorias */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${categoriaAtiva === categoria ? 'bg-red-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
                >
                  {categoria}
                </button>
              ))}
            </div>
            
            {/* Produtos em destaque (apenas para pizzas) */}
            {categoriaAtiva === 'Pizzas' && produtosFiltrados.filter(p => p.destaque).length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Destaques da Casa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produtosFiltrados
                    .filter(produto => produto.destaque)
                    .map(produto => (
                      <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-red-100 to-orange-100 h-32 flex items-center justify-center text-6xl">
                            {produto.imagem}
                          </div>
                          {produto.destaque && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              RECOMENDADO
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{produto.nome}</h4>
                            {produto.tempoPreparo && (
                              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                {produto.tempoPreparo} min
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{produto.descricao}</p>
                          
                          {produto.tamanhos && (
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">Tamanhos disponíveis:</div>
                              <div className="flex flex-wrap gap-2">
                                {produto.tamanhos.map((tamanho, i) => (
                                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {tamanho.nome}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-red-600">
                              R$ {produto.preco.toFixed(2).replace('.', ',')}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => produto.tamanhos ? abrirModalMeioAMeio(produto) : adicionarAoCarrinho(produto)}
                                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm"
                              >
                                {produto.tipo === 'pizza' ? 'Meio a Meio' : 'Adicionar'}
                              </button>
                              <button
                                onClick={() => adicionarAoCarrinho(produto)}
                                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm"
                              >
                                <Plus size={16} />
                                Adicionar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Todos os produtos */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                {categoriaAtiva === 'Pizzas' ? 'Todas as Pizzas' : 'Todas as Bebidas'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {produtosFiltrados
                  .filter(produto => !produto.destaque)
                  .map(produto => (
                    <div key={produto.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{produto.nome}</h4>
                          {produto.tempoPreparo && (
                            <span className="text-gray-500 text-sm">
                              {produto.tempoPreparo} min
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mb-3">{produto.descricao}</p>
                        
                        {produto.tamanhos && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">Tamanhos:</div>
                            <div className="flex flex-wrap gap-1">
                              {produto.tamanhos.map((tamanho, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {tamanho.nome.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            R$ {produto.preco.toFixed(2).replace('.', ',')}
                          </span>
                          <div className="flex items-center gap-2">
                            {produto.tipo === 'pizza' && (
                              <button
                                onClick={() => produto.tamanhos ? abrirModalMeioAMeio(produto) : adicionarAoCarrinho(produto)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                              >
                                Meio a Meio
                              </button>
                            )}
                            <button
                              onClick={() => adicionarAoCarrinho(produto)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                              title='Adicionar ao carrinho'
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {carrinho.length > 0 && (
              <div className="fixed bottom-6 right-6 md:hidden">
                <button
                  onClick={avancarEtapa}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
                >
                  <span>Continuar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dados do Cliente */}
        {etapaPedido === 'dados' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações para Entrega</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={dadosCliente.nome}
                      onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                    <input
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={dadosCliente.telefone}
                      onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo*</label>
                    <textarea
                      placeholder="Rua, número, complemento, bairro"
                      value={dadosCliente.endereco}
                      onChange={(e) => setDadosCliente({...dadosCliente, endereco: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 focus:outline-none h-24 resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento*</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDadosCliente({...dadosCliente, formaPagamento: 'dinheiro'})}
                        className={`p-3 border rounded-lg flex items-center gap-2 ${dadosCliente.formaPagamento === 'dinheiro' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      >
                        <Wallet size={18} />
                        <span>Dinheiro</span>
                      </button>
                      <button
                        onClick={() => setDadosCliente({...dadosCliente, formaPagamento: 'cartao'})}
                        className={`p-3 border rounded-lg flex items-center gap-2 ${dadosCliente.formaPagamento === 'cartao' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      >
                        <CreditCard size={18} />
                        <span>Cartão</span>
                      </button>
                      <button
                        onClick={() => setDadosCliente({...dadosCliente, formaPagamento: 'pix'})}
                        className={`p-3 border rounded-lg flex items-center gap-2 ${dadosCliente.formaPagamento === 'pix' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="M7 15h0M12 15h3M7 10h2v3M17 10h-4v3h4"></path>
                        </svg>
                        <span>PIX</span>
                      </button>
                    </div>
                  </div>
                  
                  {dadosCliente.formaPagamento === 'dinheiro' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Troco para quanto?</label>
                      <input
                        type="text"
                        placeholder="Ex: 50,00"
                        value={dadosCliente.trocoPara}
                        onChange={(e) => setDadosCliente({...dadosCliente, trocoPara: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 focus:outline-none"
                      />
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={voltarEtapa}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Voltar
                      </button>
                      <button
                        onClick={avancarEtapa}
                        className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg shadow flex items-center gap-2"
                      >
                        Continuar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmação */}
        {etapaPedido === 'confirmacao' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirme seu Pedido</h2>
                <p className="text-gray-600 mb-6">Revise os itens e informações antes de finalizar</p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <ShoppingCart size={20} />
                      Seu Pedido
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      {carrinho.map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.produto.nome}</h4>
                              <p className="text-sm text-gray-600">{item.produto.descricao}</p>
                              {item.tamanho && (
                                <p className="text-xs text-gray-500 mt-1">Tamanho: {item.tamanho}</p>
                              )}
                              {item.meioAMeio && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Meio a Meio: {item.meioAMeio.primeiraMetade.nome} / {item.meioAMeio.segundaMetade.nome}
                                </p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-red-600">
                              R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removerDoCarrinho(index)}
                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                                title='Remover item'
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantidade}</span>
                              <button
                                onClick={() => adicionarAoCarrinho(item.produto, item.meioAMeio, item.tamanho)}
                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                                title='Adicionar mais'
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            {item.produto.tempoPreparo && (
                              <div className="text-xs text-gray-500">
                                {item.produto.tempoPreparo} min
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Alguma observação? (opcional)"
                              value={item.observacoes || ''}
                              onChange={(e) => adicionarObservacao(index, e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Subtotal</span>
                        <span>R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Taxa de Entrega</span>
                        <span>Grátis</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-red-600">R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Dados de Entrega
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Nome</p>
                          <p className="font-medium">{dadosCliente.nome}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Telefone</p>
                          <p className="font-medium">{dadosCliente.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Endereço</p>
                          <p className="font-medium">{dadosCliente.endereco}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pagamento</p>
                          <p className="font-medium">
                            {dadosCliente.formaPagamento === 'dinheiro' 
                              ? `Dinheiro (Troco para R$ ${dadosCliente.trocoPara || '--'})` 
                              : dadosCliente.formaPagamento}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tempo estimado</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock size={16} />
                            {tempoEstimado} minutos
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={gerarMensagemWhatsApp}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                      >
                        <MessageCircle size={20} />
                        Finalizar Pedido via WhatsApp
                      </button>
                      
                      <button
                        onClick={voltarEtapa}
                        className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center gap-1 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Voltar e editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Meio a Meio */}
      {mostrarModalMeioAMeio && pizzaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Montar Pizza Meio a Meio</h3>
                <button
                  onClick={() => setMostrarModalMeioAMeio(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title='Fechar modal'
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Escolha o tamanho:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {pizzaSelecionada.tamanhos?.map((tamanho, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Aqui você pode implementar a lógica para selecionar o tamanho
                        // Por enquanto vamos apenas usar o primeiro tamanho como exemplo
                        setMostrarModalMeioAMeio(false);
                        adicionarAoCarrinho(pizzaSelecionada, undefined, tamanho.nome);
                      }}
                      className="border border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50"
                    >
                      <div className="text-xs font-medium">{tamanho.nome.split(' ')[0]}</div>
                      <div className="text-sm text-red-600">R$ {tamanho.preco.toFixed(2).replace('.', ',')}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Escolha dois sabores:</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primeira metade:</label>
                    <select
                      id="primeira-metade"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      aria-label="Primeira metade"
                    >
                      {produtos
                        .filter(p => p.tipo === 'pizza' && p.id !== pizzaSelecionada.id)
                        .map(pizza => (
                          <option key={pizza.id} value={pizza.id}>{pizza.nome}</option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segunda metade:</label>
                    <select  
                    id='segunda-metade'
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    aria-label='Segunda metade'
                    >
                      {produtos
                        .filter(p => p.tipo === 'pizza' && p.id !== pizzaSelecionada.id)
                        .map(pizza => (
                          <option key={pizza.id} value={pizza.id}>{pizza.nome}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Aqui você implementaria a lógica para pegar os sabores selecionados
                  // Estou usando a pizza selecionada e a primeira pizza do cardápio como exemplo
                  const primeiraMetade = produtos.find(p => p.tipo === 'pizza' && p.id !== pizzaSelecionada.id)!;
                  adicionarAoCarrinho(
                    pizzaSelecionada, 
                    {
                      primeiraMetade: pizzaSelecionada,
                      segundaMetade: primeiraMetade
                    },
                    pizzaSelecionada.tamanhos?.[0].nome
                  );
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg"
              >
                Adicionar ao Carrinho (+ R$ 5,00)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carrinho lateral (para desktop) */}
      {mostrarCarrinho && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setMostrarCarrinho(false)}
            ></div>
            
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Meu Pedido</h2>
                      <button
                        onClick={() => setMostrarCarrinho(false)}
                        className="text-gray-400 hover:text-gray-500"
                        title='Fechar carrinho'
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-8">
                      {carrinho.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingCart size={48} className="mx-auto text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">Carrinho vazio</h3>
                          <p className="mt-1 text-gray-500">Adicione itens para continuar</p>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {carrinho.map((item, index) => (
                              <li key={index} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                                  <div className="w-full h-full flex items-center justify-center text-3xl">
                                    {item.produto.imagem}
                                  </div>
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.produto.nome}</h3>
                                      <p className="ml-4">R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    {item.tamanho && (
                                      <p className="text-xs text-gray-500">Tamanho: {item.tamanho}</p>
                                    )}
                                    {item.meioAMeio && (
                                      <p className="text-xs text-gray-500">
                                        Meio a Meio: {item.meioAMeio.primeiraMetade.nome} / {item.meioAMeio.segundaMetade.nome}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => removerDoCarrinho(index)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title='Remover item'
                                      >
                                        <Minus size={14} />
                                      </button>
                                      <span className="mx-2 font-medium">{item.quantidade}</span>
                                      <button
                                        onClick={() => adicionarAoCarrinho(item.produto, item.meioAMeio, item.tamanho)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title='Adicionar mais'
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removerDoCarrinho(index)}
                                      className="font-medium text-red-600 hover:text-red-500"
                                    >
                                      Remover
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {carrinho.length > 0 && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>R$ {calcularTotal().toFixed(2).replace('.', ',')}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Taxa de entrega calculada na finalização</p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setMostrarCarrinho(false);
                            setEtapaPedido('dados');
                          }}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 w-full"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-gray-600 text-sm mt-2 text-center w-full">
            Desenvolvido por <a href="https://instagram.com/devmxs" className="hover:text-blue-700 font-semibold transition">DEVMXS</a>
          </p>
    </div>
  );
};

export default DeliverySystem;