import React, { useState } from "react";
import api from "../services/api";

const CadastroProduto = () => {
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    categoria: "",
    principioAtivo: "",
    faixaEtaria: "",
    tipoProduto: "",
    tags: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (e) => {
    setImagemFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nome", produto.nome);
      formData.append("descricao", produto.descricao);
      formData.append("preco", produto.preco);
      formData.append("marca", produto.marca);
      formData.append("categoria", produto.categoria);
      formData.append("principioAtivo", produto.principioAtivo);
      formData.append("faixaEtaria", produto.faixaEtaria);
      formData.append("tipoProduto", produto.tipoProduto);
      formData.append("tags", produto.tags);

      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      const resposta = await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMensagem("Produto cadastrado com sucesso!");
      setProduto({
        nome: "",
        descricao: "",
        preco: "",
        marca: "",
      });
      setImagemFile(null);
    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);
      setMensagem("Erro ao cadastrar produto.");
    }
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
          placeholder="Categoria Produto"
          onChange={handleChange}
          value={produto.categoria}
        />
        <input
          type="text"
          name="principioAtivo"
          placeholder="Princípio Ativo"
          onChange={handleChange}
          value={produto.principioAtivo}
        />
        <input
          type="text"
          name="faixaEtaria"
          placeholder="Adulto ou Infantil"
          onChange={handleChange}
          value={produto.faixaEtaria}
        />
        <input
          type="text"
          name="tipoProduto"
          placeholder="Xarope Ou Comprimido"
          onChange={handleChange}
          value={produto.tipoProduto}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (ex: vitamina,cabelo,imunidade)"
          onChange={handleChange}
          value={produto.tags}
        />
        <input type="file" name="imagem" onChange={handleImagemChange} />
        <button type="submit">Cadastrar Produto</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastroProduto;
