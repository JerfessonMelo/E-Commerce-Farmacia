import React, { useState } from "react";
import FormularioLogin from "./FormularioLogin";
import FormularioCadastro from "./FormularioCadastro";
import "../styles/MenuLateralAutenticacao.css";

const MenuLateralAutenticacao = ({ fecharMenu, aoLogar }) => {
  const [aba, setAba] = useState("login");

  return (
    <div className="menu-lateral-overlay">
      <div className="menu-lateral">
        <button className="btn-fechar" onClick={fecharMenu}>
          ×
        </button>

        <div className="abas-auth">
          <button
            className={aba === "login" ? "ativa" : ""}
            onClick={() => setAba("login")}
          >
            Entrar
          </button>
          <button
            className={aba === "cadastro" ? "ativa" : ""}
            onClick={() => setAba("cadastro")}
          >
            Cadastrar
          </button>
        </div>

        {aba === "login" ? (
          <FormularioLogin
            trocarParaCadastro={() => setAba("cadastro")}
            aoLogar={aoLogar}
          />
        ) : (
          <FormularioCadastro trocarParaLogin={() => setAba("login")} />
        )}
      </div>
    </div>
  );
};

export default MenuLateralAutenticacao;
