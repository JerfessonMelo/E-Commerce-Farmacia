import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { obterDadosUsuario, removerToken } from "../services/auth";
import "../styles/Home.css";

const Cabecalho = () => {
  const navigate = useNavigate();
  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ");

  const handleLogout = () => {
    removerToken();
    navigate("/login");
  };

  return (
    <header className="home-header">
      <Link to="/">
        <img src="/logo.png" alt="Drogaria Poupe Já" className="logo" />
      </Link>
      <nav>
        {usuario.nome && (
          <span className="usuario-nome">Olá, {nomeUsuario}!</span>
        )}
        <Link to="/">Início</Link>
        {!usuario.email && <Link to="/login">Entrar</Link>}
        {usuario.email && <Link to="/perfil">Perfil</Link>}
        {usuario.isAdmin && <Link to="/admin">Painel Admin</Link>}
        <Link to="/pedido">Carrinho</Link>
        {usuario.email && (
          <button className="sair-btn" onClick={handleLogout}>
            Sair
          </button>
        )}
      </nav>
    </header>
  );
};

export default Cabecalho;
