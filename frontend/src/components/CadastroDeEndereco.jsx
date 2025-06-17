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

  const handleSalvar = () => {
    const camposObrigatorios = [
      "rua",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
    ];

    const camposVazios = camposObrigatorios.filter(
      (campo) => !endereco[campo] || endereco[campo].trim() === ""
    );

    if (camposVazios.length > 0) {
      alert(`Por favor, preencha todos os campos: ${camposVazios.join(", ")}`);
      return;
    }

    onSalvar();
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
        <button onClick={handleSalvar} className="btn-vermelho">
          <i className={`fas ${modoEdicao ? "fa-check" : "fa-plus"}`}></i>{" "}
          {modoEdicao ? "Atualizar" : "Adicionar"}
        </button>
        {modoEdicao && (
          <button onClick={onCancelar} className="btn-cinza">
            <i className="fas fa-times"></i> Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default CadastroDeEndereco;
