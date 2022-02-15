import { Pair, Token } from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';
import { useSwapCanisterController } from '.';

export const useSwapCanisterLists = (): {
  tokenList?: Token.MetadataList;
  pairList?: Pair.List;
  isLoading: boolean;
} => {
  const controller = useSwapCanisterController();

  const [tokenList, setTokenList] = useState<Token.MetadataList>();
  const [pairList, setPairList] = useState<Pair.List>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (controller) {
      // Getting token and pair lists using SwapCanisterController
      setIsLoading(true);
      controller
        .getTokenList()
        .then((response) => Promise.resolve(setTokenList(response)))
        .then(() => controller.getPairList())
        .then((response) => setPairList(response))
        .finally(() => setIsLoading(false));
    }
  }, [controller]);

  return { tokenList, pairList, isLoading };
};
