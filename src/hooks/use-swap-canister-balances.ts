import { Token } from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';
import { useSwapCanisterController } from '.';

export const useSwapCanisterBalances = (
  principalId?: string
): { balances?: Token.BalanceList; isLoading: boolean } => {
  const controller = useSwapCanisterController();

  const [balances, setBalances] = useState<Token.BalanceList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (controller) {
      setIsLoading(true);
      controller
        .getTokenBalances(principalId)
        .then((response) => setBalances(response))
        .finally(() => setIsLoading(false));
    }
  }, [controller]);

  return { balances, isLoading };
};
