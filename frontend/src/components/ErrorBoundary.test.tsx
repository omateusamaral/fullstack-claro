import React from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Falha inesperada");
  }

  return <Text>Conteúdo carregado</Text>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders its children when there is no error", () => {
    // Arrange
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Conteúdo carregado</Text>
      </ErrorBoundary>,
    );

    // Act
    const content = getByText("Conteúdo carregado");

    // Assert
    expect(content).toBeTruthy();
  });

  it("renders the recovery screen after a child throws", () => {
    // Arrange
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );

    // Act
    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );
    fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    // Assert
    expect(screen.getByText("Conteúdo carregado")).toBeTruthy();
  });
});
