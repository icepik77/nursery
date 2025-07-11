import React, { createContext, useContext, useState } from "react";

const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
  });

  const [animals, setAnimals] = useState([]);

  const addAnimal = () => {
    if (formData.name && formData.birthdate) {
      setAnimals((prev) => [...prev, formData]);
      setFormData({ name: "", birthdate: "" }); // сбрасываем форму
    }
  };

  return (
    <FormContext.Provider
      value={{ formData, setFormData, animals, addAnimal }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
