import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthForm.css";

const CadastroUsuario = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    try {
      await api.post("/usuarios/registro", form);
      salvarToken(res.data.token);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (err) {
      alert("Erro ao cadastrar: " + err.response?.data?.mensagem);
    }
  };

  return (
    <div className="auth-form">
      <h2>Cadastro</h2>
      <form onSubmit={cadastrar}>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          onChange={handleChange}
          required
        />
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
        <button type="submit">Cadastrar</button>
      </form>
      <p className="link-login">
        Já tem conta?
        <Link to="/login" className="btn-cadastro">
          Faça login
        </Link>
      </p>
    </div>
  );
};

export default CadastroUsuario;
