import React from "react";
import { Alert, Pressable, ScrollView, Text } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../api/services";
import { TaskStatus, Team } from "../types";
import { colors, styles } from "../styles";
import { TeamChip } from "../components/TeamChip";

const nextStatus: Record<TaskStatus, TaskStatus> = {
  [TaskStatus.PENDING]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
  [TaskStatus.COMPLETED]: TaskStatus.PENDING,
};

export function TaskDetailsScreen({ navigation, route }: any) {
  const task = route.params.task;
  const client = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: (status: TaskStatus) => updateTask(task.id, { status }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["tasks"] });
      navigation.goBack();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["tasks"] });
      navigation.goBack();
    },
  });
  const status: TaskStatus = task.status ?? TaskStatus.PENDING;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {task.teams.map((team: Team) => (
        <TeamChip key={team.id} team={team} />
      ))}
      <Text style={[styles.title, { marginTop: 16 }]}>{task.title}</Text>
      <Text
        style={{
          color: colors.muted,
          fontSize: 16,
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        {task.description || "Sem descrição."}
      </Text>
      <Text
        style={{ color: colors.warning, fontWeight: "700", marginBottom: 20 }}
      >
        Status: {status}
      </Text>
      <Pressable
        style={[styles.buttonSecondary, { marginTop: 12 }]}
        onPress={() => navigation.navigate("TaskForm", { task })}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Editar tarefa
        </Text>
      </Pressable>
      <Pressable
        style={{ padding: 16, alignItems: "center", marginTop: 8 }}
        onPress={() =>
          Alert.alert("Excluir tarefa", "Deseja realmente excluir?", [
            { text: "Cancelar" },
            {
              text: "Excluir",
              style: "destructive",
              onPress: () => deleteMutation.mutate(),
            },
          ])
        }
      >
        <Text style={{ color: colors.error, fontWeight: "700" }}>
          Excluir tarefa
        </Text>
      </Pressable>
    </ScrollView>
  );
}
