import { useSwapCanisterLists } from '@/hooks/use-swap-canister-lists';
import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';

/**
 * Example of a component that displays the swap canister data
 */
export const DataLists = () => {
  const { tokenList, pairList } = useSwapCanisterLists();

  return (
    <section>
      <h1>Data Lists</h1>
      <h2>Tokens</h2>
      {tokenList
        ? /**
           * Displaying all token list from swap canister
           */
          Object.values(tokenList).map((token) => (
            <div className="token-card" key={token.id}>
              <h2>{token.name}</h2>
              <span>Symbol: {token.symbol}</span>
              <span>Id: {token.id}</span>
              <span>Decimals: {token.decimals}</span>
              <span>
                Fee:&nbsp;
                {/* Parsing bigint from responses on swap canister */}
                {toBigNumber(token.fee)
                  .applyDecimals(token.decimals)
                  .toString()}
              </span>
              <span>
                Total Supply:&nbsp;
                {/* Parsing bigint from responses on swap canister */}
                {toBigNumber(token.totalSupply)
                  .applyDecimals(token.decimals)
                  .toString()}
              </span>
            </div>
          ))
        : 'Loading...'}
      <h2>Pairs</h2>
      {pairList && tokenList
        ? /**
           * Displaying the pair list by mapping over it with tokens from token list
           * The pair list is an object { [token0Id]: { [token1Id]: Pair }}
           * So will be repeated and we can verify if a pair exists by doing:
           *   pairList[token0Id][token1Id]
           */
          Object.values(tokenList).map((token) => (
            <div key={token.id}>
              <h3>{token.symbol} Pairs:</h3>
              {Object.values(pairList[token.id]).map((pair) => (
                <div className="token-card" key={pair.token1}>
                  <h2>{tokenList[pair.token1].symbol}</h2>
                  <span>
                    Total Supply:&nbsp;
                    {/* The decimals number for a pair can be calculated using Liquidity.getPairDecimals */}
                    {toBigNumber(pair.totalSupply)
                      .applyDecimals(
                        Liquidity.getPairDecimals(
                          tokenList[pair.token0].decimals,
                          tokenList[pair.token1].decimals
                        )
                      )
                      .toString()}
                  </span>

                  <span>
                    {tokenList[pair.token0].symbol} Reserve:&nbsp;
                    {/* Parsing bigint from responses on swap canister */}
                    {toBigNumber(pair.reserve0)
                      .applyDecimals(tokenList[pair.token0].decimals)
                      .toString()}
                  </span>

                  <span>
                    {tokenList[pair.token1].symbol} Reserve:&nbsp;
                    {/* Parsing bigint from responses on swap canister */}
                    {toBigNumber(pair.reserve1)
                      .applyDecimals(tokenList[pair.token1].decimals)
                      .toString()}
                  </span>
                </div>
              ))}
            </div>
          ))
        : 'Loading...'}
    </section>
  );
};
