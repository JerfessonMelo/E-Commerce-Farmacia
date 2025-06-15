import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProdutoCard.css";

const ProdutoCard = ({ produto }) => {
  const navigate = useNavigate();

  return (
    <div className="produto-card">
      <img
        src={`https://e-commerce-farmacia.onrender.com${produto.imagemUrl}`}
        alt={produto.nome}
        className="imagem-produto"
      />
      <h3>{produto.nome}</h3>
      <p>Marca: {produto.marca}</p>
      <p className="preco">R$ {produto.preco.toFixed(2)}</p>
      <button onClick={() => navigate(`/produto/${produto._id}`)}>
        Ver Detalhes
      </button>
    </div>
  );
};

export default ProdutoCard;
