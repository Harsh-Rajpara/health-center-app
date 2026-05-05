import {
  ADD_APPOINTMENT,
  FETCH_APPOINTMENTS,
  UPDATE_STATUS,
} from "../actions/appointmentActions";

const initialState = {
  appointments: [],
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };

    case FETCH_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
      };

    case UPDATE_STATUS:
      return {
        ...state,
        appointments: state.appointments.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    default:
      return state;
  }
};

export default appointmentReducer;
