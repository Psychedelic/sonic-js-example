import { selectPlugState, useAppSelector } from '@/store';

/**
 * Remove Liquidity Section React Component
 * Example of a component that removes liquidity
 */
export const RemoveLiquiditySection = () => {
  const { principal } = useAppSelector(selectPlugState);

  // If there is no principal we can't remove liquidity
  if (!principal) {
    return (
      <section>
        <h1>Remove Liquidity</h1>
        <span>Connect to plug to remove liquidity</span>
      </section>
    );
  }

  return (
    <section>
      <h1>Remove Liquidity</h1>
    </section>
  );
};
