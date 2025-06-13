import React, { useState } from "react";
import api from "../../services/api";
import { obterToken } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "../../styles/CadastroProduto.css";

const CadastroProduto = () => {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    marca: "",
    preco: "",
    imagemUrl: "",
    estoque: 0,
    ativo: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    try {
      await api.post("/produtos", form, {
        headers: {
          Authorization: `Bearer ${obterToken()}`,
        },
      });
      alert("Produto cadastrado com sucesso!");
      navigate("/admin/lista-produtos");
    } catch (err) {
      alert("Erro ao cadastrar produto");
      console.error(err);
    }
  };

  return (
    <div className="cadastro-produto">
      <h2>Cadastro de Produto</h2>
      <form onSubmit={cadastrar}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="preco"
          placeholder="Preço (ex: 19.99)"
          step="0.01"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imagemUrl"
          placeholder="URL da Imagem"
          onChange={handleChange}
        />
        <input
          type="number"
          name="estoque"
          placeholder="Estoque"
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
          />
          Ativo
        </label>
        <button type="submit">Cadastrar Produto</button>
      </form>
    </div>
  );
};

export default CadastroProduto;
