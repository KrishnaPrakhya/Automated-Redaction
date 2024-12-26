import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUrl: "", 
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
  },
});

export const { setImageUrl } = imageSlice.actions;
export default imageSlice.reducer;
