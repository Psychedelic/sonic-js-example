import { useSwapCanisterBalances, useSwapCanisterLists } from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

/**
 * Balance Section React Component
 * Example of a component that displays balances
 */
export const BalanceSection = () => {
  // Use custom hooks and the redux store
  const { balanceList, isLoading, updateBalanceList, balanceOf } =
    useSwapCanisterBalances();
  const { tokenList } = useSwapCanisterLists();
  const { principal } = useAppSelector(selectPlugState);

  // Create a state to manage the principal id shown and searched
  const [findingPrincipalId, setFindingPrincipalId] = useState<string>();

  // If the principal from our Plug state changes we update the balance list
  useEffect(() => {
    if (principal) {
      updateBalanceList(principal.toString());
    }
  }, [principal]);

  // Update the shown principal id if the searched from store changes
  useEffect(() => {
    setFindingPrincipalId(balanceOf);
  }, [balanceOf]);

  const handleGetBalance = () => {
    updateBalanceList(findingPrincipalId);
  };

  return (
    <section>
      <h1>Balances</h1>
      {/** Render a form to search for other a principal id balance */}
      <div>
        Principal Id:&nbsp;
        <input
          value={findingPrincipalId}
          onChange={(e) => setFindingPrincipalId(e.currentTarget.value)}
        />
        <button onClick={handleGetBalance}>Get Balances</button>
      </div>
      {/** Render the balance list if is searching a balance for balanceOf from store */}
      {balanceOf &&
        (isLoading || !tokenList || !balanceList ? (
          // Render loading if is loading
          <span>Loading...</span>
        ) : (
          // Render the balance list
          Object.entries(balanceList).map(([tokenId, balance]) => (
            <div className="token-card" key={tokenId}>
              <h2>{tokenList[tokenId].symbol}</h2>
              <span>Wallet: {balance.token.toString()}</span>
              <span>Sonic: {balance.sonic.toString()}</span>
              <span>Total: {balance.total.toString()}</span>
            </div>
          ))
        ))}
    </section>
  );
};
