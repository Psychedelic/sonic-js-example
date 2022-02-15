import { Pair, Token } from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';
import { useSwapCanisterController } from '.';

export const useSwapCanisterLists = (): [Token.MetadataList?, Pair.List?] => {
  const controller = useSwapCanisterController();

  const [tokenList, setTokenList] = useState<Token.MetadataList>();
  const [pairList, setPairList] = useState<Pair.List>();

  useEffect(() => {
    if (controller) {
      // Getting token and pair lists using SwapCanisterController
      controller
        .getTokenList()
        .then((response) => Promise.resolve(setTokenList(response)))
        .then(() => controller.getPairList())
        .then((response) => setPairList(response));
    }
  }, [controller]);

  return [tokenList, pairList];
};
