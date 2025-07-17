import "./RaceCreate.css";
import CustomInput from "../../components/CustomInput";
import AddList from "../../components/AddList";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function RaceCreate() {
  const navigate = useNavigate();
  const [nameRace, setNameRace] = useState("");
  const [competitors, setCompetitors] = useState([]);

  const getNameRace = (e) => {
    setNameRace(e.target.value);
  };

  const getCompetitors = (data) => {
    setCompetitors(data);
  };

  const isFormValid = () => {
    if (!nameRace.trim()) {
      return false;
    }

    if (competitors.length === 0) {
      return false;
    }

    const totalProbability = competitors.reduce((sum, competitor) => {
      const probability = parseFloat(competitor.secondFieldValue) || 0;
      return sum + probability;
    }, 0);

    return totalProbability === 1;
  };

  const createRace = async () => {
    const competidores = competitors.map((c) => ({
      Nombre: c.firstFieldValue,
      Probabilidad: parseFloat(c.secondFieldValue),
    }));
    try {
      await axios.post(`${BACKEND_URL}/carreras`, {
        nombre: nameRace,
        competidores: competidores,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    createRace();
  };

  return (
    <div className="container">
      <div className="app-header-page" id="create">
        <div className="race-create-header">
          <CustomButton
            className="custom-btn-small"
            onClick={() => navigate("/")}
            variant="secondary"
          >
            <i class="bi bi-arrow-left"></i>
          </CustomButton>
          <h2 className="app-header-page-title">Crear carrera</h2>
        </div>
      </div>
      <p className="app-header-page-description">
        Ingresa el nombre de la carrera y sus competidores. La suma de sus
        probabilidades debe ser 1.
      </p>
      <div className="race-create-container">
        <CustomInput
          type="text"
          label="Nombre de la carrera"
          value={nameRace}
          onChange={getNameRace}
          placeholder="Ej: Gran Premio de Mónaco"
          helperText="Escribe el name oficial de la carrera"
        />

        <AddList
          label="Agregar competidores"
          firstField="Nombre"
          secondField="Probabilidad"
          firstFieldType="text"
          secondFieldType="number"
          onDataChange={getCompetitors}
        />

        <CustomButton
          onClick={handleSave}
          variant="primary"
          disabled={!isFormValid()}
        >
          Guardar
        </CustomButton>
      </div>
    </div>
  );
}

export default RaceCreate;
