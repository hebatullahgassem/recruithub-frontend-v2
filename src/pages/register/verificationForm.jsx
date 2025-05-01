import React, { useState } from 'react';
import axios from 'axios';

export default function VerificationForm() {
  const [form, setForm] = useState({
    national_id: '',
    dob: '',
    national_id_img: null,
    selfie_img: null
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      if (form[key]) data.append(key, form[key]);
    }
    try {
      const res = await axios.post("/api/verify-id/", data);
      alert("Success: " + res.data.message);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || 'Verification failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="national_id" onChange={handleChange} required placeholder="National ID" />
      <input type="date" name="dob" onChange={handleChange} required />
      <input type="file" name="national_id_img" onChange={handleChange} required />
      <input type="file" name="selfie_img" onChange={handleChange} />
      <button type="submit">Verify</button>
    </form>
  );
}
