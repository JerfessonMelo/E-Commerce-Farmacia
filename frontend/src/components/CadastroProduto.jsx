import React from "react";

const CadastroProduto = ({
  produtoInicial,
  setProduto,
  modoEdicao,
  onSalvar,
  onCancelar,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cadastro-produto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSalvar();
        }}
      >
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={produtoInicial.nome}
          onChange={handleChange}
        />
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={produtoInicial.descricao}
          onChange={handleChange}
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço"
          value={produtoInicial.preco}
          onChange={handleChange}
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={produtoInicial.marca}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagemUrl"
          placeholder="URL da Imagem"
          value={produtoInicial.imagemUrl}
          onChange={handleChange}
        />

        <button type="submit">
          {modoEdicao ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>

        {modoEdicao && (
          <button type="button" className="cancelar-btn" onClick={onCancelar}>
            Cancelar Edição
          </button>
        )}
      </form>
    </div>
  );
};

export default CadastroProduto;
