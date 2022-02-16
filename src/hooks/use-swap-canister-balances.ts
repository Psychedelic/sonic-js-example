import {
  balanceActions,
  selectBalanceState,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Token } from '@psychedelic/sonic-js';
import { useCallback } from 'react';
import { useSwapCanisterController } from '.';

/**
 * Example of creating a custom hook for balances usage
 */
export const useSwapCanisterBalances = (): {
  balanceList?: Token.BalanceList;
  isLoading: boolean;
  updateBalanceList: (principalId?: string) => void;
  balanceOf: string | undefined;
} => {
  // Use the SwapCanisterController hook
  const controller = useSwapCanisterController();

  // Use states from store
  const { balanceList, isLoading, balanceOf } =
    useAppSelector(selectBalanceState);
  const dispatch = useAppDispatch();

  /**
   * Creating a function to get balances list and add it on redux store
   */
  const updateBalanceList = useCallback(
    (principalId?: string) => {
      if (controller) {
        // If no principalId is provided, let's get the agent principal to store
        if (!principalId) {
          controller
            .getAgentPrincipal()
            .then((agentPrincipal) =>
              dispatch(balanceActions.setBalanceOf(agentPrincipal.toString()))
            );
        } else {
          dispatch(balanceActions.setBalanceOf(principalId));
        }

        // Get balances from controller and manage app loading states
        dispatch(balanceActions.setIsLoading(true));
        controller
          .getTokenBalances(principalId)
          .then((response) => dispatch(balanceActions.setBalanceList(response)))
          .finally(() => dispatch(balanceActions.setIsLoading(false)));
      }
    },
    [controller, dispatch]
  );

  return { balanceList, isLoading, updateBalanceList, balanceOf };
};
