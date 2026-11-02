import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Pressable, ScrollView, Text, TextInput } from "react-native";
import { createTask, fetchTeams, TaskInput, updateTask } from "../api/services";
import { TaskStatus } from "../types";
import { colors, styles } from "../styles";
import { TeamHorizontalSelect } from "../components/TeamHorizontalSelect";

const schema = z.object({
  title: z.string().trim().min(3, "Use pelo menos 3 caracteres").max(100),
  description: z.string().max(200, "Máximo de 200 caracteres").optional(),
  teamIds: z.array(z.string().uuid()),
  status: z.nativeEnum(TaskStatus),
  dueDate: z
    .string()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Use o formato AAAA-MM-DD",
    )
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(`${value}T00:00:00Z`)),
      "Informe uma data válida",
    ),
});
type FormValues = z.infer<typeof schema>;
const statusOptions = Object.values(TaskStatus);

export function TaskFormScreen({ navigation, route }: any) {
  const editing = route.params?.task;
  const queryClient = useQueryClient();
  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
  });
  const teams = teamsQuery.data ?? [];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editing?.title ?? "",
      description: editing?.description ?? "",
      teamIds:
        editing?.teams?.map((team: { id: string }) => team.id) ??
        (route.params?.teamId ? [route.params.teamId] : []),
      status: editing?.status ?? TaskStatus.PENDING,
      dueDate: editing?.dueDate?.slice(0, 10) ?? "",
    },
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const input: TaskInput = {
        title: values.title,
        description: values.description || undefined,
        teamIds: values.teamIds.length ? values.teamIds : [],
        status: values.status,
        dueDate: values.dueDate ? `${values.dueDate}T12:00:00.000Z` : undefined,
      };

      return editing ? updateTask(editing.id, input) : createTask(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigation.goBack();
    },
    onError: (error) =>
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a tarefa.",
      ),
  });
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {editing ? "Editar tarefa" : "Nova tarefa"}
      </Text>
      <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
      <Text style={styles.label}>Título</Text>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ex.: Revisar documentação"
            placeholderTextColor={colors.muted}
          />
        )}
      />
      {errors.title ? (
        <Text style={styles.error}>{errors.title.message}</Text>
      ) : null}
      <Text style={styles.label}>Descrição</Text>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
            multiline
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Detalhes da tarefa"
            placeholderTextColor={colors.muted}
          />
        )}
      />
      {errors.description ? (
        <Text style={styles.error}>{errors.description.message}</Text>
      ) : null}
      <Text style={styles.label}>Times (opcional)</Text>
      <TeamHorizontalSelect
        control={control}
        errors={errors}
        teams={teams}
        teamsQuery={teamsQuery}
      />

      <Text style={styles.label}>Status</Text>
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            {statusOptions.map((status) => (
              <Pressable
                key={status}
                onPress={() => field.onChange(status)}
                style={[
                  styles.card,
                  {
                    marginRight: 8,
                    paddingVertical: 10,
                    borderColor:
                      field.value === status ? colors.primary : colors.surface,
                  },
                ]}
              >
                <Text
                  style={{
                    color: field.value === status ? colors.primary : colors.ink,
                    fontWeight: "700",
                  }}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      />
      {errors.status ? (
        <Text style={styles.error}>{errors.status.message}</Text>
      ) : null}

      <Text style={styles.label}>Data de conclusão</Text>
      <Controller
        control={control}
        name="dueDate"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.muted}
            keyboardType="numbers-and-punctuation"
          />
        )}
      />
      {errors.dueDate ? (
        <Text style={styles.error}>{errors.dueDate.message}</Text>
      ) : null}

      {mutation.isError ? (
        <Text style={[styles.error, { marginTop: 14 }]}>
          Não foi possível salvar. Verifique os dados e tente novamente.
        </Text>
      ) : null}
      <Pressable
        style={[styles.button, { marginTop: 26 }]}
        disabled={mutation.isPending}
        onPress={() => void handleSubmit((values) => mutation.mutate(values))()}
      >
        <Text style={styles.buttonText}>
          {mutation.isPending ? "Salvando..." : "Salvar tarefa"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
