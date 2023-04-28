/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import isFunction from './isFunction';

export type EnhancedSetState<State> = React.Dispatch<React.SetStateAction<{ [K in keyof State]?: State[K] }>>;

function useState<State>(input: State): [State, EnhancedSetState<State>] {
  const [state, setState] = React.useState<State>(input);

  const enhancedSetState: EnhancedSetState<State> = React.useCallback(input => {
    setState(oldState => {
      const newState = isFunction(input) ? input(oldState) : input;

      return newState ? { ...oldState, ...newState } : oldState;
    });
  }, []);

  return [state, enhancedSetState];
}

export default useState;
