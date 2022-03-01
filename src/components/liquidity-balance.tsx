import {
  useSwapCanisterLiquidityPosition,
  useSwapCanisterLists,
} from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';

/**
 * Liquidity Position Section React Component
 * Example of a component that show liquidity positions
 */
export const LiquidityPositionSection = () => {
  const { principal } = useAppSelector(selectPlugState);
  const { tokenList } = useSwapCanisterLists();
  const { lpOf, lpList, isLoading, updateLpList } =
    useSwapCanisterLiquidityPosition();

  // Create a state to manage the principal id shown and searched
  const [findingPrincipalId, setFindingPrincipalId] = useState<string>();

  // If the principal from our Plug state changes we update the LP list
  useEffect(() => {
    if (principal) {
      updateLpList(principal.toString());
    }
  }, [principal]);

  // Update the shown principal id if the searched from store changes
  useEffect(() => {
    setFindingPrincipalId(lpOf);
  }, [lpOf]);

  const handleGetLp = () => {
    updateLpList(findingPrincipalId);
  };

  return (
    <section>
      <h1>Liquidity Position</h1>
      <div>
        Principal Id:&nbsp;
        <input
          value={findingPrincipalId}
          onChange={(e) => setFindingPrincipalId(e.currentTarget.value)}
        />
        &nbsp;
        <button onClick={handleGetLp}>Get LPs</button>
      </div>
      <div className="card-list">
        {/** Render the LP list if is searching for lpOf from store */}
        {lpOf &&
          (isLoading || !tokenList || !lpList ? (
            // Render loading if is loading
            <span>Loading...</span>
          ) : // Render the LP list
          Object.keys(lpList).length > 0 ? (
            Object.entries(lpList).map(([pairId, lp]) => {
              // Split pair id to get token ids
              const [token0, token1] = pairId.split(':');
              return (
                <div className="token-card" key={pairId}>
                  <h2>
                    {tokenList[token0].symbol}/{tokenList[token1].symbol}
                  </h2>
                  <span className="data-row">
                    <label>Wallet:&nbsp;</label>
                    {toBigNumber(lp)
                      .applyDecimals(Liquidity.PAIR_DECIMALS)
                      .toString()}
                  </span>
                </div>
              );
            })
          ) : (
            <div>No Liquidity Positions</div>
          ))}
      </div>
    </section>
  );
};
