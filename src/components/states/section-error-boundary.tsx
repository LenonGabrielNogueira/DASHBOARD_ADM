"use client";

import { Component, type ReactNode } from "react";
import type { SectionContext } from "@/types/ui-state";
import { SectionFeedback } from "./section-feedback";

// Isola erros de renderização no cliente. Falhas de dados usam UiState.error.
export class SectionErrorBoundary extends Component<{ context: SectionContext; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SectionFeedback context={this.props.context} status="error" onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
