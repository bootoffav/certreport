import { Component } from 'react';
import { Error400Page } from 'tabler-react';

class ErrorBoundary extends Component {
  subtitles: {
    [k: string]: string;
  } = {
    'Task not found': 'Приложение не смогло отпарсить задачу по указанному ID'
  };

  state = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError = ({ message }: any) => {
    return { hasError: true, message };
  }

  render = () => this.state.hasError ?
    <Error400Page
      subtitle={this.subtitles[this.state.message]}
    />
    : this.props.children; 
}

export default ErrorBoundary;