import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProdutoCard from "../components/ProdutoCard";
import { obterToken, removerToken, obterDadosUsuario } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Home.css";

console.log("API base:", process.env.REACT_APP_API_URL);

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ");

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const resposta = await api.get("/produtos");
        console.log("Produtos carregados:", resposta.data); // Debug
        setProdutos(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      }
    };

    carregarProdutos();
  }, []);

  const handleLogout = () => {
    removerToken();
    navigate("/login");
  };

  return (
    <div className="home">
      {/* Cabeçalho */}
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

      {/* Banner */}
      <section className="home-banner">
        <h1>Bem-vindo à Drogaria Poupe Já</h1>
        <p>Os melhores preços em medicamentos e saúde para sua família</p>
      </section>

      {/* Lista de Produtos */}
      <section className="home-produtos">
        <h2>Produtos em Destaque</h2>
        <div className="lista-produtos">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <ProdutoCard key={produto._id} produto={produto} />
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="home-footer">
        <p>
          &copy; {new Date().getFullYear()} Drogaria Poupe Já. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
