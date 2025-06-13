import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProdutoCard from "../components/ProdutoCard";
import { obterToken, removerToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [logado, setLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLogado(!!obterToken());
    const carregarProdutos = async () => {
      try {
        const resposta = await api.get("/produtos");
        setProdutos(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      }
    };
    carregarProdutos();
  }, []);

  const handleLogout = () => {
    removerToken();
    setLogado(false);
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
          <Link to="/">Início</Link>
          <Link to="/login">Entrar</Link>
          <Link to="/pedido">Carrinho</Link>
          <button
            onClick={() => {
              removerToken();
              window.location.href = "/login";
            }}
          >
            Sair
          </button>
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
