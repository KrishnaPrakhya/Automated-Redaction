import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EntityItem } from "../entities/EntitySlice";
interface options {
  level: string | null;
  redactionType: string | null;
  entities: EntityItem[]; 
}
const initialState: options = {
  level: null,
  redactionType: null,
  entities: [], 
};

export const optionSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<string>) => {
      state.level = action.payload;
    },
    setRedactionType: (state, action: PayloadAction<string>) => {
      state.redactionType = action.payload;
    },
    setEntities: (state, action: PayloadAction<EntityItem[]>) => {
      state.entities = action.payload; 
    },
    
  },
});

export const { setLevel, setEntities, setRedactionType } = optionSlice.actions;

export default optionSlice.reducer;
