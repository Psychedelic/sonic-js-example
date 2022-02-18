import {
  useSwapCanisterBalances,
  useSwapCanisterController,
  useSwapCanisterLists,
} from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { Assets, toExponential, Token } from '@psychedelic/sonic-js';
import { ChangeEvent, useState } from 'react';

export const WithdrawSection = () => {
  // Use custom hooks
  const { tokenList } = useSwapCanisterLists();
  const { updateBalanceList, balanceList } = useSwapCanisterBalances();
  const controller = useSwapCanisterController();
  const { principal } = useAppSelector(selectPlugState);

  const [selectedToken, setSelectedToken] = useState<Token.Data>({
    amount: '0',
  });
  const [isWithdrawRunning, setIsWithdrawRunning] = useState<boolean>(false);

  // If there is no principal we can't swap
  if (!principal) {
    return (
      <section>
        <h1>Withdraw</h1>
        <span>Connect to plug to withdraw</span>
      </section>
    );
  }

  // Await fetching tokenList and balanceList
  if (!tokenList || !balanceList) {
    return (
      <section>
        <h1>Withdraw</h1>
        <span>Withdraw is running...</span>
      </section>
    );
  }

  const handleTokenSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const tokenId = e.currentTarget.value;
    setSelectedToken({ ...selectedToken, metadata: tokenList[tokenId] });
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedToken({ ...selectedToken, amount: e.currentTarget.value });
  };

  const handleWithdraw = () => {
    if (!controller || !selectedToken.metadata) return;
    setIsWithdrawRunning(true);
    controller
      .withdraw({
        tokenId: selectedToken.metadata.id,
        amount: selectedToken.amount,
      })
      .then(() => Promise.resolve(updateBalanceList()))
      .catch((error) => alert(`Withdraw failed: ${error}`))
      .finally(() => setIsWithdrawRunning(false));
  };

  return (
    <section>
      <h1>Withdraw</h1>

      {isWithdrawRunning ? (
        <span>Loading...</span>
      ) : (
        <>
          <div>
            Token:&nbsp;
            <select
              name="from"
              onChange={handleTokenSelect}
              value={selectedToken.metadata?.id || ''}
            >
              <option value="" style={{ display: 'none' }}></option>
              {/** Show all available tokens for withdraw */}
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
              max={
                selectedToken.metadata &&
                balanceList[selectedToken.metadata.id].sonic.toNumber()
              }
              step={
                selectedToken.metadata &&
                toExponential(-selectedToken.metadata.decimals).toNumber()
              }
              value={selectedToken.amount}
              onChange={handleAmountChange}
            />
            &nbsp;
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>
          {selectedToken.metadata && (
            <span>
              <b>Received {selectedToken.metadata.symbol}:&nbsp;</b>
              {Assets.getWithdrawAmount({
                token: selectedToken.metadata,
                amount: selectedToken.amount,
              }).toString()}
            </span>
          )}
        </>
      )}
    </section>
  );
};
