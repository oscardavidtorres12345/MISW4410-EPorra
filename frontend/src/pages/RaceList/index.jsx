import CustomTable from "../../components/CustomTable";
import CustomButton from "../../components/CustomButton";
import "./RaceList.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

function RaceList() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const headers = ["Carrera"];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const actions = [
    { icon: "pencil" },
    { icon: "eye" },
    { icon: "sign-dead-end" },
    { icon: "trash" },
  ];

  const getRaceList = useCallback(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/carreras`)
      .then((response) => {
        const carreras = response.data.data || [];
        const carrerasData = carreras.map((carrera) => [carrera.Nombre]);
        setData(carrerasData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [BACKEND_URL]);

  useEffect(() => {
    getRaceList();
  }, [getRaceList]);

  return loading ? (
    <div className="loading">
      <Loading />
    </div>
  ) : (
    <div className="container">
      <div className="app-header-container">
        <h1 className="app-header-title">¡Bienvenido a E-Porra!</h1>
        <p className="app-header-subtitle">
          La manera más fácil y divertida de apostar
        </p>
      </div>
      <hr className="app-divider" />
      <div className="app-header-page">
        <h2 className="app-header-page-title">Lista de carreras</h2>
        <CustomButton onClick={() => navigate("/create")} variant="primary">
          Nueva Carrera
        </CustomButton>
      </div>
      <div className="table-wrapper" data-testid="table-wrapper">
        {data.length === 0 ? (
          <div className="no-carreras-msg">
            ¡Ups! parece que aun no hay carreras para mostrar :(
          </div>
        ) : (
          <CustomTable headers={headers} data={data} actions={actions} />
        )}
      </div>
    </div>
  );
}

export default RaceList;
