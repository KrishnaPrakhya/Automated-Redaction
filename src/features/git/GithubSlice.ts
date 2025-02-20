import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

// promise return 1)pending 2)Reject 3)fullfiled 
export const getAllData=createAsyncThunk<any[],void,{rejectValue:String}>("gitUsers",async(_,{rejectWithValue})=>{
  try{

    const response=await fetch("https://api.github.com/users");
    if(!response.ok){
      throw new Error("Failed to fetch data");
    }
    const result=await response.json();
    return result;
  }
  catch(err:any){
    return rejectWithValue(err.message || "Something went wrong");
  }
})


interface GitUserState{
    users:any[];
    loading:boolean;
    error:string|null;
}
const initialState:GitUserState={
  users:[],
  loading:false,
  error:null
}
export const gitUser=createSlice({
  name:'gitUser',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
    .addCase(getAllData.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(getAllData.fulfilled,(state,action)=>{
      state.loading=false;
      state.users=action.payload
    })
    .addCase(getAllData.rejected,(state,action)=>{
      state.loading=false;
      state.error="Failed to fetch"
    })
  }
})

export default gitUser.reducer