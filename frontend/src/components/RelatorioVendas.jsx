import React from "react";
import ResumoVendas from "./ResumoVendas";
import GraficoVendas from "./GraficoVendas";
import ListaPedidos from "./ListaPedidos";

const RelatorioVendas = () => {
  return (
    <div>
      <ResumoVendas />
      <GraficoVendas />
      <ListaPedidos />
    </div>
  );
};

export default RelatorioVendas;
