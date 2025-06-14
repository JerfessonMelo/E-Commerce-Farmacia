import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Pedido from "./pages/Pedido";
import Dashboard from "./pages/painelAdmin/Dashboard";
import CadastroProduto from "./pages/painelAdmin/CadastroProduto";
import ListaProdutos from "./pages/painelAdmin/ListaProdutos";
import ListaPedidos from "./pages/painelAdmin/ListaPedidos";
import ListaClientes from "./pages/painelAdmin/ListaClientes";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/produtos" element={<ListaProdutos />} />
        <Route path="/admin/cadastro-produto" element={<CadastroProduto />} />
        <Route path="/admin/pedidos" element={<ListaPedidos />} />
        <Route path="/admin/clientes" element={<ListaClientes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
