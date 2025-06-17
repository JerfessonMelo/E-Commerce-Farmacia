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
      const endpoint =
        indiceEdicao !== null
          ? `/usuarios/perfil/enderecos/${indiceEdicao}`
          : "/usuarios/perfil/enderecos";

      const metodo = indiceEdicao !== null ? api.put : api.post;

      const res = await metodo(endpoint, enderecoSelecionado, {
        headers: { Authorization: `Bearer ${obterToken()}` },
      });

      alert(
        indiceEdicao !== null
          ? "Endereço atualizado com sucesso!"
          : "Endereço adicionado com sucesso!"
      );
      setUsuario(res.data);
      setEnderecos(res.data.endereco || []);
      setModoEdicao(false);
      setEnderecoSelecionado(null);
      setIndiceEdicao(null);
    } catch (err) {
      alert("Erro ao salvar endereço.");
      console.error(err);
    }
  };

  const removerEndereco = async (index) => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      try {
        const res = await api.delete(`/usuarios/perfil/enderecos/${index}`, {
          headers: { Authorization: `Bearer ${obterToken()}` },
        });
        alert("Endereço removido com sucesso!");
        setUsuario(res.data);
        setEnderecos(res.data.endereco || []);
      } catch (err) {
        alert("Erro ao remover endereço.");
        console.error(err);
      }
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

        <div className="cabecalho-enderecos">
          <h3 className="titulo-enderecos">Endereços</h3>
          <button
            className="btn-vermelho btn-novo-endereco"
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
            <i className="fas fa-plus-circle"></i> Novo Endereço
          </button>
        </div>

        {enderecos.length === 0 ? (
          <p>Nenhum endereço cadastrado.</p>
        ) : (
          <div className="lista-enderecos">
            {enderecos.map((end, index) =>
              end && end.rua ? (
                <div key={index} className="linha-endereco">
                  <p>{`${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`}</p>
                  <div className="grupo-botoes-linha">
                    <button
                      className="btn-vermelho"
                      onClick={() => {
                        setEnderecoSelecionado(end);
                        setIndiceEdicao(index);
                        setModoEdicao(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-cinza"
                      onClick={() => removerEndereco(index)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ) : null
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
        )}
      </div>
    </div>
  );
};

export default Perfil;
