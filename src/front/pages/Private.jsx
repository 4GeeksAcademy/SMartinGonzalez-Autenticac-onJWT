import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/private`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Error de autenticación");
        }

        setMessage(data.msg);
        setIsLoading(false);
      } catch (err) {
        console.error("Error de autenticación:", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h2>Página Privada</h2>
        </div>
        <div className="card-body">
          <h4>Bienvenido a la página privada</h4>
          <p className="alert alert-info mt-3">{message}</p>
          <p>Has iniciado sesión como: <strong>{store.user?.email || "Usuario"}</strong></p>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Private;