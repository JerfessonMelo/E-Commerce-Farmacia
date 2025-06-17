import React, { useState, useEffect } from "react";
import {
  obterCarrinho,
  removerDoCarrinho,
  limparCarrinho,
} from "../services/carrinho";
import { obterToken, obterDadosUsuario } from "../services/auth";
import Cabecalho from "../components/Cabecalho";
import api from "../services/api";
import "../styles/Pedido.css";

const Pedido = () => {
  const [produtos, setProdutos] = useState([]);
  const [cep, setCep] = useState("");
  const [enderecosDisponiveis, setEnderecosDisponiveis] = useState([]);
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [freteInfo, setFreteInfo] = useState(null);
  const [frete, setFrete] = useState(0);
  const usuario = obterDadosUsuario() || {};
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
  }, []);

  const calcularFrete = async () => {
    try {
      const res = await api.post("/frete/calcular", {
        cepDestino: cep,
        peso: 1,
        comprimento: 20,
        altura: 10,
        largura: 15,
      });
      setFreteInfo(res.data);
      setFrete(parseFloat(res.data.Valor.replace(",", ".")));

      const endRes = await api.get(`/usuarios/perfil/enderecos?cep=${cep}`, {
        headers: { Authorization: `Bearer ${obterToken()}` },
      });

      setEnderecosDisponiveis(endRes.data);
      if (endRes.data.length === 1) {
        const e = endRes.data[0];
        setEnderecoEntrega(`${e.rua}, ${e.numero} - ${e.bairro}`);
      } else {
        setEnderecoEntrega("");
      }
    } catch (err) {
      alert("Erro ao calcular o frete.");
      console.error(err);
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
    <div>
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
            <div className="linha-cep-frete">
              <input
                type="text"
                className="campo-cep"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <button className="btn-calcular-frete" onClick={calcularFrete}>
                <i className="fas fa-truck"></i> Calcular
              </button>
            </div>

            {freteInfo && (
              <>
                {enderecosDisponiveis.length > 0 ? (
                  <select
                    className="campo-texto"
                    value={enderecoEntrega}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                  >
                    <option value="">Selecione um endereço</option>
                    {enderecosDisponiveis.map((e, index) => (
                      <option key={index} value={e.logradouro}>
                        {`${e.logradouro}, ${e.numero} - ${e.bairro}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="campo-texto"
                    placeholder="Rua, número, bairro..."
                    value={enderecoEntrega}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                  />
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

            {freteInfo && (
              <>
                <div className="resumo-linha">
                  <span>Frete:</span>
                  <span>R$ {freteInfo.Valor}</span>
                </div>
                <div className="resumo-linha">
                  <span>Prazo:</span>
                  <span>{freteInfo.PrazoEntrega} dias</span>
                </div>
              </>
            )}

            <hr />
            <div className="resumo-linha total">
              <strong>Total Geral:</strong>
              <strong>R$ {totalGeral.toFixed(2)}</strong>
            </div>

            <button className="btn-acao" onClick={finalizarPedido}>
              <i className="fas fa-check-circle"></i> Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pedido;
