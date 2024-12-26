import  entitySlice  from "@/features/entities/EntitySlice";
import optionSlice  from "@/features/Options/OptionsSlice";
import fileSlice  from "@/features/pdf/fileSlice";
import ProgressSlice  from "@/features/progress/ProgressSlice";
import imageSlice from "@/features/image/imageSlice"
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    file:fileSlice,
    entity:entitySlice,
    options:optionSlice,
    ProgressSlice:ProgressSlice,
    image: imageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
