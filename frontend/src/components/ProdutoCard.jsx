import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProdutoCard.css";

const ProdutoCard = ({ produto }) => {
  const navigate = useNavigate();

  return (
    <div className="produto-card">
      <div className="produto-img-wrapper">
        <img
          src={`https://e-commerce-farmacia.onrender.com${produto.imagemUrl}`}
          alt={produto.nome}
          className="imagem-produto"
        />
      </div>
      <h3>{produto.nome}</h3>
      <p>Marca: {produto.marca}</p>
      {produto.tipoProduto && <p>Tipo: {produto.tipoProduto}</p>}
      {produto.categoria && <p>Categoria: {produto.categoria}</p>}
      <p className="preco">R$ {produto.preco.toFixed(2)}</p>
      <button onClick={() => navigate(`/produto/${produto._id}`)}>
        Ver Detalhes
      </button>
    </div>
  );
};

export default ProdutoCard;
