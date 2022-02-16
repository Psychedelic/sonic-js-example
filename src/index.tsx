import './styles/global.css';
import ReactDOM from 'react-dom';
import {
  PlugSection,
  DataListsSection,
  SwapSection,
  BalanceSection,
} from './components';
import { Provider } from 'react-redux';
import { store } from '@/store';

ReactDOM.render(
  <Provider store={store}>
    <main>
      <DataListsSection />
      <PlugSection />
      <SwapSection />
      <BalanceSection />
    </main>
  </Provider>,
  document.getElementById('sonic-app-root')
);
