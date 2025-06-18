import React, { useRef } from "react";
import ProdutoCard from "./ProdutoCard";
import "../styles/SugestoesProdutos.css";

const SugestoesProdutos = ({ titulo, produtos }) => {
  const containerRef = useRef();

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 250;
    if (direction === "esquerda") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="sugestoes-container">
      <h3>{titulo}</h3>
      <div className="sugestoes-navegacao">
        <button onClick={() => scroll("esquerda")} className="seta">
          ⟨
        </button>
        <div className="sugestoes-lista" ref={containerRef}>
          {produtos.map((p) => (
            <ProdutoCard key={p._id} produto={p} />
          ))}
        </div>
        <button onClick={() => scroll("direita")} className="seta">
          ⟩
        </button>
      </div>
    </div>
  );
};

export default SugestoesProdutos;
