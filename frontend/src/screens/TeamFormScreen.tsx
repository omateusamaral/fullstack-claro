import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Pressable, ScrollView, Text, TextInput } from "react-native";
import { createTeam, TeamInput, updateTeam } from "../api/services";
import { colors, styles } from "../styles";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Use pelo menos 3 caracteres")
    .max(100, "Máximo de 100 caracteres"),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor hexadecimal, como #FF5733"),
  description: z.string().max(200, "Máximo de 200 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

export function TeamFormScreen({ navigation, route }: any) {
  const editing = route.params?.team;
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editing?.name ?? "",
      colorHex: editing?.colorHex ?? "#FF5733",
      description: editing?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const input: TeamInput = {
        name: values.name.trim(),
        colorHex: values.colorHex.trim().toUpperCase(),
        description: values.description?.trim() || undefined,
      };
      return editing ? updateTeam(editing.id, input) : createTeam(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teams"] });
      navigation.goBack();
    },
    onError: (error) =>
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : `Não foi possível ${editing ? "editar" : "criar"} o time.`,
      ),
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{editing ? "Editar time" : "Criar time"}</Text>
      <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

      <Text style={styles.label}>Nome</Text>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ex.: Agile Team"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
          />
        )}
      />
      {errors.name ? (
        <Text style={styles.error}>{errors.name.message}</Text>
      ) : null}

      <Text style={styles.label}>Cor</Text>
      <Controller
        control={control}
        name="colorHex"
        render={({ field }) => (
          <TextInput
            style={[styles.input, { color: field.value ?? colors.ink }]}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="#FF5733"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        )}
      />
      {errors.colorHex ? (
        <Text style={styles.error}>{errors.colorHex.message}</Text>
      ) : null}

      <Text style={styles.label}>Descrição</Text>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Descreva o time, seus objetivos e metas"
            placeholderTextColor={colors.muted}
            multiline
          />
        )}
      />
      {errors.description ? (
        <Text style={styles.error}>{errors.description.message}</Text>
      ) : null}

      {mutation.isError ? (
        <Text style={[styles.error, { marginTop: 14 }]}>
          Não foi possível {editing ? "editar" : "criar"} o time. Verifique os
          dados e tente novamente.
        </Text>
      ) : null}
      <Pressable
        testID="submit-team"
        style={[styles.button, { marginTop: 26 }]}
        disabled={mutation.isPending}
        onPress={() => void handleSubmit((values) => mutation.mutate(values))()}
      >
        <Text style={styles.buttonText}>
          {mutation.isPending
            ? editing
              ? "Salvando..."
              : "Criando..."
            : editing
              ? "Salvar alterações"
              : "Criar time"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
