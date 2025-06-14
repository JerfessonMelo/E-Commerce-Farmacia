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
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (erro) {
    console.error("Erro ao decodificar token:", erro);
    return null;
  }
};
