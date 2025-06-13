// src/services/carrinho.js
export const adicionarAoCarrinho = (produto) => {
  const atual = JSON.parse(localStorage.getItem("carrinho") || "[]");
  localStorage.setItem("carrinho", JSON.stringify([...atual, produto]));
};

export const removerDoCarrinho = (id) => {
  const atual = JSON.parse(localStorage.getItem("carrinho") || "[]");
  const atualizado = atual.filter((p) => p._id !== id);
  localStorage.setItem("carrinho", JSON.stringify(atualizado));
};

export const obterCarrinho = () => {
  return JSON.parse(localStorage.getItem("carrinho") || "[]");
};

export const limparCarrinho = () => {
  localStorage.removeItem("carrinho");
};
