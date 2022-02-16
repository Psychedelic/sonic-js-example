import { useSwapCanisterBalances, useSwapCanisterLists } from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

export const Balance = () => {
  const { balanceList, isLoading, updateBalanceList, balanceOf } =
    useSwapCanisterBalances();
  const { tokenList } = useSwapCanisterLists();
  const { principal } = useAppSelector(selectPlugState);

  const [findingPrincipalId, setFindingPrincipalId] = useState<string>();

  useEffect(() => {
    if (principal) {
      updateBalanceList(principal.toString());
    }
  }, [principal]);

  useEffect(() => {
    setFindingPrincipalId(balanceOf);
  }, [balanceOf]);

  const handleGetBalance = () => {
    updateBalanceList(findingPrincipalId);
  };

  return (
    <section>
      <h1>Balances</h1>
      <div>
        Principal Id:&nbsp;
        <input
          value={findingPrincipalId}
          onChange={(e) => setFindingPrincipalId(e.currentTarget.value)}
        />
        <button onClick={handleGetBalance}>Get Balances</button>
      </div>
      {balanceOf &&
        (isLoading || !tokenList || !balanceList ? (
          <span>Loading...</span>
        ) : (
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
