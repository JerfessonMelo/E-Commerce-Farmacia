import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { obterDadosUsuario, removerToken } from "../services/auth";
import ContadorSessao from "./ContadorSessao";
import "../styles/Home.css";

const Cabecalho = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      <ContadorSessao />
      <nav>
        {usuario.nome && (
          <span className="usuario-nome">Olá, {nomeUsuario}!</span>
        )}
        <Link to="/">Início</Link>
        {!usuario.email && <Link to="/login">Entrar</Link>}
        {usuario.email && <Link to="/perfil">Perfil</Link>}
        {location.pathname !== "/pedido" && location.pathname !== "/admin" && (
          <Link to="/pedido">Carrinho</Link>
        )}
        {usuario.isAdmin && location.pathname !== "/admin" && (
          <Link to="/admin">Painel Admin</Link>
        )}
        {usuario.email && (
          <button className="btn-sair" onClick={handleLogout}>
            Sair
          </button>
        )}
      </nav>
    </header>
  );
};

export default Cabecalho;
