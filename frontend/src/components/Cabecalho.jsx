import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  obterDadosUsuario,
  estaAutenticado,
  removerToken,
} from "../services/auth";
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
    <header className="header-drogaria">
      <Link className="logo" to="/">
        <img src="/logo.png" alt="Drogaria Poupe Já" />
      </Link>

      <div className="barra-busca">
        <input
          type="text"
          placeholder="O que você está buscando?"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && realizarBusca()}
        />
        <button onClick={realizarBusca}>
          <i className="fas fa-search" />
        </button>
      </div>

      <div className="acoes-usuario">
        {!usuario?.email && (
          <div className="acao">
            <i className="fas fa-user" />
            <Link to="/login">
              <span>
                Bem-vindo!
                <br />
                <strong>Entrar ou Cadastrar</strong>
              </span>
            </Link>
          </div>
        )}

        {usuario?.email && (
          <>
            <div className="acao">
              <i className="fas fa-user" />
              <span>
                Olá, <br />
                <strong>
                  {nomeUsuario[0]?.charAt(0).toUpperCase() +
                    nomeUsuario[0]?.slice(1)}
                </strong>
              </span>
            </div>

            <div className="acao">
              <i className="fas fa-id-card" />
              <Link to="/perfil">
                <span>
                  Acessar
                  <br />
                  <strong>Perfil</strong>
                </span>
              </Link>
            </div>

            {usuario.isAdmin && location.pathname !== "/admin" && (
              <div className="acao">
                <i className="fas fa-tools" />
                <Link to="/admin">
                  <span>
                    Painel
                    <br />
                    <strong>Admin</strong>
                  </span>
                </Link>
              </div>
            )}
          </>
        )}

        {!usuario?.isAdmin && (
          <div className="acao">
            <i className="fas fa-box" />
            <button
              onClick={() => alert("Funcionalidade em desenvolvimento")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span>
                Acompanhar
                <br />
                <strong>Pedidos</strong>
              </span>
            </button>
          </div>
        )}

        {!usuario?.isAdmin &&
          location.pathname !== "/pedido" &&
          location.pathname !== "/admin" && (
            <div className="acao">
              <i className="fas fa-shopping-basket" />
              <Link to="/pedido">
                <span>
                  Carrinho
                  <br />
                  <strong>R$ 0,00</strong>
                </span>
              </Link>
            </div>
          )}

        {usuario?.email && (
          <div className="acao">
            <i className="fas fa-sign-out-alt" />
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Cabecalho;
