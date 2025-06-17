import React, { useState, useEffect } from "react";
import {
  obterCarrinho,
  removerDoCarrinho,
  limparCarrinho,
} from "../services/carrinho";
import { obterToken, obterDadosUsuario } from "../services/auth";
import Cabecalho from "../components/Cabecalho";
import CadastroDeEndereco from "../components/CadastroDeEndereco";
import api from "../services/api";
import "../styles/Pedido.css";
import { useNavigate } from "react-router-dom";

const Pedido = () => {
  const [produtos, setProdutos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [frete, setFrete] = useState(0);
  const usuario = obterDadosUsuario() || {};
  const navigate = useNavigate();
  const [mostrarFormularioEndereco, setMostrarFormularioEndereco] =
    useState(false);

  const totalProdutos = produtos.reduce(
    (soma, p) => soma + p.preco * p.quantidade,
    0
  );
  const totalGeral = totalProdutos + frete;

  useEffect(() => {
    const carrinho = obterCarrinho().map((p) => ({
      ...p,
      quantidade: p.quantidade || 1,
    }));
    setProdutos(carrinho);

    carregarEnderecos();
  }, []);

  const [novoEndereco, setNovoEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const carregarEnderecos = async () => {
    try {
      const res = await api.get("/usuarios/perfil", {
        headers: { Authorization: `Bearer ${obterToken()}` },
      });
      const lista = res.data.endereco || [];
      setEnderecos(lista);
      if (lista.length > 0) {
        const e = lista[0];
        setEnderecoEntrega(`${e.rua}, ${e.numero} - ${e.bairro}`);
      }
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
    }
  };

  const finalizarPedido = async () => {
    try {
      await api.post(
        "/pedidos",
        {
          produtos: produtos.map((p) => ({
            produtoId: p._id,
            quantidade: p.quantidade,
          })),
          total: totalGeral,
          enderecoEntrega,
          frete,
        },
        {
          headers: {
            Authorization: `Bearer ${obterToken()}`,
          },
        }
      );
      alert("Pedido finalizado com sucesso!");
      limparCarrinho();
      setProdutos([]);
    } catch (err) {
      alert("Erro ao finalizar pedido");
      console.error(err);
    }
  };

  return (
    <div className="celular-container">
      <Cabecalho />
      <div className="pedido">
        <div className="col-esquerda">
          <div className="bloco">
            <h3>
              <i className="fas fa-shopping-cart"></i> Meu Carrinho
            </h3>
            <ul className="lista-produtos">
              {produtos.map((p) => (
                <li className="produto-item" key={p._id}>
                  <div className="produto-info">
                    <strong>{p.nome}</strong>
                    <p>R$ {p.preco.toFixed(2)}</p>
                  </div>
                  <input
                    type="number"
                    className="campo-quantidade"
                    value={p.quantidade}
                    min="1"
                    onChange={(e) => {
                      const novaQtd = parseInt(e.target.value) || 1;
                      setProdutos((prev) =>
                        prev.map((item) =>
                          item._id === p._id
                            ? { ...item, quantidade: novaQtd }
                            : item
                        )
                      );
                    }}
                  />
                  <button
                    className="btn-remover"
                    onClick={() => {
                      removerDoCarrinho(p._id);
                      setProdutos(obterCarrinho());
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bloco">
            <h3>
              <i className="fas fa-map-marker-alt"></i> Endereço de Entrega
            </h3>
            {enderecos.length > 0 ? (
              <select
                className="campo-texto"
                value={enderecoEntrega}
                onChange={(e) => setEnderecoEntrega(e.target.value)}
              >
                <option value="">Selecione um endereço</option>
                {enderecos
                  .filter((e) => e && e.rua)
                  .map((e, index) => (
                    <option
                      key={index}
                      value={`${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, ${e.cep}`}
                    >
                      {`${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, ${e.cep}`}
                    </option>
                  ))}
              </select>
            ) : (
              <>
                {!mostrarFormularioEndereco && (
                  <button
                    className="btn-acao"
                    onClick={() => setMostrarFormularioEndereco(true)}
                  >
                    <i className="fas fa-plus-circle"></i> Cadastrar Endereço de
                    Entrega
                  </button>
                )}

                {mostrarFormularioEndereco && (
                  <div>
                    <CadastroDeEndereco
                      endereco={novoEndereco}
                      setEndereco={setNovoEndereco}
                      modoEdicao={false}
                      onSalvar={async () => {
                        try {
                          await api.post(
                            "/usuarios/perfil/enderecos",
                            novoEndereco,
                            {
                              headers: {
                                Authorization: `Bearer ${obterToken()}`,
                              },
                            }
                          );
                          setMostrarFormularioEndereco(false);
                          setNovoEndereco({
                            rua: "",
                            numero: "",
                            bairro: "",
                            cidade: "",
                            estado: "",
                            cep: "",
                          });
                          await carregarEnderecos();
                        } catch (err) {
                          alert("Erro ao salvar endereço.");
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="col-direita">
          <div className="bloco resumo">
            <h3>
              <i className="fas fa-receipt"></i> Resumo
            </h3>
            <div className="resumo-linha">
              <span>Total Produtos:</span>
              <span>R$ {totalProdutos.toFixed(2)}</span>
            </div>
            <hr />
            <div className="resumo-linha total">
              <strong>Total Geral:</strong>
              <strong>R$ {totalGeral.toFixed(2)}</strong>
            </div>

            <button
              className="btn-acao"
              onClick={finalizarPedido}
              disabled={!enderecoEntrega}
            >
              <i className="fas fa-check-circle"></i> Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pedido;
