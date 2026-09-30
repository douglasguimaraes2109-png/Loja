/* ============================================
   SUA MARCA — Base de Dados dos Produtos
   ============================================
   Cada produto tem:
   - id: número único
   - nome: nome da estampa
   - categoria: usada nos filtros
   - preco: valor em reais
   - tag: selo opcional ("NOVO", "LIMITADO")
   - descricao: texto da página do produto
   - imagens: array de URLs (mínimo 1, ideal 3)
   - cores: array de cores disponíveis
   - tamanhos: objeto { "P": qtdEstoque, "M": qtdEstoque, ... }
   ============================================ */

const PRODUTOS = [
  {
    id: 1,
    nome: "Onda Azul",
    categoria: "Mar",
    preco: 89.90,
    tag: "NOVO",
    descricao: "Estampa inspirada nas ondas do mar, impressa em algodão de alta gramatura. Toque macio, caimento perfeito e durabilidade que você sente no primeiro uso.",
    imagens: [
      "https://picsum.photos/seed/onda-a/800/900",
      "https://picsum.photos/seed/onda-b/800/900",
      "https://picsum.photos/seed/onda-c/800/900"
    ],
    cores: ["Preta", "Branca", "Bege"],
    tamanhos: { "P": 4, "M": 8, "G": 6, "GG": 2 }
  },
  {
    id: 2,
    nome: "Lobo",
    categoria: "Animal",
    preco: 99.90,
    tag: "",
    descricao: "O lobo como símbolo de força e liberdade. Arte autoral em traço minimalista, perfeita pra quem gosta de estampas com significado.",
    imagens: [
      "https://picsum.photos/seed/lobo-a/800/900",
      "https://picsum.photos/seed/lobo-b/800/900",
      "https://picsum.photos/seed/lobo-c/800/900"
    ],
    cores: ["Preta", "Cinza"],
    tamanhos: { "P": 3, "M": 6, "G": 5, "GG": 1 }
  },
  {
    id: 3,
    nome: "Montanha",
    categoria: "Paisagem",
    preco: 79.90,
    tag: "",
    descricao: "Pra quem carrega o espírito aventureiro. Estampa de montanhas em estilo minimalista, com impressão de alta definição.",
    imagens: [
      "https://picsum.photos/seed/montanha-a/800/900",
      "https://picsum.photos/seed/montanha-b/800/900",
      "https://picsum.photos/seed/montanha-c/800/900"
    ],
    cores: ["Preta", "Branca", "Verde"],
    tamanhos: { "P": 5, "M": 10, "G": 8, "GG": 3 }
  },
  {
    id: 4,
    nome: "Geométrica",
    categoria: "Abstrato",
    preco: 89.90,
    tag: "LIMITADO",
    descricao: "Formas geométricas em composição única. Edição limitada — quando esgotar, não volta. Garanta a sua.",
    imagens: [
      "https://picsum.photos/seed/geo-a/800/900",
      "https://picsum.photos/seed/geo-b/800/900",
      "https://picsum.photos/seed/geo-c/800/900"
    ],
    cores: ["Preta", "Branca"],
    tamanhos: { "P": 2, "M": 3, "G": 3, "GG": 0 }
  },
  {
    id: 5,
    nome: "Lua Crescente",
    categoria: "Noturno",
    preco: 94.90,
    tag: "",
    descricao: "A lua em fase crescente, impressa em preto profundo. Perfeita pra quem curte o místico e o noturno.",
    imagens: [
      "https://picsum.photos/seed/lua-a/800/900",
      "https://picsum.photos/seed/lua-b/800/900",
      "https://picsum.photos/seed/lua-c/800/900"
    ],
    cores: ["Preta", "Azul Marinho"],
    tamanhos: { "P": 4, "M": 7, "G": 6, "GG": 2 }
  },
  {
    id: 6,
    nome: "Dragão",
    categoria: "Oriental",
    preco: 109.90,
    tag: "NOVO",
    descricao: "Dragão oriental em traço detalhado, com influência da arte japonesa. Nossa estampa mais trabalhosa — e mais especial.",
    imagens: [
      "https://picsum.photos/seed/dragao-a/800/900",
      "https://picsum.photos/seed/dragao-b/800/900",
      "https://picsum.photos/seed/dragao-c/800/900"
    ],
    cores: ["Preta", "Vermelha"],
    tamanhos: { "P": 3, "M": 5, "G": 4, "GG": 2 }
  },
  {
    id: 7,
    nome: "Flor de Lótus",
    categoria: "Floral",
    preco: 89.90,
    tag: "",
    descricao: "Lótus como símbolo de renascimento. Traço delicado, ideal pra quem busca uma estampa mais suave.",
    imagens: [
      "https://picsum.photos/seed/lotus-a/800/900",
      "https://picsum.photos/seed/lotus-b/800/900",
      "https://picsum.photos/seed/lotus-c/800/900"
    ],
    cores: ["Branca", "Bege", "Rosa"],
    tamanhos: { "P": 6, "M": 9, "G": 7, "GG": 4 }
  },
  {
    id: 8,
    nome: "Caveira",
    categoria: "Urbano",
    preco: 99.90,
    tag: "",
    descricao: "Estampa urbana com atitude. Pra quem não tem medo de se destacar. Impressão em preto intenso.",
    imagens: [
      "https://picsum.photos/seed/caveira-a/800/900",
      "https://picsum.photos/seed/caveira-b/800/900",
      "https://picsum.photos/seed/caveira-c/800/900"
    ],
    cores: ["Preta", "Branca"],
    tamanhos: { "P": 4, "M": 6, "G": 5, "GG": 1 }
  }
];

/* ============================================
   Utilitários globais
   ============================================ */

// Formata preço em Real (R$ 00,00)
function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// Conta total de itens no carrinho (pro badge do header)
function atualizarBadgeCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
  const total = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  document.querySelectorAll('.carrinho-btn .badge').forEach(el => {
    el.textContent = total;
  });
}

// Executa o badge ao carregar qualquer página
document.addEventListener('DOMContentLoaded', atualizarBadgeCarrinho);