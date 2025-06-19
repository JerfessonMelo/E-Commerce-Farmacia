import React, { useEffect, useState } from "react";
import api from "../services/api";
import CadastroProduto from "./CadastroProduto";
import "../styles/ListaProdutos.css";

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const novoProdutoVazio = {
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    categoria: "",
    principioAtivo: "",
    faixaEtaria: "",
    tipoProduto: "",
    tags: "",
  };

  const carregarProdutos = async () => {
    try {
      const res = await api.get("/produtos/todos");
      setProdutos(res.data);
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const alterarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/produtos/${id}/status`, { ativo: novoStatus });
      carregarProdutos();
    } catch {
      alert("Erro ao alterar status");
    }
  };

  const salvarProduto = async (produto, imagem) => {
    try {
      const formData = new FormData();
      Object.entries(produto).forEach(([key, val]) =>
        formData.append(key, val)
      );
      if (imagem) formData.append("imagem", imagem);

      if (modoEdicao && produto._id) {
        await api.put(`/produtos/${produto._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Produto atualizado com sucesso!");
      } else {
        await api.post("/produtos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Produto cadastrado com sucesso!");
      }

      setMenuAberto(false);
      setModoEdicao(false);
      setProdutoAtual(null);
      carregarProdutos();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
      alert("Erro ao salvar produto");
    }
  };

  return (
    <div className="admin-lista-produtos">
      <h2>Gerenciamento de Produtos</h2>

      <button
        className="btn-cadastrar"
        onClick={() => {
          setProdutoAtual(null);
          setModoEdicao(false);
          setMenuAberto(true);
        }}
      >
        <i className="fas fa-plus"></i> Cadastrar Produto
      </button>

      {menuAberto && (
        <div className="menu-flutuante-overlay">
          <div className="menu-flutuante">
            <button
              className="btn-fechar-menu"
              onClick={() => {
                setMenuAberto(false);
                setProdutoAtual(null);
                setModoEdicao(false);
              }}
            >
              <i className="fas fa-arrow-left"></i> Voltar
            </button>

            <CadastroProduto
              produtoInicial={produtoAtual || novoProdutoVazio}
              modoEdicao={modoEdicao}
              onSalvar={salvarProduto}
              onCancelar={() => {
                setMenuAberto(false);
                setProdutoAtual(null);
                setModoEdicao(false);
              }}
            />
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p._id}>
              <td>{p.nome}</td>
              <td>{p.marca}</td>
              <td>R$ {p.preco.toFixed(2)}</td>
              <td>{p.ativo ? "Ativo" : "Inativo"}</td>
              <td>
                <button
                  onClick={() => alterarStatus(p._id, !p.ativo)}
                  className={p.ativo ? "btn-desativar" : "btn-ativar"}
                >
                  <i
                    className={p.ativo ? "fas fa-eye-slash" : "fas fa-eye"}
                  ></i>{" "}
                  {p.ativo ? "Desativar" : "Ativar"}
                </button>
                <button
                  className="btn-editar"
                  onClick={() => {
                    setProdutoAtual(p);
                    setModoEdicao(true);
                    setMenuAberto(true);
                  }}
                >
                  <i className="fas fa-edit"></i> Alterar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProdutos;
