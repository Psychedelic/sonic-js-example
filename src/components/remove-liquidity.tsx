import {
  useSwapCanisterController,
  useSwapCanisterLiquidityPosition,
  useSwapCanisterLists,
} from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import {
  Liquidity,
  Pair,
  toBigNumber,
  toExponential,
} from '@psychedelic/sonic-js';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

/**
 * Remove Liquidity Section React Component
 * Example of a component that removes liquidity
 */
export const RemoveLiquiditySection = () => {
  const { pairList, tokenList } = useSwapCanisterLists();
  const { principal } = useAppSelector(selectPlugState);
  const { updateLpList } = useSwapCanisterLiquidityPosition();
  const controller = useSwapCanisterController();

  // Create states remove liquidity
  const [selectedToken, setSelectedToken] = useState<Pair.Metadata>();
  const [amount, setAmount] = useState<string>('0');
  const [isRemoveRunning, setIsRemoveRunning] = useState<boolean>(false);
  const [[token0Amount, token1Amount], setTokenAmounts] = useState<
    [string, string]
  >(['', '']);

  /**
   * Create a flat list state from PairsList to help on data
   * manipulation.
   */
  const flatPairList = useMemo(() => {
    if (!pairList) return [];
    return Object.values(pairList).reduce((list, paired) => {
      for (const pair of Object.values(paired)) {
        const [token0] = pair.id.split(':');
        if (token0 === pair.token0) {
          list = [...list, pair];
        }
      }
      return list;
    }, [] as Pair.Metadata[]);
  }, [pairList]);

  /**
   * Update token amounts state when LP amount changes
   */
  useEffect(() => {
    if (selectedToken && tokenList) {
      // Get amounts by Liquidity calculation
      const amounts = Liquidity.getTokenBalances({
        decimals0: tokenList[selectedToken.token0].decimals,
        decimals1: tokenList[selectedToken.token1].decimals,
        lpBalance: toBigNumber(amount)
          .removeDecimals(Liquidity.PAIR_DECIMALS)
          .toString(),
        reserve0: selectedToken.reserve0,
        reserve1: selectedToken.reserve1,
        totalSupply: selectedToken.totalSupply,
      });

      setTokenAmounts([
        amounts.balance0.toString(),
        amounts.balance1.toString(),
      ]);
    } else {
      setTokenAmounts(['', '']);
    }
  }, [amount, selectedToken, tokenList]);

  // If there is no principal we can't remove liquidity
  if (!principal) {
    return (
      <section>
        <h1>Remove Liquidity</h1>
        <span>Connect to plug to remove liquidity</span>
      </section>
    );
  }

  // Await fetching tokenList and pairList
  if (!tokenList || !pairList) {
    return (
      <section>
        <h1>Remove Liquidity</h1>
        <span>Loading...</span>
      </section>
    );
  }

  // Create a handler for selecting token
  const handleTokenSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(
      flatPairList.find((pair) => pair.id === e.currentTarget.value)
    );
  };

  // Create a handler for changing token amount
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };

  /**
   * Create a handler for remove LP using the controller and
   * managing app states.
   */
  const handleRemove = () => {
    if (!controller || !selectedToken) return;
    setIsRemoveRunning(true);
    controller
      .removeLiquidity({
        token0: selectedToken.token0,
        token1: selectedToken.token1,
        amount: amount,
      })
      .then(() => Promise.resolve(updateLpList()))
      .catch((error) => alert(`Remove LP failed: ${error}`))
      .finally(() => setIsRemoveRunning(false));
  };

  return (
    <section>
      <h1>Remove Liquidity</h1>
      {isRemoveRunning ? (
        <span>Loading...</span>
      ) : (
        <>
          <div>
            Pair:&nbsp;
            <select
              name="from"
              onChange={handleTokenSelect}
              value={selectedToken?.id || ''}
            >
              <option value="" style={{ display: 'none' }}></option>
              {flatPairList.map((pair) => {
                return (
                  <option value={pair.id} key={pair.id}>
                    {tokenList[pair.token0].symbol}/
                    {tokenList[pair.token1].symbol}
                  </option>
                );
              })}
            </select>
            &nbsp;
            <input
              type="number"
              min={0}
              step={toExponential(-Liquidity.PAIR_DECIMALS).toNumber()}
              value={amount}
              onChange={handleAmountChange}
            />
            &nbsp;
            <button onClick={handleRemove}>Remove</button>
          </div>
          {selectedToken && (
            <>
              <span>
                <b>{tokenList[selectedToken.token0].symbol} received:&nbsp;</b>
                {token0Amount}
              </span>
              <span>
                <b>{tokenList[selectedToken.token1].symbol} received:&nbsp;</b>
                {token1Amount}
              </span>
            </>
          )}
        </>
      )}
    </section>
  );
};
