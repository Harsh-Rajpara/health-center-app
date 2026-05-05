import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

// 🔥 FETCH APPOINTMENTS
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));

    console.log("🔥 Firestore docs:", querySnapshot.docs);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("🔥 Mapped data:", data);

    return data;
  }
);

// 🔥 UPDATE STATUS
export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status, reason }) => {
    const ref = doc(db, "appointments", id);

    await updateDoc(ref, {
      status,
      rejectionReason: reason || "",
    });

    return { id, status, reason };
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE STATUS
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const { id, status, reason } = action.payload;

        const index = state.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          state.appointments[index].status = status;
          state.appointments[index].rejectionReason = reason;
        }
      });
  },
});

export default appointmentSlice.reducer;