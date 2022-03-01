import './styles/global.css';
import ReactDOM from 'react-dom';
import {
  PlugSection,
  DataListsSection,
  SwapSection,
  BalanceSection,
  WithdrawSection,
  DepositSection,
  LiquidityBalanceSection,
  AddLiquiditySection,
  RemoveLiquiditySection,
} from './components';
import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * React root component
 *
 * The main usability functions from sonic-js were separated in sections
 * to split examples of code that are used for different purposes.
 */
ReactDOM.render(
  <Provider store={store}>
    <main>
      <DataListsSection />
      <PlugSection />
      <SwapSection />
      <BalanceSection />
      <DepositSection />
      <WithdrawSection />
      <LiquidityBalanceSection />
      <AddLiquiditySection />
      <RemoveLiquiditySection />
    </main>
  </Provider>,
  document.getElementById('sonic-app-root')
);
