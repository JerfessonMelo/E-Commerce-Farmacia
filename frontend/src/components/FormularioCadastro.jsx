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
        <label>Nome Completo</label>
        <input
          type="text"
          name="nome"
          autoComplete="name"
          placeholder="Nome completo"
          onChange={handleChange}
          required
        />
        <label>Data Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          autoComplete="bday"
          placeholder="Data de Nascimento"
          onChange={handleChange}
          required
        />
        <div className="linha-genero-telefone">
          <div className="campo">
            <label>Seu Gênero</label>
            <select
              id="genero"
              name="genero"
              onChange={handleChange}
              required
              value={form.genero || ""}
              autoComplete="sex"
            >
              <option value="" disabled hidden>
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
              autoComplete="tel-national"
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
          autoComplete="email"
          placeholder="E-mail"
          onChange={handleChange}
          required
        />
        <label>Sua Senha</label>
        <input
          type="password"
          name="senha"
          autoComplete="new-password"
          placeholder="Senha"
          onChange={handleChange}
          required
        />
        {erro && <p className="erro-texto">{erro}</p>}
        <div className="botoes-iniciais">
          <button type="submit" className="btn-branco">
            <i className="fas fa-user-plus" />
            Cadastrar
          </button>
        </div>
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
