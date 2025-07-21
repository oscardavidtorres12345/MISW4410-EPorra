import "./RaceCreate.css";
import CustomInput from "../../components/CustomInput";
import AddList from "../../components/AddList";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { showAlert } from "../../utils/alert";

Swal.mixin({
  background: "#181818",
  color: "#fff",
  confirmButtonColor: "#ccf546",
});
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function RaceCreate() {
  const navigate = useNavigate();
  const [nameRace, setNameRace] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState(
    "Escribe el nombre oficial de la carrera"
  );

  const getNameRace = (e) => {
    const value = e.target.value;
    setNameRace(value);
    if (value.length > 50) {
      setNameError(true);
      setNameHelper(
        "El nombre de la carrera no puede superar los 50 caracteres"
      );
    } else {
      setNameError(false);
      setNameHelper("Escribe el nombre oficial de la carrera");
    }
  };

  const getCompetitors = (data) => {
    setCompetitors(data);
  };

  const isFormValid = () => {
    if (!nameRace.trim() || nameRace.length > 50) {
      return false;
    }

    if (competitors.length === 0) {
      return false;
    }

    const totalProbability = competitors.reduce((sum, competitor) => {
      const probability = parseFloat(competitor.secondFieldValue) || 0;
      return sum + probability;
    }, 0);

    return totalProbability > 0 && totalProbability <= 1;
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
      showAlert({
        icon: "error",
        title: "Error al crear la carrera",
        text: "Ocurrió un error al guardar la carrera. Por favor, intenta de nuevo.",
      });
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/carreras`);
      const carreras = response.data.data || [];
      const existe = carreras.some(
        (carrera) =>
          carrera.Nombre.trim().toLowerCase() === nameRace.trim().toLowerCase()
      );
      if (existe) {
        showAlert({
          icon: "error",
          title: "Nombre duplicado",
          text: "La carrera no se puede guardar porque ya existe otra carrera con el mismo nombre.",
        });
        return;
      }

      await createRace();
    } catch (error) {
      console.error(error);
    }
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
          helperText={nameHelper}
          error={nameError}
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
