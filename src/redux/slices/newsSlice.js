import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// ✅ FETCH NEWS
export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  const querySnapshot = await getDocs(collection(db, 'news'));
  const news = [];
  querySnapshot.forEach((docItem) => {
    news.push({ id: docItem.id, ...docItem.data() });
  });
  return news;
});

// ✅ ADD NEWS
export const addNews = createAsyncThunk('news/addNews', async (newsData) => {
  const newData = {
    ...newsData,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'news'), newData);

  return { id: docRef.id, ...newData };
});

// ✅ UPDATE NEWS
export const updateNews = createAsyncThunk('news/updateNews', async ({ id, ...updatedData }) => {
  const newsRef = doc(db, 'news', id);

  await updateDoc(newsRef, updatedData);

  return { id, ...updatedData };
});

// ✅ DELETE NEWS
export const deleteNews = createAsyncThunk('news/deleteNews', async (id) => {
  await deleteDoc(doc(db, 'news', id));
  return id;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addNews.fulfilled, (state, action) => {
        state.news.push(action.payload);
      })

      // UPDATE
      .addCase(updateNews.fulfilled, (state, action) => {
        const index = state.news.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.news = state.news.filter(n => n.id !== action.payload);
      });
  },
});

export default newsSlice.reducer;