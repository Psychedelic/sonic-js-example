import {
  useSwapCanisterBalances,
  useSwapCanisterController,
  useSwapCanisterLiquidityPosition,
  useSwapCanisterLists,
} from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { Liquidity, Token } from '@psychedelic/sonic-js';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

/**
 * Add Liquidity Section React Component
 * Example of a component that adds liquidity
 */
export const AddLiquiditySection = () => {
  // Use custom hooks to get data and app states
  const { pairList, tokenList } = useSwapCanisterLists();
  const controller = useSwapCanisterController();
  const { updateBalanceList } = useSwapCanisterBalances();
  const { updateLpList } = useSwapCanisterLiquidityPosition();
  const { principal } = useAppSelector(selectPlugState);

  /**
   * Create states used for add LP.
   * Notice that we are using Token.Data type because it have amount
   * and metadata keys.
   */
  const [token0, setToken0] = useState<Token.Data>({ amount: '0' });
  const [token1, setToken1] = useState<Token.Data>({ amount: '0' });
  const [isAddRunning, setIsAddRunning] = useState<boolean>(false);

  /**
   * Special state for the calculation of the resultant LP.
   * Notice that this calculation can throw in case of non matching
   * amounts with pair reserves.
   */
  const resultantLP = useMemo(() => {
    if (!token0.metadata || !token1.metadata || !pairList) return '';
    if (!pairList[token0.metadata.id][token1.metadata.id]) {
      return 'Invalid pair';
    }

    try {
      return Liquidity.getPosition({
        amount0: token0.amount,
        amount1: token1.amount,
        decimals0: token0.metadata.decimals,
        decimals1: token1.metadata.decimals,
        reserve0: pairList[token0.metadata.id][token1.metadata.id].reserve0,
        reserve1: pairList[token0.metadata.id][token1.metadata.id].reserve1,
        totalSupply:
          pairList[token0.metadata.id][token1.metadata.id].totalSupply,
      })
        .applyDecimals(Liquidity.PAIR_DECIMALS)
        .toString();
    } catch {
      return 'Invalid inputs';
    }
  }, [token0, token1]);

  /**
   * Create a handler for adding LP using the controller and
   * managing app states.
   */
  const handleAddLiquidity = useCallback(() => {
    if (
      !controller ||
      !token0.metadata ||
      !token1.metadata ||
      !pairList ||
      !pairList[token0.metadata.id][token1.metadata.id]
    )
      return;
    setIsAddRunning(true);
    controller
      .addLiquidity({
        amount0: token0.amount,
        amount1: token1.amount,
        token0: token0.metadata.id,
        token1: token1.metadata.id,
      })
      .then(() => Promise.resolve(updateBalanceList()))
      .then(() => Promise.resolve(updateLpList()))
      .catch((error) => alert(`Add LP failed: ${error}`))
      .finally(() => setIsAddRunning(false));
  }, [controller, token0, token1]);

  // If there is no principal we can't add liquidity
  if (!principal) {
    return (
      <section>
        <h1>Add Liquidity</h1>
        <span>Connect to plug to add liquidity</span>
      </section>
    );
  }

  // Await fetching tokenList and pairList
  if (!tokenList || !pairList) {
    return (
      <section>
        <h1>Add Liquidity</h1>
        <span>Loading...</span>
      </section>
    );
  }

  /**
   * Create a handler for changing the tokens amounts.
   * Notice that after changing one token we update the other one
   * using the calculation of the opposite amount.
   */
  const handleToken0AmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setToken0({ ...token0, amount });
    if (token0.metadata && token1.metadata) {
      setToken1({
        ...token1,
        amount: Liquidity.getOppositeAmount({
          amountIn: amount,
          decimalsIn: token0.metadata.decimals,
          decimalsOut: token1.metadata.decimals,
          reserveIn: pairList[token0.metadata.id][token1.metadata.id].reserve0,
          reserveOut: pairList[token0.metadata.id][token1.metadata.id].reserve1,
        }).toString(),
      });
    }
  };
  const handleToken1AmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setToken1({ ...token1, amount });
    if (token0.metadata && token1.metadata) {
      setToken0({
        ...token0,
        amount: Liquidity.getOppositeAmount({
          amountIn: amount,
          decimalsIn: token1.metadata.decimals,
          decimalsOut: token0.metadata.decimals,
          reserveIn: pairList[token1.metadata.id][token0.metadata.id].reserve0,
          reserveOut: pairList[token1.metadata.id][token0.metadata.id].reserve1,
        }).toString(),
      });
    }
  };

  // Create a handler for changing token0
  const handleToken0Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setToken0({ ...token0, metadata: tokenList[e.currentTarget.value] });
  };

  // Create a handler for changing token1
  const handleToken1Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setToken1({
      ...token1,
      metadata: tokenList[e.currentTarget.value],
    });
  };

  return (
    <section>
      <h1>Add Liquidity</h1>
      {isAddRunning ? (
        <span>Add liquidity in progress...</span>
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
              Token0:&nbsp;
              <select
                name="token0"
                onChange={handleToken0Change}
                value={token0.metadata?.id || ''}
              >
                <option disabled value="" style={{ display: 'none' }}></option>
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
                value={token0.amount}
                onChange={handleToken0AmountChange}
              />
            </div>

            <div>
              Token1:&nbsp;
              <select
                name="token1"
                onChange={handleToken1Change}
                value={token1.metadata?.id || ''}
              >
                <option value="" style={{ display: 'none' }}></option>
                {Object.values(tokenList).map((token) => (
                  <option value={token.id} key={token.id}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              &nbsp;
              <input
                type="number"
                value={token1.amount}
                onChange={handleToken1AmountChange}
              />
            </div>
          </div>
          {resultantLP && (
            <span>
              <b>Liquidity Position received:&nbsp;</b>
              {resultantLP}
            </span>
          )}
          <button onClick={handleAddLiquidity}>Add Liquidity</button>
        </>
      )}
    </section>
  );
};
