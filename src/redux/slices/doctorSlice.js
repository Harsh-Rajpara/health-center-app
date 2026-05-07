import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Get doctors
export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async () => {
  const querySnapshot = await getDocs(collection(db, 'doctors'));
  const doctors = [];
  querySnapshot.forEach((doc) => {
    doctors.push({ id: doc.id, ...doc.data() });
  });
  return doctors;
});

// Add doctor
export const addDoctor = createAsyncThunk('doctors/addDoctor', async (doctorData) => {
  const docRef = await addDoc(collection(db, 'doctors'), {
    ...doctorData,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...doctorData };
});

// Update doctor
export const updateDoctor = createAsyncThunk('doctors/updateDoctor', async ({ id, ...updatedData }) => {
  const doctorRef = doc(db, 'doctors', id);
  await updateDoc(doctorRef, updatedData);
  return { id, ...updatedData };
});

// Delete doctor
export const deleteDoctor = createAsyncThunk('doctors/deleteDoctor', async (id) => {
  await deleteDoc(doc(db, 'doctors', id));
  return id;
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(d => d.id !== action.payload);
      });
  }
});

export default doctorSlice.reducer;