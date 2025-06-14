import React, { useState, useEffect } from "react";
import {
  obterCarrinho,
  removerDoCarrinho,
  limparCarrinho,
} from "../services/carrinho";
import { obterToken } from "../services/auth";
import { obterDadosUsuario } from "../services/auth";
import api from "../services/api";
import "../styles/Pedido.css";
import Cabecalho from "../components/Cabecalho";

const Pedido = () => {
  const [produtos, setProdutos] = useState([]);
  const [cep, setCep] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [freteInfo, setFreteInfo] = useState(null);
  const [frete, setFrete] = useState(0);
  const usuario = obterDadosUsuario() || {};
  const nomeUsuario = usuario.nome?.split(" ");

  useEffect(() => {
    setProdutos(obterCarrinho());
  }, []);

  const totalProdutos = produtos.reduce((soma, p) => soma + p.preco, 0);
  const totalGeral = totalProdutos + frete;

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
    <>
      <header className="home-header">
        <Cabecalho />
      </header>

      <div className="pedido">
        <h2>Seu Pedido</h2>

        {produtos.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul>
              {produtos.map((p) => (
                <li key={p._id}>
                  {p.nome} - R$ {p.preco.toFixed(2)}
                  <button
                    onClick={() => {
                      removerDoCarrinho(p._id);
                      setProdutos(obterCarrinho());
                    }}
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
            <button onClick={calcularFrete}>Calcular Frete</button>

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

            <button onClick={finalizarPedido}>Finalizar Pedido</button>
          </>
        )}
      </div>
    </>
  );
};

export default Pedido;
