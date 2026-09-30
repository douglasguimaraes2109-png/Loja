/* ============================================
   Página do Produto — galeria, tamanho, cor
   ============================================ */

// Estado da página
let produtoAtual = null;
let imagemAtual = 0;
let tamanhoEscolhido = null;
let corEscolhida = null;

// Utilitário: pega ?id=X da URL
function pegarIdDaURL() {
  const params = new URLSearchParams(location.search);
  return parseInt(params.get('id'));
}

// Troca imagem principal + marca miniatura ativa
function trocarImagem(index) {
  imagemAtual = index;
  const principal = document.getElementById('imgPrincipal');
  principal.style.opacity = '0';
  setTimeout(() => {
    principal.src = produtoAtual.imagens[index];
    principal.style.opacity = '1';
  }, 120);

  document.querySelectorAll('.galeria-miniaturas img').forEach((img, i) => {
    img.classList.toggle('ativa', i === index);
  });
}

// Atualiza label do estoque do tamanho selecionado
function atualizarEstoqueLabel() {
  const label = document.getElementById('estoqueLabel');
  if (!tamanhoEscolhido) { label.textContent = ''; return; }
  const qtd = produtoAtual.tamanhos[tamanhoEscolhido];
  if (qtd === 0) { label.textContent = '— esgotado'; return; }
  if (qtd <= 3) { label.textContent = `— últimas ${qtd} unidades`; return; }
  label.textContent = `— ${qtd} disponíveis`;
}

// Renderiza tudo na tela
function renderizarProduto(p) {
  produtoAtual = p;

  const wrap = document.getElementById('produtoWrap');

  // HTML principal
  wrap.innerHTML = `
    <div class="galeria">
      <img src="${p.imagens[0]}" alt="${p.nome}" class="galeria-principal" id="imgPrincipal">
      <div class="galeria-miniaturas">
        ${p.imagens.map((img, i) => `
          <img src="${img}" alt="Foto ${i+1}" data-index="${i}" class="${i===0?'ativa':''}">
        `).join('')}
      </div>
    </div>

    <div class="produto-info">
      <div class="categoria">${p.categoria}</div>
      <h1>${p.nome}</h1>
      <div class="preco">${formatarPreco(p.preco)}</div>
      <div class="parcela">ou 3x de ${formatarPreco(p.preco/3)} sem juros</div>

      <p class="descricao">${p.descricao}</p>

      <!-- CORES -->
      <div class="opcoes">
        <label>Cor: <span id="corLabel">— escolha</span></label>
        <div class="botoes" id="coresBtns">
          ${p.cores.map(c => `<button data-cor="${c}">${c}</button>`).join('')}
        </div>
      </div>

      <!-- TAMANHOS -->
      <div class="opcoes">
        <label>Tamanho: <span id="estoqueLabel"></span></label>
        <div class="botoes" id="tamanhosBtns">
          ${Object.entries(p.tamanhos).map(([t, qtd]) =>
            `<button data-tam="${t}" ${qtd===0?'disabled':''}>${t}</button>`
          ).join('')}
        </div>
      </div>

      <!-- COMPRAR -->
      <button class="btn-comprar" id="btnComprar" disabled>
        Adicionar ao carrinho
      </button>
      <p class="frete-info">🚚 Frete grátis acima de R$ 199 · Troca fácil em até 30 dias</p>
    </div>
  `;

  // Evento: miniaturas
  document.querySelectorAll('.galeria-miniaturas img').forEach(img => {
    img.addEventListener('click', () => trocarImagem(parseInt(img.dataset.index)));
  });

  // Evento: cores
  document.querySelectorAll('#coresBtns button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#coresBtns button').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      corEscolhida = btn.dataset.cor;
      document.getElementById('corLabel').textContent = `— ${corEscolhida}`;
      checarBotao();
    });
  });

  // Evento: tamanhos
  document.querySelectorAll('#tamanhosBtns button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      document.querySelectorAll('#tamanhosBtns button').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      tamanhoEscolhido = btn.dataset.tam;
      atualizarEstoqueLabel();
      checarBotao();
    });
  });

  // Evento: comprar
  document.getElementById('btnComprar').addEventListener('click', adicionarAoCarrinho);
}

// Habilita o botão só quando cor + tamanho escolhidos
function checarBotao() {
  const btn = document.getElementById('btnComprar');
  btn.disabled = !(corEscolhida && tamanhoEscolhido);
}

// Adiciona ao carrinho no localStorage
function adicionarAoCarrinho() {
  if (!corEscolhida || !tamanhoEscolhido) return;

  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

  // Verifica se já existe item igual (mesmo id + cor + tamanho)
  const indexExistente = carrinho.findIndex(
    i => i.id === produtoAtual.id && i.cor === corEscolhida && i.tamanho === tamanhoEscolhido
  );

  if (indexExistente >= 0) {
    carrinho[indexExistente].qtd += 1;
  } else {
    carrinho.push({
      id: produtoAtual.id,
      nome: produtoAtual.nome,
      preco: produtoAtual.preco,
      imagem: produtoAtual.imagens[0],
      cor: corEscolhida,
      tamanho: tamanhoEscolhido,
      qtd: 1
    });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarBadgeCarrinho();

  // Feedback visual
  const btn = document.getElementById('btnComprar');
  const textoOriginal = btn.textContent;
  btn.textContent = '✓ Adicionado!';
  btn.style.background = '#2a7a4a';
  btn.style.borderColor = '#2a7a4a';
  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 1400);
}

// Produtos relacionados (mesma categoria, exceto o atual)
function renderizarRelacionados(p) {
  const rel = PRODUTOS.filter(x => x.categoria === p.categoria && x.id !== p.id);

  // Se não tiver da mesma categoria, pega aleatórios
  const lista = rel.length >= 2 ? rel : PRODUTOS.filter(x => x.id !== p.id).slice(0, 4);

  if (lista.length === 0) return;

  document.getElementById('relacionados').style.display = 'block';

  document.getElementById('listaRelacionados').innerHTML = lista.map(item => `
    <a href="produto.html?id=${item.id}" class="card">
      <div class="img-wrap">
        <img src="${item.imagens[0]}" alt="${item.nome}">
        ${item.tag ? `<div class="tag">${item.tag}</div>` : ''}
      </div>
      <div class="info">
        <h3>${item.nome}</h3>
        <div class="preco">${formatarPreco(item.preco)}</div>
        <div class="parcela">3x sem juros</div>
      </div>
    </a>
  `).join('');
}

// ============ INICIALIZAÇÃO ============
const id = pegarIdDaURL();
const produto = PRODUTOS.find(p => p.id === id);

if (!produto) {
  document.getElementById('produtoWrap').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
      <h2 style="font-family:'Georgia',serif;font-weight:400;font-size:28px;margin-bottom:16px;">Produto não encontrado</h2>
      <p style="color:#6B6B6B;margin-bottom:30px;font-family:'Helvetica',sans-serif;">O produto que você procura não existe ou foi removido.</p>
      <a href="catalogo.html" class="btn btn-primario">Voltar à coleção</a>
    </div>
  `;
} else {
  renderizarProduto(produto);
  renderizarRelacionados(produto);
  document.title = `${produto.nome} — SUA MARCA`;
}