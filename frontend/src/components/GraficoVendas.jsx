import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../services/api";
import { obterToken } from "../services/auth";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const GraficoVendas = () => {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await api.get("/admin/pedidos/grafico", {
          headers: { Authorization: `Bearer ${obterToken()}` },
        });
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao carregar gráfico:", err);
      }
    };

    carregarDados();
  }, []);

  if (!dados) return <p>Carregando gráfico...</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Gráfico de Vendas</h2>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Bar
          data={{
            labels: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
            datasets: [
              {
                label: "Mensal (R$)",
                data: dados.mensal,
                backgroundColor: "#007bff",
              },
            ],
          }}
        />

        <br />

        <Bar
          data={{
            labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
            datasets: [
              {
                label: "Últimos 7 dias (R$)",
                data: dados.diario,
                backgroundColor: "#28a745",
              },
            ],
          }}
        />

        <br />

        <Bar
          data={{
            labels: ["2022", "2023", "2024", "2025"],
            datasets: [
              {
                label: "Anual (R$)",
                data: dados.anual,
                backgroundColor: "#ffc107",
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default GraficoVendas;
