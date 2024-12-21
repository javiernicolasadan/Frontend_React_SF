import { useEffect, useState } from "react";
import "./App.css"; // Archivo de estilos externo

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    commutingTypes: [],
    details: {}, // Guarda fechas, distancia y coste para cada tipo
    company: "",
  });

  const commutingOptions = [
    "Coche Personal",
    "Metro/Tren cercanías",
    "Tren media distancia",
    "Caminando-Bicicleta",
    "Taxi",
  ];

  // Manejo de cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de selección de tipos de commuting
  const handleCommutingChange = (e) => {
    const { value, checked } = e.target;
    let updatedCommutingTypes = [...formData.commutingTypes];

    if (checked) {
      // Agregar el tipo de commuting seleccionado
      updatedCommutingTypes.push(value);
    } else {
      // Quitar el tipo de commuting deseleccionado
      updatedCommutingTypes = updatedCommutingTypes.filter((type) => type !== value);
      // Remover detalles asociados a este tipo
      const updatedDetails = { ...formData.details };
      delete updatedDetails[value];
      setFormData({ ...formData, details: updatedDetails });
    }

    setFormData({ ...formData, commutingTypes: updatedCommutingTypes });
  };

  // Manejo de cambios en fechas, distancia y coste
  const handleDetailChange = (e, commutingType) => {
    const { name, value } = e.target;
    const updatedDetails = {
      ...formData.details,
      [commutingType]: { ...formData.details[commutingType], [name]: value },
    };
    setFormData({ ...formData, details: updatedDetails });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    try {
      const response = await fetch("http://localhost:3000/sf/commuting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="container">
      <h1 className="heading">Formulario de Commuting</h1>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-group">
          <label className="label" htmlFor="name">Nombre</label>
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

        {/* Empresa */}
        <div className="form-group">
          <label className="label" htmlFor="company">Empresa</label>
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

        {/* Tipos de Commuting */}
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

        {/* Detalles por Tipo de Commuting */}
        {formData.commutingTypes.map((type) => (
          <div key={type} className="form-group">
            <h4 className="sub-heading">Detalles para {type}</h4>
            <div>
              <label className="label" htmlFor={`${type}-startDate`}>Fecha Inicial</label>
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
              <label className="label" htmlFor={`${type}-endDate`}>Fecha Final</label>
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
              <label className="label" htmlFor={`${type}-distance`}>Distancia (en km)</label>
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
            {/* Campo de coste del viaje (solo para Metro/Tren cercanías, Tren media distancia, y Taxi) */}
            {["Metro/Tren cercanías", "Tren media distancia", "Taxi"].includes(type) && (
              <div>
                <label className="label" htmlFor={`${type}-cost`}>Coste del viaje (en €)</label>
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

        {/* Botón de Enviar */}
        <button className="button" type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default App;
