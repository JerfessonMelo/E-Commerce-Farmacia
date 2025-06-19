import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Cabecalho from "../../components/Cabecalho";
import ListaClientes from "../../components/ListaClientes";
import ListaProdutos from "../../components/ListaProdutos";
import RelatorioVendas from "../../components/RelatorioVendas";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [dados, setDados] = useState({
    usuarios: 0,
    produtos: 0,
    pedidos: 0,
  });

  const [relatorioAtivo, setRelatorioAtivo] = useState(null);

  const carregarDados = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setDados(res.data);
    } catch (erro) {
      console.error("Erro ao carregar dados do painel:", erro);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="celular-container">
      <Cabecalho />
      <div className="dashboard">
        <h2>Painel Administrativo</h2>

        {relatorioAtivo && (
          <button
            className="btn-voltar"
            onClick={() => setRelatorioAtivo(null)}
          >
            <i className="fas fa-arrow-left"></i> Voltar ao Painel
          </button>
        )}

        {relatorioAtivo === null && (
          <div className="dashboard-cards">
            <div className="card" onClick={() => setRelatorioAtivo("usuarios")}>
              <h3>Usuários</h3>
              <p>{dados.usuarios}</p>
            </div>
            <div className="card" onClick={() => setRelatorioAtivo("produtos")}>
              <h3>Produtos Ativos</h3>
              <p>{dados.produtos}</p>
            </div>
            <div className="card" onClick={() => setRelatorioAtivo("pedidos")}>
              <h3>Pedidos</h3>
              <p>{dados.pedidos}</p>
            </div>
          </div>
        )}

        {relatorioAtivo === "usuarios" && <ListaClientes />}
        {relatorioAtivo === "produtos" && <ListaProdutos />}
        {relatorioAtivo === "pedidos" && <RelatorioVendas />}
      </div>
    </div>
  );
};

export default Dashboard;
