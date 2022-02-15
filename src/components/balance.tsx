import { useSwapCanisterBalances, useSwapCanisterLists } from '@/hooks';

export const Balance = () => {
  const { balances, isLoading } = useSwapCanisterBalances();
  const { tokenList } = useSwapCanisterLists();

  if (!balances || !tokenList || isLoading) {
    return (
      <section>
        <h1>Balances</h1>
        <span>Loading...</span>
      </section>
    );
  }

  return (
    <section>
      <h1>Balances</h1>
      {Object.entries(balances).map(([tokenId, balance]) => (
        <div className="token-card" key={tokenId}>
          <h2>{tokenList[tokenId].symbol}</h2>
          <span>Wallet: {balance.token.toString()}</span>
          <span>Sonic: {balance.sonic.toString()}</span>
          <span>Total: {balance.total.toString()}</span>
        </div>
      ))}
    </section>
  );
};
