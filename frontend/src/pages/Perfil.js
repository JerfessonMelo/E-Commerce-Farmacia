import React, { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken, removerToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const res = await api.get("/usuarios/perfil", {
          headers: {
            Authorization: `Bearer ${obterToken()}`,
          },
        });
        setUsuario(res.data);
      } catch (err) {
        alert("Erro ao carregar perfil");
        navigate("/login");
      }
    };

    carregarPerfil();
  }, [navigate]);

  const sair = () => {
    removerToken();
    navigate("/login");
  };

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="perfil">
      <h2>Meu Perfil</h2>
      <p>
        <strong>Nome:</strong> {usuario.nome}
      </p>
      <p>
        <strong>Email:</strong> {usuario.email}
      </p>
      <p>
        <strong>Tipo:</strong> {usuario.isAdmin ? "Administrador" : "Cliente"}
      </p>
      <button onClick={sair}>Sair</button>
    </div>
  );
};

export default Perfil;
