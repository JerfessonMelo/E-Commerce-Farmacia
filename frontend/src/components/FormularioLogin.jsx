import React, { useState } from "react";
import api from "../services/api";
import { salvarToken } from "../services/auth";
import "../styles/AuthForm.css";

const FormularioLogin = ({ trocarParaCadastro, aoLogar }) => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const logar = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await api.post("/usuarios/login", form);
      salvarToken(res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      alert("Login realizado com sucesso!");
      aoLogar(res.data.usuario);
    } catch (erro) {
      setErro(erro.response?.data?.mensagem || "Erro ao realizar login.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={logar}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          onChange={handleChange}
          required
        />
        {erro && <p className="erro-texto">{erro}</p>}
        <div className="botoes-iniciais">
          <button type="submit" className="btn-vermelho">
            <i className="fas fa-sign-in-alt" />
            Entrar
          </button>
        </div>
      </form>
      <p className="link-cadastro">
        Não tem conta?
        <button
          type="button"
          className="btn-cadastro"
          onClick={trocarParaCadastro}
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
};

export default FormularioLogin;
