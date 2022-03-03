import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

import { Pair } from '@psychedelic/sonic-js';

// Define a type for the slice state
interface LiquidityPositionState {
  lpList?: Pair.Balances;
  lpOf?: string;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: LiquidityPositionState = {
  lpOf: undefined,
  lpList: undefined,
  isLoading: false,
};

export const liquidityPositionSlice = createSlice({
  name: 'liquidityPosition',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLpList: (state, action: PayloadAction<Pair.Balances | undefined>) => {
      state.lpList = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLpOf: (state, action: PayloadAction<string | undefined>) => {
      state.lpOf = action.payload;
    },
  },
});

export const liquidityPositionActions = liquidityPositionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLiquidityPositionState = (state: RootState) =>
  state.liquidityPosition;

export default liquidityPositionSlice.reducer;
