export const salvarToken = () => {};

export const obterToken = () => null;

export const removerToken = () => {
  localStorage.removeItem("usuario");
};

export const estaAutenticado = () => {
  return !!localStorage.getItem("usuario");
};

export const obterDadosUsuario = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};
