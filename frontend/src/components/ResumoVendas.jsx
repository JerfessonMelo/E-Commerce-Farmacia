import React, { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken } from "../services/auth";
import "../styles/ResumoVendas.css";

const ResumoVendas = () => {
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    const carregarResumo = async () => {
      try {
        const res = await api.get("/admin/pedidos/resumo", {
          headers: { Authorization: `Bearer ${obterToken()}` },
        });
        setResumo(res.data);
      } catch (err) {
        console.error("Erro ao carregar resumo:", err);
      }
    };

    carregarResumo();
  }, []);

  if (!resumo) return <p>Carregando resumo...</p>;

  return (
    <div className="resumo-vendas">
      <h2>Resumo de Vendas</h2>
      <div className="resumo-cards">
        <div className="card-resumo">
          <h4>Total Arrecadado</h4>
          <p>R$ {resumo.total.toFixed(2)}</p>
        </div>
        <div className="card-resumo">
          <h4>Total de Pedidos</h4>
          <p>{resumo.quantidade}</p>
        </div>
        <div className="card-resumo">
          <h4>Ticket Médio</h4>
          <p>R$ {resumo.ticketMedio.toFixed(2)}</p>
        </div>
        <div className="card-resumo">
          <h4>Acessos ao Site</h4>
          <p>{resumo.acessos || "N/D"}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumoVendas;
