/* ============================================
   Carrinho — listar, alterar qtd, remover
   ============================================ */

const FRETE_GRATIS = 199; // Valor mínimo pra frete grátis

// Lê o carrinho do localStorage
function lerCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho') || '[]');
}

// Salva o carrinho
function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarBadgeCarrinho();
}

// Altera quantidade (+1 ou -1)
function alterarQtd(index, delta) {
  const carrinho = lerCarrinho();
  const item = carrinho[index];
  if (!item) return;

  item.qtd += delta;

  // Se zerar, remove
  if (item.qtd <= 0) {
    carrinho.splice(index, 1);
  }

  salvarCarrinho(carrinho);
  renderizar();
}

// Remove item
function removerItem(index) {
  const carrinho = lerCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderizar();
}

// Limpa tudo (com confirmação)
function limparCarrinho() {
  if (!confirm('Tem certeza que quer esvaziar o carrinho?')) return;
  localStorage.removeItem('carrinho');
  atualizarBadgeCarrinho();
  renderizar();
}

// Renderiza carrinho
function renderizar() {
  const carrinho = lerCarrinho();
  const itensEl = document.getElementById('itensCarrinho');
  const subtituloEl = document.getElementById('subtitulo');

  // Estado vazio
  if (carrinho.length === 0) {
    subtituloEl.textContent = '0 itens';
    itensEl.innerHTML = `
      <div class="carrinho-vazio">
        <h2>Seu carrinho está vazio</h2>
        <p>Que tal dar uma olhada na nossa coleção?</p>
        <a href="catalogo.html" class="btn btn-primario">Ver produtos</a>
      </div>
    `;
    return;
  }

  // Calcula totais
  const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
  const subtotal = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
  const frete = subtotal >= FRETE_GRATIS ? 0 : 19.90;
  const total = subtotal + frete;

  subtituloEl.textContent = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;

  // Lista itens
  itensEl.innerHTML = carrinho.map((item, i) => `
    <div class="item-carrinho">
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="info">
        <h4>${item.nome}</h4>
        <small>Cor: ${item.cor} · Tam: ${item.tamanho}</small>
        <div class="preco-item">${formatarPreco(item.preco)}</div>
        <div class="qtd">
          <button onclick="alterarQtd(${i}, -1)">−</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd(${i}, 1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Georgia',serif;font-size:20px;margin-bottom:12px;">
          ${formatarPreco(item.preco * item.qtd)}
        </div>
        <button class="remover" onclick="removerItem(${i})">Remover</button>
      </div>
    </div>
  `).join('');

  // Resumo + subtotal
  itensEl.innerHTML += `
    <div style="background:#fff;padding:32px;margin-top:16px;">
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-family:'Helvetica',sans-serif;font-size:14px;">
        <span>Subtotal</span>
        <span>${formatarPreco(subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-family:'Helvetica',sans-serif;font-size:14px;border-bottom:1px solid rgba(17,17,17,.1);">
        <span>Frete</span>
        <span>${frete === 0 ? 'Grátis 🎉' : formatarPreco(frete)}</span>
      </div>
      ${frete > 0 ? `
        <div style="padding:14px 0 0;font-family:'Helvetica',sans-serif;font-size:12px;color:#6B6B6B;letter-spacing:.5px;">
          Faltam <strong>${formatarPreco(FRETE_GRATIS - subtotal)}</strong> pra você ganhar frete grátis.
        </div>
      ` : `
        <div style="padding:14px 0 0;font-family:'Helvetica',sans-serif;font-size:12px;color:#2a7a4a;letter-spacing:.5px;">
          ✓ Você ganhou frete grátis!
        </div>
      `}
    </div>

    <div class="carrinho-total">
      <span>Total</span>
      <span class="valor">${formatarPreco(total)}</span>
    </div>

    <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
      <a href="catalogo.html" class="btn" style="flex:1;text-align:center;">← Continuar comprando</a>
      <button class="btn btn-primario" style="flex:2;" onclick="finalizarCompra()">
        Finalizar compra →
      </button>
    </div>

    <button onclick="limparCarrinho()" style="display:block;margin:24px auto 0;background:transparent;border:none;color:#6B6B6B;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:'Helvetica',sans-serif;text-decoration:underline;">
      Esvaziar carrinho
    </button>
  `;
}

// Placeholder do checkout (próxima fase)
function finalizarCompra() {
  alert('🛒 Checkout será implementado na próxima fase!\n\nAqui você vai:\n\n• Preencher endereço de entrega\n• Calcular frete pelo CEP\n• Escolher forma de pagamento (Pix, cartão, boleto)\n• Finalizar o pedido');
}

// ============ INICIALIZAÇÃO ============
renderizar();