import React from "react";
import "../styles/CadastroDeEndereco.css";

const CadastroDeEndereco = ({
  endereco,
  setEndereco,
  onSalvar,
  onCancelar,
  modoEdicao,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEndereco((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-endereco">
      <h3>{modoEdicao ? "Editar Endereço" : "Novo Endereço"}</h3>

      <input
        type="text"
        name="rua"
        placeholder="Rua"
        value={endereco.rua || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="numero"
        placeholder="Número"
        value={endereco.numero || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="bairro"
        placeholder="Bairro"
        value={endereco.bairro || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="cidade"
        placeholder="Cidade"
        value={endereco.cidade || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="estado"
        placeholder="Estado"
        value={endereco.estado || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="cep"
        placeholder="CEP"
        value={endereco.cep || ""}
        onChange={handleChange}
      />

      <div className="grupo-botoes-endereco">
        <button onClick={onSalvar} className="btn-vermelho">
          {modoEdicao ? "Atualizar" : "Adicionar"}
        </button>
        {modoEdicao && (
          <button onClick={onCancelar} className="btn-cinza">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default CadastroDeEndereco;
