"use client";
import { Component, type ReactNode } from "react";
import { error as logError } from "@lib/logger";

interface Props {
  children: ReactNode;
  /** Mensaje a mostrar en caso de error */
  message?: string;
  /** Callback para manejo adicional del error */
  onError?: (err: unknown) => void;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    logError("ErrorBoundary", err);
    this.props.onError?.(err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-red-500">
          {this.props.message || "Algo salió mal."}
        </p>
      );
    }
    return this.props.children;
  }
}
