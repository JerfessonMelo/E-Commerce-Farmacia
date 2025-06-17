import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProdutoCard from "../components/ProdutoCard";
import { obterToken, removerToken, obterDadosUsuario } from "../services/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Cabecalho from "../components/Cabecalho";
import "../styles/Home.css";

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [ordenacao, setOrdenacao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const termoBusca = params.get("busca")?.toLowerCase() || "";
  const usuario = obterDadosUsuario() || {};

  useEffect(() => {
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

  let filtrados = produtos
    .filter((p) =>
      [p.nome, p.descricao, p.marca].some((campo) =>
        campo?.toLowerCase().includes(termoBusca)
      )
    )
    .filter((p) =>
      categoriaSelecionada
        ? p.categoria?.toLowerCase() === categoriaSelecionada
        : true
    );

  if (ordenacao === "nome-asc")
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
  if (ordenacao === "nome-desc")
    filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
  if (ordenacao === "preco-asc") filtrados.sort((a, b) => a.preco - b.preco);
  if (ordenacao === "preco-desc") filtrados.sort((a, b) => b.preco - a.preco);

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paginaProdutos = filtrados.slice(inicio, fim);

  return (
    <div className="home celular-container">
      <Cabecalho />

      <section className="home-banner">
        <h1>Bem-vindo à Drogaria Poupe Já</h1>
        <p>Os melhores preços em medicamentos e saúde para sua família</p>
      </section>

      <section className="home-produtos">
        <h2>Produtos em Destaque</h2>

        <section className="filtros">
          <select onChange={(e) => setCategoriaSelecionada(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="vitaminas">Vitaminas</option>
            <option value="analgésicos">Analgésicos</option>
            <option value="higiene">Higiene</option>
          </select>

          <select onChange={(e) => setOrdenacao(e.target.value)}>
            <option value="">Ordenar por</option>
            <option value="nome-asc">Nome (A-Z)</option>
            <option value="nome-desc">Nome (Z-A)</option>
            <option value="preco-asc">Preço (menor)</option>
            <option value="preco-desc">Preço (maior)</option>
          </select>
        </section>

        <div className="lista-produtos">
          {paginaProdutos.length > 0 ? (
            paginaProdutos.map((produto) => (
              <ProdutoCard key={produto._id} produto={produto} />
            ))
          ) : (
            <p>Nenhum produto encontrado para "{termoBusca}".</p>
          )}
        </div>

        <div className="paginacao">
          {Array.from({
            length: Math.ceil(filtrados.length / itensPorPagina),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPaginaAtual(i + 1)}
              className={paginaAtual === i + 1 ? "ativo" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      <footer className="home-footer celular-foote">
        <p>
          &copy; {new Date().getFullYear()} Drogaria Poupe Já. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
