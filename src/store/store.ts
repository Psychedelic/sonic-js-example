import { configureStore } from '@reduxjs/toolkit';

import plugReducer from '@/store/features/plug-slice';
import balanceReducer from '@/store/features/balance-slice';
import liquidityPositionReducer from '@/store/features/liquidity-position-slice';

export const store = configureStore({
  reducer: {
    plug: plugReducer,
    balance: balanceReducer,
    liquidityPosition: liquidityPositionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
