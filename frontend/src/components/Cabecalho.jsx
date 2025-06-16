import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  obterDadosUsuario,
  estaAutenticado,
  removerToken,
} from "../services/auth";
import ContadorSessao from "./ContadorSessao";
import "../styles/Cabecalho.css";

const Cabecalho = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (estaAutenticado()) {
      setUsuario(obterDadosUsuario());
    } else {
      setUsuario(null);
    }
  }, [location.pathname]);

  const nomeUsuario = usuario?.nome?.split(" ");
  const realizarBusca = () => {
    const destino = location.pathname === "/" ? "/" : "/produtos";
    navigate(`${destino}?busca=${encodeURIComponent(busca)}`);
  };

  const handleLogout = () => {
    removerToken();
    setUsuario(null);
    navigate("/login");
  };

  return (
    <header className="home-header">
      <Link to="/">
        <img src="/logo.png" alt="Drogaria Poupe Já" className="logo" />
      </Link>
      <ContadorSessao />
      <div className="barra-busca">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && realizarBusca()}
        />
        <button onClick={realizarBusca}>🔍</button>
      </div>
      <nav className="nav">
        {usuario?.nome && (
          <span className="usuario-nome">Olá, {nomeUsuario[0]}!</span>
        )}
        <Link to="/">Início</Link>
        {!usuario?.email && <Link to="/login">Entrar</Link>}
        {usuario?.email && <Link to="/perfil">Perfil</Link>}
        {location.pathname !== "/pedido" && location.pathname !== "/admin" && (
          <Link to="/pedido">Carrinho</Link>
        )}
        {usuario?.isAdmin && location.pathname !== "/admin" && (
          <Link to="/admin">Painel Admin</Link>
        )}
        {usuario?.email && (
          <Link to="#" onClick={handleLogout}>
            Sair
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Cabecalho;
