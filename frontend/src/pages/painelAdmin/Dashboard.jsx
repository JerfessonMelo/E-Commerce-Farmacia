import React, { useEffect, useState } from "react";
import { obterToken } from "../../services/auth";
import Cabecalho from "../../components/Cabecalho";
import api from "../../services/api";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [dados, setDados] = useState({
    usuarios: 0,
    produtos: 0,
    pedidos: 0,
    cadastroProdutos: 0,
  });

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    imagemUrl: "",
  });

  const carregarDados = async () => {
    try {
      const token = obterToken();
      const res = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDados(res.data);
    } catch (erro) {
      console.error("Erro ao carregar dados do painel:", erro);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrarProduto = async () => {
    try {
      const token = obterToken();
      await api.post(
        "/produtos",
        {
          ...novoProduto,
          preco: parseFloat(novoProduto.preco),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Produto cadastrado com sucesso!");
      setNovoProduto({
        nome: "",
        descricao: "",
        preco: "",
        marca: "",
        imagemUrl: "",
      });
      carregarDados();
    } catch (erro) {
      alert("Erro ao cadastrar produto");
      console.error(erro);
    }
  };

  return (
    <div>
      <Cabecalho />
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
          <div className="card">
            <h3>Cadastro Produto</h3>
            <p>{dados.cadastroProdutos}</p>
          </div>
          <div className="cadastro-produto">
            <h3>Cadastrar Novo Produto</h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoProduto.nome}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Descrição"
              value={novoProduto.descricao}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, descricao: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Preço"
              value={novoProduto.preco}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, preco: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Marca"
              value={novoProduto.marca}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, marca: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={novoProduto.imagemUrl}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, imagemUrl: e.target.value })
              }
            />
            <button onClick={handleCadastrarProduto}>Cadastrar Produto</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
