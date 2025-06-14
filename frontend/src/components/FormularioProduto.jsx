import React from "react";

const FormularioProduto = ({
  novoProduto,
  setNovoProduto,
  handleSalvarProduto,
  modoEdicao,
  cancelarEdicao,
}) => {
  return (
    <div className="cadastro-produto">
      <h3>{modoEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}</h3>
      <input
        type="text"
        placeholder="Nome"
        value={novoProduto.nome}
        onChange={(e) =>
          setNovoProduto({ ...novoProduto, nome: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Descrição"
        value={novoProduto.descricao}
        onChange={(e) =>
          setNovoProduto({ ...novoProduto, descricao: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Preço"
        value={novoProduto.preco}
        onChange={(e) =>
          setNovoProduto({ ...novoProduto, preco: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Marca"
        value={novoProduto.marca}
        onChange={(e) =>
          setNovoProduto({ ...novoProduto, marca: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="URL da Imagem"
        value={novoProduto.imagemUrl}
        onChange={(e) =>
          setNovoProduto({ ...novoProduto, imagemUrl: e.target.value })
        }
      />

      <button onClick={handleSalvarProduto}>
        {modoEdicao ? "Atualizar Produto" : "Cadastrar Produto"}
      </button>

      {modoEdicao && (
        <button
          onClick={cancelarEdicao}
          style={{ backgroundColor: "#ccc", marginTop: "8px" }}
        >
          Cancelar Edição
        </button>
      )}
    </div>
  );
};

export default FormularioProduto;
