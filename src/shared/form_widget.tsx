import * as React from 'react';
import { ReactWidget } from './react_widget';
import { stat } from 'fs';

export interface IFormWidgetProps {
  initialData: {
    username: string;
    password: string;
  };
  onSubmit?(username: string, password: string): void;
}

export function Form(props: IFormWidgetProps) {
  const [state, setState] = React.useState({
    username: props.initialData.username,
    password: props.initialData.password,
  });

  const onSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (props.onSubmit) {
        props.onSubmit(state.username, state.password);
      }
    },
    [state],
  );

  return (
    <form onSubmit={onSubmit}>
      <p>
        <input type="text" value={state.username} onChange={(e) => setState({ ...state, username: e.target.value })} />
      </p>
      <p>
        <input
          type="password"
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
        />
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  );
}

export class FormWidget extends ReactWidget<IFormWidgetProps, React.SFC<IFormWidgetProps>> {
  constructor() {
    super(Form);
  }
}
