import { Pair, Token } from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';
import { useSwapCanisterController } from '.';

/**
 * Example of creating a custom hook for swap lists usage
 */
export const useSwapCanisterLists = (): {
  tokenList?: Token.MetadataList;
  pairList?: Pair.List;
  isLoading: boolean;
} => {
  // Use the SwapCanisterController hook
  const controller = useSwapCanisterController();

  // Create stats for the hook
  const [tokenList, setTokenList] = useState<Token.MetadataList>();
  const [pairList, setPairList] = useState<Pair.List>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Creating a effect that will be triggered always when controller changes
   */
  useEffect(() => {
    if (controller) {
      setIsLoading(true);
      // Getting token and pair lists using the controller and managing states
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
