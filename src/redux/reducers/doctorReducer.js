const initialState = {
  doctors: [],
};

export const doctorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DOCTORS":
      return { ...state, doctors: action.payload };

    case "ADD_DOCTOR":
      return { ...state, doctors: [...state.doctors, action.payload] };

    case "UPDATE_DOCTOR":
      return {
        ...state,
        doctors: state.doctors.map((d) =>
          d.id === action.payload.id ? action.payload : d,
        ),
      };

    case "DELETE_DOCTOR":
      return {
        ...state,
        doctors: state.doctors.map((doc) =>
          doc.id === action.payload.id ? action.payload : doc,
        ),
      };

    default:
      return state;
  }
};
