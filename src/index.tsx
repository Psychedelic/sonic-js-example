import './styles/global.css';
import ReactDOM from 'react-dom';
import { PlugConnection, DisplayData, Swap } from './components';
import { Provider } from 'react-redux';
import { store } from '@/store';

ReactDOM.render(
  <Provider store={store}>
    <main>
      <PlugConnection />
      <Swap />
      <DisplayData />
    </main>
  </Provider>,
  document.getElementById('sonic-app-root')
);
