import React, { useState } from "react";
import FormularioLogin from "./FormularioLogin";
import FormularioCadastro from "./FormularioCadastro";
import "../styles/MenuLateralAutenticacao.css";

const MenuLateralAutenticacao = ({ fecharMenu, aoLogar }) => {
  const [etapa, setEtapa] = useState("inicio");

  return (
    <div className="menu-lateral-overlay">
      <div className="menu-lateral">
        <button className="btn-fechar" onClick={fecharMenu}>
          ×
        </button>

        {etapa === "inicio" && (
          <div className="boas-vindas">
            <img src="/logo.png" alt="Logo" className="logo-boas-vindas" />
            <h2>Boas-vindas!</h2>
            <p>Faça seu Login ou cadastro</p>

            <div className="botoes-iniciais">
              <button
                className="btn-vermelho"
                onClick={() => setEtapa("login")}
              >
                <i className="fas fa-sign-in-alt" />
                Entrar
              </button>
              <button
                className="btn-branco"
                onClick={() => setEtapa("cadastro")}
              >
                <i className="fas fa-user-plus" />
                Cadastrar
              </button>
            </div>
          </div>
        )}

        {etapa === "login" && (
          <>
            <FormularioLogin
              trocarParaCadastro={() => setEtapa("cadastro")}
              aoLogar={aoLogar}
            />
          </>
        )}

        {etapa === "cadastro" && (
          <>
            <button className="btn-voltar" onClick={() => setEtapa("inicio")}>
              <i className="fas fa-arrow-left" /> Voltar
            </button>
            <FormularioCadastro trocarParaLogin={() => setEtapa("login")} />
          </>
        )}
      </div>
    </div>
  );
};

export default MenuLateralAutenticacao;
