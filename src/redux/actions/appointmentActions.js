export const ADD_APPOINTMENT = "ADD_APPOINTMENT";
export const FETCH_APPOINTMENTS = "FETCH_APPOINTMENTS";
export const UPDATE_STATUS = "UPDATE_STATUS";

// Add appointment 
export const addAppointment = (data) => {
  return async (dispatch) => {
    const res = await fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        status: "pending"  
      }),
    });

    const result = await res.json();

    dispatch({
      type: ADD_APPOINTMENT,
      payload: result,
    });
  };
};

// Fetch appointments 
export const fetchAppointments = () => {
  return async (dispatch) => {
    const res = await fetch("http://localhost:5000/appointments");
    const data = await res.json();

    dispatch({
      type: FETCH_APPOINTMENTS,
      payload: data,
    });
  };
};

// Update appointment status
export const updateStatus = (id, status) => {
  return async (dispatch) => {
    const res = await fetch(
      `http://localhost:5000/appointments/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    const updated = await res.json();

    dispatch({
      type: UPDATE_STATUS,
      payload: updated,
    });
  };
};
