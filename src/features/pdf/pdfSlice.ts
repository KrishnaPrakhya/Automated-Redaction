import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface PdfState {
  data: string | null; // Will store the PDF data (URL or blob URL)
  loading: boolean;
  error: string | null;
}

const initialState: PdfState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchPdf = createAsyncThunk(
  "pdf/fetchPdf",
  async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch PDF");
    const blob = await response.blob();
    return URL.createObjectURL(blob); // Convert to blob URL
  }
);

export const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    clearPdf: (state) => {
      if (state.data) URL.revokeObjectURL(state.data); // Revoke the URL to free memory
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching PDF";
      });
  },
});

export const { clearPdf } = pdfSlice.actions;
export default pdfSlice.reducer;
