import { createSlice } from "@reduxjs/toolkit";



interface num{
  progressNum:number
}
const initialState:num={
  progressNum:0
}

export const ProgressSlice=createSlice({
  name:'progress',
  initialState,
  reducers:{
    setProgressNum:(state,action)=>{
      state.progressNum=action.payload
    }
  }
})

export const {setProgressNum}=ProgressSlice.actions
export default ProgressSlice.reducer
