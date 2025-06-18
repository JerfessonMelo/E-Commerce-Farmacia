import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { adicionarAoCarrinho } from "../services/carrinho";
import { obterDadosUsuario } from "../services/auth";
import Cabecalho from "../components/Cabecalho";
import SugestoesProdutos from "../components/SugestoesProdutos";
import "../styles/ProdutoDetalhe.css";

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [produtosRelacionados, setRelacionados] = useState([]);
  const [produtosSimilares, setSimilares] = useState([]);
  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ")[0];

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const res = await api.get(`/produtos/${id}`);
        setProduto(res.data);

        const categoria = res.data.categoria?.toLowerCase() || "";

        const relacionados = await api.get(`/produtos?categoria=${categoria}`);
        const similares = await api.get("/produtos");

        const filtradosRelacionados = relacionados.data.filter(
          (p) => p._id !== res.data._id
        );

        setRelacionados(filtradosRelacionados.slice(0, 10));
        setSimilares(similares.data.slice(0, 10));
      } catch (err) {
        console.error("Erro ao carregar produto ou sugestões:", err);
      }
    };

    carregarProduto();
  }, [id]);

  if (!produto) {
    return <div className="detalhe">Carregando produto...</div>;
  }

  return (
    <div className="produto-detalhe-container celular-container">
      <Cabecalho usuario={nomeUsuario} />

      <div className="detalhe">
        <img
          src={produto.imagemUrl || "/sem-imagem.png"}
          alt={produto.nome}
          className="imagem-produto"
        />

        <div className="info-produto">
          <h2>{produto.nome}</h2>
          <p>
            <strong>Marca:</strong> {produto.marca}
          </p>
          <p>
            <strong>Descrição:</strong> {produto.descricao}
          </p>
          <p>
            <strong>Categoria:</strong> {produto.categoria}
          </p>
          <p>
            <strong>Tipo de Produto:</strong> {produto.tipoProduto}
          </p>
          <p>
            <strong>Princípio Ativo:</strong>{" "}
            {produto.principioAtivo || "Não informado"}
          </p>
          <p>
            <strong>Faixa Etária:</strong> {produto.faixaEtaria}
          </p>
          <p>
            <strong>Estoque disponível:</strong> {produto.estoque}
          </p>
          <p className="preco">R$ {produto.preco.toFixed(2)}</p>

          <button
            onClick={() => {
              adicionarAoCarrinho(produto);
              alert("Produto adicionado ao carrinho!");
            }}
          >
            Adicionar ao carrinho
          </button>

          {produto.tags?.length > 0 && (
            <div className="tags-produto">
              <strong>Tags:</strong>{" "}
              {produto.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <SugestoesProdutos
        titulo="Quem comprou, também se interessou"
        produtos={produtosRelacionados}
      />

      <SugestoesProdutos
        titulo="Similares que você pode se interessar"
        produtos={produtosSimilares}
      />
    </div>
  );
};

export default ProdutoDetalhe;
