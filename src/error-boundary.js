import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static defaultProps = {
    fallback: <h1>Something went wrong.</h1>,
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // log the error
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // render custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
