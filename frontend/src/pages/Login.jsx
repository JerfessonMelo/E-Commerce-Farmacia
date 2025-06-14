import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { salvarToken } from "../services/auth";
import { Link } from "react-router-dom";
import "../styles/AuthForm.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

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

      if (res.data.usuario.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        <button type="submit">Entrar</button>
      </form>
      <p className="link-cadastro">
        Não tem conta?
        <Link to="/cadastro" className="btn-cadastro">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default Login;
