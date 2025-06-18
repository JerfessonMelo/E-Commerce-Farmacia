import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Pedido from "./pages/Pedido";
import Perfil from "./pages/Perfil";
import Dashboard from "./pages/painelAdmin/Dashboard";
import ListaProdutos from "./components/ListaProdutos";
import ListaPedidos from "./components/ListaPedidos";
import ListaClientes from "./components/ListaClientes";
import CookieConsent from "./components/CookieConsent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/produtos" element={<ListaProdutos />} />
        <Route path="/admin/pedidos" element={<ListaPedidos />} />
        <Route path="/admin/clientes" element={<ListaClientes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <CookieConsent />
    </Router>
  );
}

export default App;
