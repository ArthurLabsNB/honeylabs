"use client";
import { Component, type ReactNode } from "react";
import { error as logError } from "@lib/logger";

interface Props {
  children: ReactNode;
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
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-500">Algo salió mal.</p>;
    }
    return this.props.children;
  }
}
