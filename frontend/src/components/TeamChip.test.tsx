import React from "react";
import { render, screen } from "@testing-library/react-native";
import { TeamChip } from "./TeamChip";

describe("TeamChip", () => {
  it("renders the team name with its color", () => {
    // Arrange
    const team = {
      id: "team-1",
      name: "Agile Team",
      colorHex: "#FF5733",
    };

    // Act
    const { getByText } = render(<TeamChip team={team} />);

    // Assert
    expect(getByText("Agile Team")).toBeTruthy();
    expect(getByText("Agile Team").props.style).toEqual(
      expect.objectContaining({ color: "#FF5733" }),
    );
  });

  it("renders a team without a description or extra content", () => {
    // Arrange
    const team = {
      id: "team-2",
      name: "Platform",
      colorHex: "#123456",
    };

    // Act
    render(<TeamChip team={team} />);

    // Assert
    expect(screen.getByText("Platform")).toBeTruthy();
    expect(screen.queryByText("Descrição")).toBeNull();
  });
});
