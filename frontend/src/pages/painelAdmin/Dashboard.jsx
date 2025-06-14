import React, { useEffect, useState } from "react";
import { obterToken } from "../../services/auth";
import api from "../../services/api";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [dados, setDados] = useState({
    usuarios: 0,
    produtos: 0,
    pedidos: 0,
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = obterToken();
        const res = await api.get("/admin/dashboard");
        setDados(res.data);
      } catch (erro) {
        console.error("Erro ao carregar dados do painel:", erro);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="dashboard">
      <h2>Painel Administrativo</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Usuários</h3>
          <p>{dados.usuarios}</p>
        </div>
        <div className="card">
          <h3>Produtos Ativos</h3>
          <p>{dados.produtos}</p>
        </div>
        <div className="card">
          <h3>Pedidos</h3>
          <p>{dados.pedidos}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
