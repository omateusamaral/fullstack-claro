import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { TaskCard } from "./TaskCard";
import { TaskStatus } from "../types";

describe("TaskCard", () => {
  it("renders the task and calls onPress when selected", () => {
    // Arrange
    const onPress = jest.fn();
    const task = {
      id: "task-1",
      title: "Revisar documentação",
      description: "Atualizar os exemplos da API",
      status: TaskStatus.PENDING,
      teams: [],
    };

    // Act
    render(<TaskCard task={task} onPress={onPress} />);
    fireEvent.press(screen.getByText("Revisar documentação"));

    // Assert
    expect(screen.getByText("Atualizar os exemplos da API")).toBeTruthy();
    expect(screen.getByText(TaskStatus.PENDING)).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("uses the pending status when the task has no status", () => {
    // Arrange
    const task = {
      id: "task-2",
      title: "Criar checklist",
      teams: [],
    };

    // Act
    render(<TaskCard task={task} onPress={jest.fn()} />);

    // Assert
    expect(screen.getByText(TaskStatus.PENDING)).toBeTruthy();
  });
});
