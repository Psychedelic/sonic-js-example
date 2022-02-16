import {
  plugActions,
  selectPlugState,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Principal } from '@dfinity/principal';
import { useCallback } from 'react';

/**
 * Declare plug and it functions
 * Example of a component that displays plug connection
 */
export const plug = (window as any).ic?.plug;

const requestConnect = () =>
  plug?.requestConnect({
    whitelist: ['3xwpq-ziaaa-aaaah-qcn4a-cai'],
  });

const getPrincipal = () => plug?.getPrincipal();

const requestDisconnect = () => plug?.disconnect();

/**
 * Plug Section React Component
 */
export const PlugSection = () => {
  // Use states from store
  const { principal, isLoading } = useAppSelector(selectPlugState);
  const dispatch = useAppDispatch();

  // Create a function to handle connection and app states
  const handleConnect = useCallback(() => {
    dispatch(plugActions.setIsLoading(true));
    requestConnect()
      .then(getPrincipal)
      .then((response: Principal) =>
        dispatch(plugActions.setPrincipal(response))
      )
      .finally(() => dispatch(plugActions.setIsLoading(false)));
  }, [dispatch]);

  // Create a function to handle disconnection and app states
  const handleDisconnect = useCallback(() => {
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
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </section>
  );
};
