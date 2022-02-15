import './styles/global.css';
import ReactDOM from 'react-dom';
import { PlugConnection, DataLists, Swap, Balance } from './components';
import { Provider } from 'react-redux';
import { store } from '@/store';

ReactDOM.render(
  <Provider store={store}>
    <main>
      <DataLists />
      <PlugConnection />
      <Balance />
      <Swap />
    </main>
  </Provider>,
  document.getElementById('sonic-app-root')
);
