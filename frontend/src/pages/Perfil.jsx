import React, { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken, removerToken, estaAutenticado } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../components/Cabecalho";
import CadastroDeEndereco from "../components/CadastroDeEndereco";
import "../styles/Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const navigate = useNavigate();

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
        setEnderecos(res.data.endereco || []);
      } catch (err) {
        removerToken();
        alert("Sessão expirada, faça login novamente.");
        navigate("/login");
      }
    };

    carregarPerfil();
  }, [navigate]);

  const salvarEndereco = async () => {
    try {
      if (indiceEdicao !== null) {
        const res = await api.put(
          `/usuarios/perfil/enderecos/${indiceEdicao}`,
          enderecoSelecionado,
          {
            headers: {
              Authorization: `Bearer ${obterToken()}`,
            },
          }
        );
        alert("Endereço atualizado com sucesso!");
        setUsuario(res.data);
        setEnderecos(res.data.endereco || []);
      } else {
        const res = await api.post(
          "/usuarios/perfil/enderecos",
          enderecoSelecionado,
          {
            headers: {
              Authorization: `Bearer ${obterToken()}`,
            },
          }
        );
        alert("Endereço adicionado com sucesso!");
        setUsuario(res.data);
        setEnderecos(res.data.endereco || []);
      }

      setModoEdicao(false);
      setEnderecoSelecionado(null);
      setIndiceEdicao(null);
    } catch (err) {
      alert("Erro ao salvar endereço.");
      console.error(err);
    }
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

        <h3 style={{ color: "red", marginTop: "30px" }}>Endereços</h3>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setEnderecoSelecionado({
              rua: "",
              numero: "",
              bairro: "",
              cidade: "",
              estado: "",
              cep: "",
            });
            setIndiceEdicao(null);
            setModoEdicao(true);
          }}
        >
          + Novo Endereço
        </button>

        {enderecos.length === 0 ? (
          <p>Nenhum endereço cadastrado.</p>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {enderecos.map((end, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  listStyle: "none",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <p>{`${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`}</p>
                <button
                  style={{
                    marginBottom: "10px",
                    backgroundColor: "var(--primary-color)",
                  }}
                  onClick={() => {
                    setEnderecoSelecionado(end);
                    setIndiceEdicao(index);
                    setModoEdicao(true);
                  }}
                >
                  Alterar Endereço
                </button>
              </li>
            ))}
          </ul>
        )}

        {modoEdicao && (
          <CadastroDeEndereco
            endereco={enderecoSelecionado}
            setEndereco={setEnderecoSelecionado}
            onSalvar={salvarEndereco}
            onCancelar={() => {
              setModoEdicao(false);
              setEnderecoSelecionado(null);
              setIndiceEdicao(null);
            }}
            modoEdicao={indiceEdicao !== null}
          />
        )}
      </div>
    </div>
  );
};

export default Perfil;
