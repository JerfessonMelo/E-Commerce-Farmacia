import React, { useState, useEffect } from "react";
import {
  obterCarrinho,
  removerDoCarrinho,
  limparCarrinho,
} from "../services/carrinho";
import { obterToken } from "../services/auth";
import { obterDadosUsuario } from "../services/auth";
import Cabecalho from "../components/Cabecalho";
import api from "../services/api";
import "../styles/Pedido.css";

const Pedido = () => {
  const [produtos, setProdutos] = useState([]);
  const [cep, setCep] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [freteInfo, setFreteInfo] = useState(null);
  const [frete, setFrete] = useState(0);
  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ");
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
            quantidade: 1,
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
        <h2>Seu Pedido</h2>

        {produtos.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul>
              {produtos.map((p) => (
                <li key={p._id}>
                  <div className="info-produto">
                    <strong>{p.nome}</strong>
                    <p>R$ {p.preco.toFixed(2)}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={p.quantidade}
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
                    className="campo-quantidade"
                  />

                  <button
                    onClick={() => {
                      removerDoCarrinho(p._id);
                      setProdutos(obterCarrinho());
                    }}
                    className="btn-remover"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <p>
              <strong>Total Produtos:</strong> R$ {totalProdutos.toFixed(2)}
            </p>

            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <button className="btn-acao" onClick={calcularFrete}>
              Calcular Frete
            </button>

            {freteInfo && (
              <div className="frete-info">
                <p>
                  <strong>Frete:</strong> R$ {freteInfo.Valor}
                </p>
                <p>
                  <strong>Prazo:</strong> {freteInfo.PrazoEntrega} dias
                </p>
              </div>
            )}

            <input
              type="text"
              placeholder="Endereço de Entrega"
              value={enderecoEntrega}
              onChange={(e) => setEnderecoEntrega(e.target.value)}
            />

            <p>
              <strong>Total Geral:</strong> R$ {totalGeral.toFixed(2)}
            </p>

            <button className="btn-acao" onClick={finalizarPedido}>
              Finalizar Pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pedido;
