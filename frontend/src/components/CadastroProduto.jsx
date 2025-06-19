import React, { useState, useEffect } from "react";

const CadastroProduto = ({
  produtoInicial,
  modoEdicao,
  onSalvar,
  onCancelar,
}) => {
  const [produto, setProduto] = useState(produtoInicial);
  const [imagemFile, setImagemFile] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    setProduto(produtoInicial);
  }, [produtoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (e) => {
    setImagemFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(produto, imagemFile);
  };

  return (
    <div className="cadastro-produto">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={produto.nome}
          onChange={handleChange}
        />
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={produto.descricao}
          onChange={handleChange}
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço"
          value={produto.preco}
          onChange={handleChange}
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={produto.marca}
          onChange={handleChange}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoria"
          value={produto.categoria}
          onChange={handleChange}
        />
        <input
          type="text"
          name="principioAtivo"
          placeholder="Princípio Ativo"
          value={produto.principioAtivo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="faixaEtaria"
          placeholder="Faixa Etária"
          value={produto.faixaEtaria}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tipoProduto"
          placeholder="Tipo de Produto"
          value={produto.tipoProduto}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (ex: vitamina,cabelo)"
          value={produto.tags}
          onChange={handleChange}
        />
        <input type="file" name="imagem" onChange={handleImagemChange} />

        <button type="submit">
          {modoEdicao ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>
        <button type="button" onClick={onCancelar} style={{ marginLeft: 10 }}>
          Cancelar
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastroProduto;
