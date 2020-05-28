class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <section className="container">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <a className="button" onClick={() => this.setState({error: null, errorInfo: null})}>Retry mount</a>
          <br />
          <a className="button" onClick={() => window.location.href = window.location.href}>Reload Page</a>
        </section>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}

window.ErrorBoundary = ErrorBoundary;
