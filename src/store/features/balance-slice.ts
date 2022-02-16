import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

import { Token } from '@psychedelic/sonic-js';

// Define a type for the slice state
interface BalanceState {
  balanceList?: Token.BalanceList;
  balanceOf?: string;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: BalanceState = {
  balanceOf: undefined,
  balanceList: undefined,
  isLoading: false,
};

export const balanceSlice = createSlice({
  name: 'balance',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setBalanceList: (
      state,
      action: PayloadAction<Token.BalanceList | undefined>
    ) => {
      state.balanceList = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBalanceOf: (state, action: PayloadAction<string | undefined>) => {
      state.balanceOf = action.payload;
    },
  },
});

export const balanceActions = balanceSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBalanceState = (state: RootState) => state.balance;

export default balanceSlice.reducer;
