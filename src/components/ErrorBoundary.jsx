import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          background: "#f44336",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "18px",
          flexDirection: "column",
          gap: "20px"
        }}>
          <h2>⚠️ Rendering Error</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => window.location. reload()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              background: "white",
              color: "#f44336",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props. children;
  }
}