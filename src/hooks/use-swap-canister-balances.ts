import {
  balanceActions,
  selectBalanceState,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Token } from '@psychedelic/sonic-js';
import { useCallback } from 'react';
import { useSwapCanisterController } from '.';

export const useSwapCanisterBalances = (): {
  balanceList?: Token.BalanceList;
  isLoading: boolean;
  updateBalanceList: (principalId?: string) => void;
  balanceOf: string | undefined;
} => {
  const controller = useSwapCanisterController();

  const { balanceList, isLoading, balanceOf } =
    useAppSelector(selectBalanceState);
  const dispatch = useAppDispatch();

  const updateBalanceList = useCallback(
    (principalId?: string) => {
      if (controller) {
        if (!principalId) {
          controller.getAgentPrincipal().then((agentPrincipal) => {
            dispatch(balanceActions.setBalanceOf(agentPrincipal.toString()));
          });
        } else {
          dispatch(balanceActions.setBalanceOf(principalId));
        }
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
