/* ============================================
   Catálogo — filtros e ordenação
   ============================================ */

let categoriaAtual = 'todas';
let ordenacaoAtual = 'padrao';

const listaEl = document.getElementById('listaProdutos');
const vazioEl = document.getElementById('vazio');

// Filtra + ordena + renderiza
function renderizar() {
  let filtrados = [...PRODUTOS];

  // Filtro por categoria
  if (categoriaAtual !== 'todas') {
    filtrados = filtrados.filter(p => p.categoria === categoriaAtual);
  }

  // Ordenação
  if (ordenacaoAtual === 'menor') {
    filtrados.sort((a, b) => a.preco - b.preco);
  } else if (ordenacaoAtual === 'maior') {
    filtrados.sort((a, b) => b.preco - a.preco);
  } else if (ordenacaoAtual === 'nome') {
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  // Estado vazio
  if (filtrados.length === 0) {
    listaEl.innerHTML = '';
    vazioEl.style.display = 'block';
    return;
  }
  vazioEl.style.display = 'none';

  // Render
  listaEl.innerHTML = filtrados.map(p => `
    <a href="produto.html?id=${p.id}" class="card">
      <div class="img-wrap">
        <img src="${p.imagens[0]}" alt="${p.nome}">
        ${p.tag ? `<div class="tag">${p.tag}</div>` : ''}
      </div>
      <div class="info">
        <h3>${p.nome}</h3>
        <div class="preco">${formatarPreco(p.preco)}</div>
        <div class="parcela">3x sem juros</div>
      </div>
    </a>
  `).join('');
}

// Eventos dos filtros de categoria
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    categoriaAtual = btn.dataset.categoria;
    renderizar();
  });
});

// Evento de ordenação
document.getElementById('ordenacao').addEventListener('change', (e) => {
  ordenacaoAtual = e.target.value;
  renderizar();
});

// Render inicial
renderizar();pro