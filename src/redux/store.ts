import  entitySlice  from "@/features/entities/EntitySlice";
import optionSlice  from "@/features/Options/OptionsSlice";
import ProgressSlice  from "@/features/progress/ProgressSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    entity:entitySlice,
    options:optionSlice,
    ProgressSlice:ProgressSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
