import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface FileState {
  fileUrl: string | null;
  entities: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  fileUrl: null,
  entities: [],
  loading: false,
  error: null,
};

// Async action to upload file and fetch entities
export const uploadFile = createAsyncThunk(
  "file/uploadFile",
  async (fileUrl: string, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/entities", {
        method: "POST",
        body: JSON.stringify({ fileUrl }), // Send file URL instead of File
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return data.entities; // Return the entities
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile(state, action) {
      const { url } = action.payload;
      state.fileUrl = url; // Store only the URL
    },
    clearFile(state) {
      state.fileUrl = null;
      state.entities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFile, clearFile } = fileSlice.actions;

export default fileSlice.reducer;
