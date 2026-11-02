import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TeamFormScreen } from "./TeamFormScreen";
import { createTeam } from "../api/services";

jest.mock("../api/services", () => ({
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
}));

const mockedCreateTeam = jest.mocked(createTeam);
let activeQueryClient: QueryClient | undefined;

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  activeQueryClient = queryClient;
  const navigation = { goBack: jest.fn() };

  return {
    navigation,
    ...render(
      <QueryClientProvider client={queryClient}>
        <TeamFormScreen navigation={navigation} route={{ params: {} }} />
      </QueryClientProvider>,
    ),
  };
}

describe("TeamFormScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    activeQueryClient?.clear();
    activeQueryClient = undefined;
    jest.restoreAllMocks();
  });

  it("creates a team and returns to the teams screen", async () => {
    // Arrange
    mockedCreateTeam.mockResolvedValue({
      id: "team-1",
      name: "Agile Team",
      colorHex: "#FF5733",
      description: "A description of the team",
    });
    const { navigation } = renderScreen();

    // Act
    fireEvent.changeText(screen.getByPlaceholderText("Ex.: Agile Team"), "Agile Team");
    fireEvent.changeText(screen.getByPlaceholderText("#FF5733"), "#FF5733");
    fireEvent.changeText(
      screen.getByPlaceholderText("Descreva o time, seus objetivos e metas"),
      "A description of the team",
    );
    fireEvent.press(screen.getByTestId("submit-team"));

    // Assert
    await waitFor(() => {
      expect(mockedCreateTeam).toHaveBeenCalledWith({
        name: "Agile Team",
        colorHex: "#FF5733",
        description: "A description of the team",
      });
      expect(navigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it("shows validation errors and does not call the API for invalid data", async () => {
    // Arrange
    const { navigation } = renderScreen();

    // Act
    fireEvent.changeText(screen.getByPlaceholderText("Ex.: Agile Team"), "A");
    fireEvent.changeText(screen.getByPlaceholderText("#FF5733"), "red");
    fireEvent.press(screen.getByTestId("submit-team"));

    // Assert
    expect(await screen.findByText("Use pelo menos 3 caracteres")).toBeTruthy();
    expect(
      screen.getByText("Use uma cor hexadecimal, como #FF5733"),
    ).toBeTruthy();
    expect(mockedCreateTeam).not.toHaveBeenCalled();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it("shows an inline error and an alert when the API fails", async () => {
    // Arrange
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    mockedCreateTeam.mockRejectedValue(new Error("Time já existe."));
    renderScreen();

    // Act
    fireEvent.changeText(screen.getByPlaceholderText("Ex.: Agile Team"), "Agile Team");
    fireEvent.press(screen.getByTestId("submit-team"));

    // Assert
    expect(
      await screen.findByText(
        "Não foi possível criar o time. Verifique os dados e tente novamente.",
      ),
    ).toBeTruthy();
    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Time já existe.");
  });

});
