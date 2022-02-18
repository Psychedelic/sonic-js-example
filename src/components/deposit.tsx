import {
  useSwapCanisterBalances,
  useSwapCanisterController,
  useSwapCanisterLists,
} from '@/hooks';
import { selectPlugState, useAppSelector } from '@/store';
import { Assets, toExponential, Token } from '@psychedelic/sonic-js';
import { ChangeEvent, useState } from 'react';

export const DepositSection = () => {
  // Use custom hooks
  const { tokenList } = useSwapCanisterLists();
  const { updateBalanceList, balanceList } = useSwapCanisterBalances();
  const controller = useSwapCanisterController();
  const { principal } = useAppSelector(selectPlugState);

  const [selectedToken, setSelectedToken] = useState<Token.Data>({
    amount: '0',
  });
  const [isDepositRunning, setIsDepositRunning] = useState<boolean>(false);

  // If there is no principal we can't swap
  if (!principal) {
    return (
      <section>
        <h1>Deposit</h1>
        <span>Connect to plug to deposit</span>
      </section>
    );
  }

  // Await fetching tokenList and balanceList
  if (!tokenList || !balanceList) {
    return (
      <section>
        <h1>Deposit</h1>
        <span>Loading...</span>
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

  const handleDeposit = () => {
    if (!controller || !selectedToken.metadata) return;
    setIsDepositRunning(true);

    controller
      .deposit({
        tokenId: selectedToken.metadata.id,
        amount: selectedToken.amount,
      })
      .then(() => Promise.resolve(updateBalanceList()))
      .catch((error) => alert(`Deposit failed: ${error}`))
      .finally(() => setIsDepositRunning(false));
  };

  return (
    <section>
      <h1>Deposit</h1>

      {isDepositRunning ? (
        <span>Deposit is running...</span>
      ) : (
        <>
          <div>
            Token:&nbsp;
            <select
              name="from"
              onChange={handleTokenSelect}
              value={selectedToken.metadata?.id || ''}
            >
              <option disabled value="" style={{ display: 'none' }}></option>
              {/** Show all available tokens for deposit */}
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
                Assets.getDepositAmount({
                  token: selectedToken.metadata,
                  amount:
                    balanceList[selectedToken.metadata.id].token.toString(),
                }).toNumber()
              }
              step={
                selectedToken.metadata &&
                toExponential(-selectedToken.metadata.decimals).toNumber()
              }
              value={selectedToken.amount}
              onChange={handleAmountChange}
            />
            &nbsp;
            <button onClick={handleDeposit}>Deposit</button>
          </div>
          {selectedToken.metadata && (
            <span>
              <b>Needed {selectedToken.metadata.symbol}:&nbsp;</b>
              {Assets.getDepositAmount({
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
