import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ListaProdutos.css";

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);

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
    } catch (err) {
      alert("Erro ao alterar status");
    }
  };

  return (
    <div className="admin-lista-produtos">
      <h2>Lista de Produtos</h2>
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
                  {p.ativo ? "Desativar" : "Ativar"}
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
