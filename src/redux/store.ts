import  entitySlice  from "@/features/entities/EntitySlice";
import gitUser  from "@/features/git/GithubSlice";
import optionSlice  from "@/features/Options/OptionsSlice";
import fileSlice  from "@/features/pdf/fileSlice";
import ProgressSlice  from "@/features/progress/ProgressSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    file:fileSlice,
    gitUser:gitUser,
    entity:entitySlice,
    options:optionSlice,
    ProgressSlice:ProgressSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
