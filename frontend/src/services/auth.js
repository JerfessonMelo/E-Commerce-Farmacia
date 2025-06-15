import { jwtDecode } from "jwt-decode";

export const salvarToken = (token) => {
  localStorage.setItem("token", token);
};

export const obterToken = () => {
  return localStorage.getItem("token");
};

export const removerToken = () => {
  localStorage.removeItem("token");
};

export const estaAutenticado = () => {
  return !!obterToken();
};

export const obterDadosUsuario = () => {
  const token = obterToken();
  if (!token) return null;

  try {
    const usuario = jwtDecode(token);
    return usuario;
  } catch (erro) {
    console.error("Erro ao decodificar token com jwt-decode:", erro);
    return null;
  }
};
