import {
  liquidityPositionActions,
  selectLiquidityPositionState,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Pair } from '@psychedelic/sonic-js';
import { useCallback } from 'react';
import { useSwapCanisterController } from '.';

/**
 * Example of creating a custom hook for balances usage
 */
export const useSwapCanisterLiquidityPosition = (): {
  lpList?: Pair.Balances;
  isLoading: boolean;
  updateLpList: (principalId?: string) => void;
  lpOf: string | undefined;
} => {
  // Use the SwapCanisterController hook
  const controller = useSwapCanisterController();

  // Use states from store
  const { lpList, isLoading, lpOf } = useAppSelector(
    selectLiquidityPositionState
  );
  const dispatch = useAppDispatch();

  /**
   * Creating a function to get liquidity position list and add it on redux store
   */
  const updateLpList = useCallback(
    (principalId?: string) => {
      if (controller) {
        // If no principalId is provided, let's get the agent principal to store
        if (!principalId) {
          controller
            .getAgentPrincipal()
            .then((agentPrincipal) =>
              dispatch(
                liquidityPositionActions.setLpOf(agentPrincipal.toString())
              )
            )
            .catch((error) => alert(error));
        } else {
          dispatch(liquidityPositionActions.setLpOf(principalId));
        }

        // Get balances from controller and manage app loading states
        dispatch(liquidityPositionActions.setIsLoading(true));
        controller
          .getLPBalances(principalId)
          .then((response) =>
            dispatch(liquidityPositionActions.setLpList(response))
          )
          .catch((error) => alert(error))
          .finally(() =>
            dispatch(liquidityPositionActions.setIsLoading(false))
          );
      }
    },
    [controller, dispatch]
  );

  return { lpList, isLoading, updateLpList, lpOf };
};
