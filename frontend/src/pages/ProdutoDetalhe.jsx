import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { adicionarAoCarrinho } from "../services/carrinho";
import { obterDadosUsuario } from "../services/auth";
import Cabecalho from "../components/Cabecalho";
import "../styles/ProdutoDetalhe.css";

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ");

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const res = await api.get(`/produtos/${id}`);
        setProduto(res.data);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      }
    };
    carregarProduto();
  }, [id]);

  if (!produto) {
    return <div className="detalhe">Carregando produto...</div>;
  }

  return (
    <div className="produto-detalhe-container">
      <Cabecalho />

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
          <p className="preco">R$ {produto.preco.toFixed(2)}</p>
          <button
            onClick={() => {
              adicionarAoCarrinho(produto);
              alert("Produto adicionado ao carrinho!");
            }}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;
