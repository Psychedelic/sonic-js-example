import { useSwapCanisterBalances, useSwapCanisterController } from '@/hooks';
import { useSwapCanisterLists } from '@/hooks/use-swap-canister-lists';
import { selectPlugState, useAppSelector } from '@/store';
import { Token, Swap, Default } from '@psychedelic/sonic-js';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

/**
 * Swap Section React Component
 * Example of a component that executes a swap
 */
export const SwapSection = () => {
  // Use custom hooks to get data and app states
  const { pairList, tokenList } = useSwapCanisterLists();
  const controller = useSwapCanisterController();
  const { updateBalanceList } = useSwapCanisterBalances();
  const { principal } = useAppSelector(selectPlugState);

  /**
   * Create states used for swap.
   * Notice that we are using Token.Data type because it have amount
   * and metadata keys.
   */
  const [from, setFrom] = useState<Token.Data>({ amount: '0' });
  const [to, setTo] = useState<Token.Data>({ amount: '0' });
  const [isSwapRunning, setIsSwapRunning] = useState<boolean>(false);

  /**
   * One extra state will be generated every time that "from" changes,
   * this state will hold the paths available to swap based on "from".
   */
  const toOptionsList = useMemo(() => {
    if (!pairList || !tokenList || !from.metadata) return {};
    return Swap.getTokenPaths({
      pairList,
      tokenList,
      tokenId: from.metadata.id,
      amount: from.amount,
    });
  }, [from, pairList, tokenList]);

  /**
   * Create a handler for swapping tokens using the controller and
   * managing app states
   */
  const handleSwap = useCallback(() => {
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

  // If there is no principal we can't swap
  if (!principal) {
    return (
      <section>
        <h1>Swap</h1>
        <span>Connect to plug to do swaps</span>
      </section>
    );
  }

  // Await fetching tokenList and pairList
  if (!tokenList || !pairList) {
    return (
      <section>
        <h1>Swap</h1>
        <span>Loading...</span>
      </section>
    );
  }

  /**
   * Create a handler for changing the "from" amount
   *
   * Notice that we are getting again the token paths to update the "to" amount
   * using "Swap.getTokenPaths", now with "amount" param. The "amount" param
   * can change the final result of the paths. This can happen when the reserves
   * for swapping a pair of tokens is lower than the amount in the "from" token.
   * The function "Swap.getTokenPaths" will always return the path that results
   * in the higher amount of the resultant token.
   */
  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.currentTarget.value;
    setFrom({ ...from, amount });

    if (from.metadata && to.metadata) {
      const paths = Swap.getTokenPaths({
        pairList,
        tokenList,
        amount,
        tokenId: from.metadata.id,
      });
      setTo({
        ...to,
        amount: paths[to.metadata.id].amountOut.toString(),
      });
    }
  };

  // Create a handler for changing "from" token
  const handleFromTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFrom({ metadata: tokenList[e.currentTarget.value], amount: '0' });
    setTo({ metadata: undefined, amount: '0' });
  };

  // Create a handler for changing "to" token
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <div>
              From:&nbsp;
              <select
                name="from"
                onChange={handleFromTokenChange}
                value={from.metadata?.id || ''}
              >
                <option disabled value="" style={{ display: 'none' }}></option>
                {/** Show all available tokens for "from" options */}
                {Object.values(tokenList).map((token) => (
                  <option value={token.id} key={token.id}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              &nbsp;
              <input
                type="number"
                min={0}
                value={from.amount}
                onChange={handleFromAmountChange}
              />
            </div>

            <div>
              To:&nbsp;
              <select
                name="to"
                onChange={handleToTokenChange}
                value={to.metadata?.id || ''}
              >
                <option value="" style={{ display: 'none' }}></option>
                {/** Show just available tokens for "to" options */}
                {Object.keys(toOptionsList).map((tokenId) => (
                  <option value={tokenId} key={tokenId}>
                    {tokenList[tokenId].symbol}
                  </option>
                ))}
              </select>
              &nbsp;
              <input type="number" disabled value={to.amount} />
            </div>
          </div>
          {to.metadata && (
            <span>
              <b>Minimum {to.metadata.symbol} received:&nbsp;</b>
              {Swap.getAmountMin({
                amount: to.amount,
                decimals: to.metadata.decimals,
                slippage: Default.SLIPPAGE,
              }).toString()}
            </span>
          )}
          <button onClick={handleSwap}>Swap</button>
        </>
      )}
    </section>
  );
};
