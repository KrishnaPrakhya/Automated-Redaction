import { createSlice, PayloadAction } from "@reduxjs/toolkit";




export interface EntityItem{
  text:string,
  label:string|undefined
}

export interface entityState{
  entitiesSelected:EntityItem[]
  entities:EntityItem[]
}
const initialState:entityState={
  entitiesSelected:[],
  entities:[]
}
export const entitySlice=createSlice({
  name:'entity',
  initialState,
  reducers:{

    addEntity: (state, action: PayloadAction<EntityItem>) => {
      console.log(action);
    
      const bool = state.entitiesSelected.every(
        (item) => item.text !== action.payload.text
      );
    
      console.log(bool);
    
      if (bool) state.entitiesSelected.push(action.payload);
    },
    removeEntity:(state,action:PayloadAction<string>)=>{
      state.entitiesSelected=state.entitiesSelected.filter((item)=>(item.text!==action.payload))
    },
    clearEntities: (state) => {
      state.entitiesSelected = [];
    },
  }

})
export const {addEntity,removeEntity,clearEntities}=entitySlice.actions

export default entitySlice.reducer