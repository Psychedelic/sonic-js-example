import {
  plugActions,
  selectPlugState,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Principal } from '@dfinity/principal';
import { useCallback } from 'react';

export const plug = (window as any).ic?.plug;

const requestConnect = () =>
  plug?.requestConnect({
    whitelist: ['3xwpq-ziaaa-aaaah-qcn4a-cai'],
  });

const getPrincipal = () => plug?.getPrincipal();

const requestDisconnect = () => plug?.disconnect();

export const PlugConnection = () => {
  const { principal, isLoading } = useAppSelector(selectPlugState);
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    dispatch(plugActions.setIsLoading(true));
    requestConnect()
      .then(getPrincipal)
      .then((response: Principal) =>
        dispatch(plugActions.setPrincipal(response))
      )
      .finally(() => dispatch(plugActions.setIsLoading(false)));
  }, [dispatch]);

  const disconnect = useCallback(() => {
    requestDisconnect();
    dispatch(plugActions.setPrincipal(undefined));
  }, [dispatch]);

  return (
    <section>
      <h1>Plug Connection</h1>
      {isLoading ? (
        'Loading...'
      ) : principal ? (
        <>
          {principal.toString()}
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </section>
  );
};
