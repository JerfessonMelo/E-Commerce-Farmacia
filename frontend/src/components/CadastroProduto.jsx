import React, { useState } from "react";
import api from "../services/api";

const CadastroProduto = () => {
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
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
        <input type="file" name="imagem" onChange={handleImagemChange} />
        <button type="submit">Cadastrar Produto</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastroProduto;
