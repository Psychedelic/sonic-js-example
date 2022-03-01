import { selectPlugState, useAppSelector } from '@/store';

/**
 * Add Liquidity Section React Component
 * Example of a component that adds liquidity
 */
export const AddLiquiditySection = () => {
  const { principal } = useAppSelector(selectPlugState);

  // If there is no principal we can't add liquidity
  if (!principal) {
    return (
      <section>
        <h1>Add Liquidity</h1>
        <span>Connect to plug to add liquidity</span>
      </section>
    );
  }

  return (
    <section>
      <h1>Add Liquidity</h1>
    </section>
  );
};
