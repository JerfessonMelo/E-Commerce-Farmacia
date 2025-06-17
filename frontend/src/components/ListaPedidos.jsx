import React, { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken } from "../services/auth";
import "../styles/ListaPedidos.css";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const res = await api.get("/admin/pedidos", {
          headers: {
            Authorization: `Bearer ${obterToken()}`,
          },
        });
        setPedidos(res.data);
      } catch (err) {
        alert("Erro ao carregar pedidos");
        console.error(err);
      }
    };

    carregarPedidos();
  }, []);

  return (
    <div className="lista-pedidos">
      <h2>Pedidos Recebidos</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produtos</th>
              <th>Total</th>
              <th>Endereço</th>
              <th>Frete</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido._id}>
                <td>{pedido.usuarioId?.nome || "Anônimo"}</td>
                <td>
                  <ul>
                    {pedido.produtos.map((p, idx) => (
                      <li key={idx}>
                        {p.produtoId?.nome || "Produto removido"}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>R$ {pedido.total.toFixed(2)}</td>
                <td>{pedido.enderecoEntrega}</td>
                <td>R$ {parseFloat(pedido.frete).toFixed(2)}</td>
                <td>
                  {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaPedidos;
