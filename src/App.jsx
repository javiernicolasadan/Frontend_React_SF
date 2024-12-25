import { useEffect, useState } from "react";
import "./App.css"; 
import REACT_APP_API_URL from './assets/config.js';

const App = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    commutingTypes: [],
    details: {}, // Save dates, distance, and cost for each type
    company: "",
  });

  const commutingOptions = [
    "Coche Personal",
    "Metro/Tren cercanías",
    "Tren media distancia",
    "Caminando-Bicicleta",
    "Taxi",
  ];
  //console.log(process.env.API_URL)
  // Handle changes in text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle selection of commuting types
  const handleCommutingChange = (e) => {
    const { value, checked } = e.target;
    let updatedCommutingTypes = [...formData.commutingTypes];

    if (checked) {
      // Add the selected commuting type
      updatedCommutingTypes.push(value);
    } else {
      // Remove the deselected commuting type

      updatedCommutingTypes = updatedCommutingTypes.filter(
        (type) => type !== value
      );
      // Remove details associated with this type
      const updatedDetails = { ...formData.details };
      delete updatedDetails[value];
      setFormData({ ...formData, details: updatedDetails });
    }

    setFormData({ ...formData, commutingTypes: updatedCommutingTypes });
  };

  // Handle changes in dates, distance, and cost
  const handleDetailChange = (e, commutingType) => {
    const { name, value } = e.target;
    const updatedDetails = {
      ...formData.details,
      [commutingType]: { ...formData.details[commutingType], [name]: value },
    };
    setFormData({ ...formData, details: updatedDetails });
  };

  // Form subbmission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, company, commutingTypes, details } = formData;
    // Generate and sen a record for each commuting type
    try {
      const responses = await Promise.all(
        commutingTypes.map(async (type) => {
          const payload = {
            name,
            company,
            type, // Commuting type
            startDate: details[type]?.startDate || "",
            endDate: details[type]?.endDate || "",
            distance: details[type]?.distance || 0,
            cost: details[type]?.cost || 0, // Only applies to certain types
          };
          // console.log("URL:", `${REACT_APP_API_URL}/commuting`);
          // console.log("Payload:", payload);
          // Send to backend
          const response = await fetch(`${REACT_APP_API_URL}/sf/commuting`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Error al enviar datos para ${type}`);
          }

          return response.json();
        })
      );

      console.log("Server responses:", responses);
      alert("Datos enviados con éxito");
    } catch (error) {
      console.error("Error with form submission:", error);
      alert("Error al enviar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="container">
      <h1 className="heading">Formulario de Commuting</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label className="label" htmlFor="name">
            Nombre
          </label>
          <input
            className="input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="label" htmlFor="company">
            Empresa
          </label>
          <input
            className="input"
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Commuting Types */}
        <div className="form-group">
          <label className="label">Tipos de Commuting</label>
          {commutingOptions.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.commutingTypes.includes(option)}
                  onChange={handleCommutingChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Details by Commuting Type */}
        {formData.commutingTypes.map((type) => (
          <div key={type} className="form-group">
            <h4 className="sub-heading">Detalles para {type}</h4>
            <div>
              <label className="label" htmlFor={`${type}-startDate`}>
                Fecha Inicial
              </label>
              <input
                className="input"
                type="date"
                id={`${type}-startDate`}
                name="startDate"
                value={formData.details[type]?.startDate || ""}
                onChange={(e) => handleDetailChange(e, type)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor={`${type}-endDate`}>
                Fecha Final
              </label>
              <input
                className="input"
                type="date"
                id={`${type}-endDate`}
                name="endDate"
                value={formData.details[type]?.endDate || ""}
                onChange={(e) => handleDetailChange(e, type)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor={`${type}-distance`}>
                Distancia (en km)
              </label>
              <input
                className="input"
                type="number"
                id={`${type}-distance`}
                name="distance"
                value={formData.details[type]?.distance || ""}
                onChange={(e) => handleDetailChange(e, type)}
                min="0"
                required
              />
            </div>
            {/* Travel cost field (only for Metro/Suburban Train, Medium-Distance Train, and Taxi) */}
            {["Metro/Tren cercanías", "Tren media distancia", "Taxi"].includes(
              type
            ) && (
              <div>
                <label className="label" htmlFor={`${type}-cost`}>
                  Coste del viaje (en €)
                </label>
                <input
                  className="input"
                  type="number"
                  id={`${type}-cost`}
                  name="cost"
                  value={formData.details[type]?.cost || ""}
                  onChange={(e) => handleDetailChange(e, type)}
                  min="0"
                  required
                />
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default App;
