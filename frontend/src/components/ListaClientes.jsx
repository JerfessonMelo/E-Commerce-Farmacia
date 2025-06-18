import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ListaClientes.css";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const res = await api.get("/admin/usuarios");
        setClientes(res.data);
      } catch (err) {
        alert("Erro ao carregar clientes");
        console.error(err);
      }
    };

    carregarClientes();
  }, []);

  return (
    <div className="lista-clientes">
      <h2>Clientes Cadastrados</h2>
      {clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Administrador?</th>
              <th>Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.isAdmin ? "Sim" : "Não"}</td>
                <td>
                  {new Date(cliente.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaClientes;
