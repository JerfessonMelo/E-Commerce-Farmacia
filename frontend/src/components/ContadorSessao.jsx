import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { obterToken, salvarToken } from "../services/auth";
import api from "../services/api";
import "../styles/ContadorSessao.css";

const ContadorSessao = () => {
  const [tempoRestante, setTempoRestante] = useState(null);

  const calcularTempoRestante = () => {
    const token = obterToken();
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.isAdmin);
      const exp = decoded.exp * 1000;
      const agora = Date.now();
      const restante = exp - agora;
      setTempoRestante(restante > 0 ? restante : 0);
    } catch (err) {
      console.error("Erro ao decodificar o token:", err);
      setTempoRestante(0);
    }
  };

  useEffect(() => {
    calcularTempoRestante();
    const intervalo = setInterval(calcularTempoRestante, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const formatarTempo = (ms) => {
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}m ${segundos}s`;
  };

  const renovarSessao = async () => {
    try {
      const resposta = await api.post("/usuarios/renovar-token", null, {
        headers: {
          Authorization: `Bearer ${obterToken()}`,
        },
      });

      salvarToken(resposta.data.token);
      alert("Sessão renovada com sucesso!");
      calcularTempoRestante();
    } catch (erro) {
      alert("Erro ao renovar sessão");
      console.error(erro);
    }
  };

  if (!isAdmin || tempoRestante === null) return null;

  return (
    <div className="contador-sessao">
      <span>
        Sessão expira em:{" "}
        <strong>
          {tempoRestante > 0 ? formatarTempo(tempoRestante) : "Expirada"}
        </strong>
      </span>
      <button onClick={renovarSessao}>Renovar (+1h)</button>
    </div>
  );
};

export default ContadorSessao;
