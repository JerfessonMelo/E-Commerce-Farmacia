import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { obterToken } from "../../services/auth";
import Cabecalho from "../../components/Cabecalho";
import CadastroProduto from "../../components/CadastroProduto";
import ListaClientes from "./ListaClientes";
import ListaProdutos from "./ListaProdutos";
import RelatorioVendas from "../../components/RelatorioVendas";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [dados, setDados] = useState({
    usuarios: 0,
    produtos: 0,
    pedidos: 0,
  });

  const [relatorioAtivo, setRelatorioAtivo] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    imagemUrl: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idProdutoEditando, setIdProdutoEditando] = useState(null);

  const carregarDados = async () => {
    try {
      const token = obterToken();

      const [dashboardRes, produtosRes] = await Promise.all([
        api.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/produtos"),
      ]);

      setDados(dashboardRes.data);
      setProdutos(produtosRes.data);
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

      if (modoEdicao && idProdutoEditando) {
        await api.put(
          `/produtos/${idProdutoEditando}`,
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
        alert("Produto atualizado com sucesso!");
      } else {
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
      }

      setNovoProduto({
        nome: "",
        descricao: "",
        preco: "",
        marca: "",
        imagemUrl: "",
      });
      setModoEdicao(false);
      setIdProdutoEditando(null);
      carregarDados();
    } catch (erro) {
      alert("Erro ao salvar produto");
      console.error(erro);
    }
  };

  return (
    <div>
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

        {relatorioAtivo === null && (
          <div className="cadastro-produto">
            <h3>{modoEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}</h3>

            <CadastroProduto
              produtoInicial={novoProduto}
              setProduto={setNovoProduto}
              modoEdicao={modoEdicao}
              onSalvar={handleCadastrarProduto}
              onCancelar={() => {
                setModoEdicao(false);
                setIdProdutoEditando(null);
                setNovoProduto({
                  nome: "",
                  descricao: "",
                  preco: "",
                  marca: "",
                  imagemUrl: "",
                });
              }}
            />

            <div className="lista-produtos-admin">
              <h3>Produtos Cadastrados</h3>
              <ul>
                {produtos.map((produto) => (
                  <li key={produto._id}>
                    <strong>{produto.nome}</strong> - R${" "}
                    {parseFloat(produto.preco).toFixed(2)}{" "}
                    <button
                      onClick={() => {
                        setNovoProduto({
                          nome: produto.nome,
                          descricao: produto.descricao,
                          preco: produto.preco,
                          marca: produto.marca,
                          imagemUrl: produto.imagemUrl,
                        });
                        setModoEdicao(true);
                        setIdProdutoEditando(produto._id);
                      }}
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
