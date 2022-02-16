import { useSwapCanisterBalances, useSwapCanisterController } from '@/hooks';
import { useSwapCanisterLists } from '@/hooks/use-swap-canister-lists';
import { selectPlugState, useAppSelector } from '@/store';
import { Token, Swap } from '@psychedelic/sonic-js';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export const SwapSection = () => {
  const { principal } = useAppSelector(selectPlugState);
  const { pairList, tokenList } = useSwapCanisterLists();
  const controller = useSwapCanisterController();
  const { updateBalanceList } = useSwapCanisterBalances();

  const [from, setFrom] = useState<Token.Data>({ amount: '' });
  const [to, setTo] = useState<Token.Data>({ amount: '' });

  const [isSwapRunning, setIsSwapRunning] = useState<boolean>(false);

  const toOptionsList = useMemo(() => {
    if (!pairList || !tokenList || !from.metadata) return {};
    return Swap.getTokenPaths({
      pairList,
      tokenList,
      tokenId: from.metadata.id,
      amount: from.amount,
    });
  }, [from, pairList, tokenList]);

  const submitSwap = useCallback(() => {
    if (!controller || !from.metadata || !to.metadata) return;
    setIsSwapRunning(true);
    controller
      .swap({
        amountIn: from.amount,
        tokenIn: from.metadata.id,
        tokenOut: to.metadata.id,
      })
      .then(() => Promise.resolve(updateBalanceList()))
      .catch((error) => alert(`Swap failed: ${error}`))
      .finally(() => setIsSwapRunning(false));
  }, [controller, from, to]);

  if (!principal) {
    return (
      <section>
        <h1>Swap</h1>
        <span>Connect to plug to do swaps</span>
      </section>
    );
  }

  if (!tokenList || !pairList) {
    return (
      <section>
        <h1>Swap</h1>
        <span>Connect to plug to do swaps</span>
      </section>
    );
  }

  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFrom({ ...from, amount: e.currentTarget.value });
    if (to.metadata) {
      setTo({
        ...to,
        amount: toOptionsList[to.metadata?.id].amountOut.toString(),
      });
    }
  };

  const handleFromTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFrom({ ...from, metadata: tokenList[e.currentTarget.value] });
    setTo({ metadata: undefined, amount: '' });
  };

  const handleToTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const metadata = tokenList[e.currentTarget.value];
    setTo({
      metadata,
      amount: toOptionsList[metadata.id].amountOut.toString(),
    });
  };

  return (
    <section>
      <h1>Swap</h1>
      {isSwapRunning ? (
        <span>Swap in progress...</span>
      ) : (
        <>
          <div>
            From:
            <select name="from" onChange={handleFromTokenChange}>
              <option
                disabled
                selected
                value=""
                style={{ display: 'none' }}
              ></option>
              {Object.values(tokenList).map((token) => (
                <option value={token.id} key={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={from.amount}
              onChange={handleFromAmountChange}
            />
          </div>

          <div>
            To:
            <select name="to" onChange={handleToTokenChange}>
              <option selected value="" style={{ display: 'none' }}></option>
              {Object.keys(toOptionsList).map((tokenId) => (
                <option value={tokenId} key={tokenId}>
                  {tokenList[tokenId].symbol}
                </option>
              ))}
            </select>
            <input type="number" disabled value={to.amount} />
          </div>

          <button onClick={submitSwap}>Swap</button>
        </>
      )}
    </section>
  );
};
