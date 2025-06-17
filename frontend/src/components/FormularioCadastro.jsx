import React, { useState } from "react";
import api from "../services/api";
import "../styles/AuthForm.css";

const FormularioCadastro = ({ trocarParaLogin }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/usuarios/registro", form);
      alert("Usuário cadastrado com sucesso!");
      trocarParaLogin();
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao cadastrar.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Cadastro</h2>
      <form onSubmit={cadastrar}>
        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          onChange={handleChange}
          required
        />
        <label>Nome Completo</label>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          onChange={handleChange}
          required
        />
        <label>Data Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          placeholder="Data de Nascimento"
          onChange={handleChange}
          required
        />
        <div className="linha-genero-telefone">
          <div className="campo">
            <label>Seu Gênero</label>
            <select id="genero" name="genero" onChange={handleChange} required>
              <option value="" disabled selected hidden>
                Selecione
              </option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="campo">
            <label>Telefone Celular</label>
            <input
              type="text"
              name="telefone"
              placeholder="Telefone Celular"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <label>Seu E-Mail</label>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={handleChange}
          required
        />
        <label>Sua Senha</label>
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          onChange={handleChange}
          required
        />
        {erro && <p className="erro-texto">{erro}</p>}
        <button type="submit" className="btn-vermelho">
          Cadastrar
        </button>
      </form>
      <p className="link-login">
        Já tem conta?
        <button
          type="button"
          className="btn-cadastro"
          onClick={trocarParaLogin}
        >
          Faça login
        </button>
      </p>
    </div>
  );
};

export default FormularioCadastro;
