import React, { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken, removerToken, estaAutenticado } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../components/Cabecalho";
import CadastroDeEndereco from "../components/CadastroDeEndereco";
import "../styles/Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  useEffect(() => {
    if (usuario?.endereco) {
      setEndereco(usuario.endereco);
    }
  }, [usuario]);

  const atualizarEndereco = async () => {
    try {
      const res = await api.put("/usuarios/perfil/endereco", endereco, {
        headers: {
          Authorization: `Bearer ${obterToken()}`,
        },
      });
      alert("Endereço atualizado com sucesso!");
      setUsuario(res.data);
    } catch (err) {
      alert("Erro ao atualizar endereço.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }

    const carregarPerfil = async () => {
      try {
        const res = await api.get("/usuarios/perfil", {
          headers: {
            Authorization: `Bearer ${obterToken()}`,
          },
        });
        setUsuario(res.data);
      } catch (err) {
        removerToken();
        alert("Sessão expirada, faça login novamente.");
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
    <div>
      <Cabecalho />
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
        <CadastroDeEndereco
          endereco={endereco}
          setEndereco={setEndereco}
          onSalvar={atualizarEndereco}
        />
        <button onClick={sair}>Sair</button>
      </div>
    </div>
  );
};

export default Perfil;
