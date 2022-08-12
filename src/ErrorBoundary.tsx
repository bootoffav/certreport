import { Component, ReactNode } from 'react';
import { Error400Page } from 'tabler-react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children?: ReactNode }, State> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError = (_: Error): State => {
    return { hasError: true };
  };

  render = () =>
    this.state.hasError ? (
      <Error400Page subtitle="Application found bad syntax" />
    ) : (
      this.props.children
    );
}

export default ErrorBoundary;
