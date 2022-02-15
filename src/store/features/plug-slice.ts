import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

import { Principal } from '@dfinity/principal';

// Define a type for the slice state
interface PlugState {
  principal?: Principal;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: PlugState = {
  principal: undefined,
  isLoading: false,
};

export const plugSlice = createSlice({
  name: 'plug',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPrincipal: (state, action: PayloadAction<Principal | undefined>) => {
      state.principal = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const plugActions = plugSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlugState = (state: RootState) => state.plug;

export default plugSlice.reducer;
