import { createSlice } from "@reduxjs/toolkit";



interface num{
  progressNum:number
  redactStatus:boolean
}
const initialState:num={
  progressNum:0,
  redactStatus:false
}

export const ProgressSlice=createSlice({
  name:'progress',
  initialState,
  reducers:{
    setProgressNum:(state,action)=>{
      state.progressNum=action.payload
    },
    setRedactStatus:(state,action)=>{
      state.redactStatus=action.payload
    }
  }
})

export const {setProgressNum,setRedactStatus}=ProgressSlice.actions
export default ProgressSlice.reducer
