// src/services/auth.js
export const salvarToken = (token) => {
  localStorage.setItem("token", token);
};

export const obterToken = () => {
  return localStorage.getItem("token");
};

export const removerToken = () => {
  localStorage.removeItem("token");
};
