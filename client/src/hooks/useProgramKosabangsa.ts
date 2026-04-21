import { useState } from "react";

export const useProgramKosabangsa = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pendaftaran berhasil dikirim! (Demo mode)");
    setShowForm(false);
  };

  return {
    showForm,
    setShowForm,
    handleSubmit
  };
};
