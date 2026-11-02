import React from "react";
import { Text } from "react-native";
import { useForm } from "react-hook-form";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { TeamHorizontalSelect } from "./TeamHorizontalSelect";

const teams = [
  { id: "team-1", name: "Agile Team", colorHex: "#FF5733" },
  { id: "team-2", name: "Platform", colorHex: "#123456" },
];

function SelectHarness({
  isError = false,
  hasFieldError = false,
}: {
  isError?: boolean;
  hasFieldError?: boolean;
}) {
  const { control, watch } = useForm({
    defaultValues: { teamIds: ["team-1"] },
  });

  return (
    <>
      <TeamHorizontalSelect
        teams={teams}
        control={control}
        teamsQuery={{ isError } as never}
        errors={
          hasFieldError
            ? {
                teamIds: { message: "Selecione ao menos um time" },
              }
            : {}
        }
      />
      <Text testID="selected-teams">{watch("teamIds").join(",")}</Text>
    </>
  );
}

describe("TeamHorizontalSelect", () => {
  it("selects and deselects a team", () => {
    // Arrange
    render(<SelectHarness />);

    // Act
    fireEvent.press(screen.getByText("Platform"));
    expect(screen.getByTestId("selected-teams").props.children).toBe(
      "team-1,team-2",
    );
    fireEvent.press(screen.getByText("Agile Team"));

    // Assert
    expect(screen.getByTestId("selected-teams").props.children).toBe("team-2");
  });

  it("shows query and field errors", () => {
    // Arrange
    render(<SelectHarness isError hasFieldError />);

    // Act
    const queryError = screen.getByText(
      "Não foi possível carregar os times. Tente novamente.",
    );
    const fieldError = screen.getByText("Selecione ao menos um time");

    // Assert
    expect(queryError).toBeTruthy();
    expect(fieldError).toBeTruthy();
  });
});
