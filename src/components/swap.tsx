import { useSwapCanisterLists } from '@/hooks/use-swap-canister-lists';
import { selectPlugState, useAppSelector } from '@/store';

export const Swap = () => {
  const { principal } = useAppSelector(selectPlugState);
  const {} = useSwapCanisterLists();

  if (!principal) {
    return (
      <section>
        <h1>Swap</h1>
        <span>Connect to plug to do swaps</span>
      </section>
    );
  }

  return (
    <section>
      <h1>Swap</h1>
    </section>
  );
};
