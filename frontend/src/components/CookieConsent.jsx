import React, { useState, useEffect } from "react";
import "../styles/CookieConsent.css";

const CookieConsent = () => {
  const [exibir, setExibir] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setExibir(true);
    }
  }, []);

  const aceitar = () => {
    localStorage.setItem("cookieConsent", "true");
    setExibir(false);
  };

  if (!exibir) {
    return null;
  }

  return (
    <div className="cookie-consent">
      <p>
        Usamos cookies para melhorar sua experiência. Ao continuar navegando,
        você concorda com nossa política de cookies.
      </p>
      <button onClick={aceitar}>Aceitar</button>
    </div>
  );
};

export default CookieConsent;
