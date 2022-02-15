import { plug } from '@/components';
import { selectPlugState, useAppSelector } from '@/store';
import {
  ActorAdapter,
  createSwapActor,
  SwapCanisterController,
} from '@psychedelic/sonic-js';
import { useEffect, useState } from 'react';

/**
 * Example of creating a custom hook for SwapCanisterController usage
 */
export const useSwapCanisterController = () => {
  const { principal } = useAppSelector(selectPlugState);

  const [controller, setController] = useState<SwapCanisterController | null>(
    null
  );

  /**
   * Creating a SwapCanisterController:
   * We need first create an SwapActor which can receive an ActorAdapter
   * with reference from a provider that turn able to create an Actor.
   *
   * If Plug extension is installed, we can use plug as a provider.
   */
  useEffect(() => {
    let actorAdapter: ActorAdapter;

    // Verify if there is a principal connected to Plug
    if (principal) {
      // Use plug if is present
      actorAdapter = new ActorAdapter(plug);
    } else {
      // Create a default actor if there is no principal
      actorAdapter = new ActorAdapter();
    }

    // The actorAdapter can be provided or it will be used a default one
    createSwapActor({ actorAdapter }).then((swapActor) => {
      // Instantiating a SwapCanisterController with the created SwapActor
      const _controller = new SwapCanisterController(swapActor);

      setController(_controller);
    });

    // This function is going to be called again if Principal from plug changes
  }, [principal]);

  return controller;
};
