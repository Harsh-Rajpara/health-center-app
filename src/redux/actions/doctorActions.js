const API_URL = "http://localhost:5000/doctors";

// READ
export const fetchDoctors = () => {
  return async (dispatch) => {
    const res = await fetch(API_URL);
    const data = await res.json();

    dispatch({
      type: "GET_DOCTORS",
      payload: data,
    });
  };
};

// CREATE
export const addDoctor = (doctorData) => {
  return async (dispatch) => {
    const newDoctor = {
      ...doctorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };

    const res = await fetch("http://localhost:5000/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDoctor),
    });

    const data = await res.json();

    dispatch({
      type: "ADD_DOCTOR",
      payload: data,
    });
  };
};

// UPDATE
export const updateDoctor = (doctor) => {
  return async (dispatch) => {
    const updatedDoctor = {
      ...doctor,
      updatedAt: new Date().toISOString(), // ✅ only this changes
    };

    await fetch(`http://localhost:5000/doctors/${doctor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDoctor),
    });

    dispatch({
      type: "UPDATE_DOCTOR",
      payload: updatedDoctor,
    });
  };
};


// DELETE (soft delete)
export const deleteDoctor = (doctor) => {
  return async (dispatch) => {
    const updated = { ...doctor, isDeleted: true };

    await fetch(`${API_URL}/${doctor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    dispatch({
      type: "DELETE_DOCTOR",
      payload: updated, // ✅ send full object
    });
  };
};

