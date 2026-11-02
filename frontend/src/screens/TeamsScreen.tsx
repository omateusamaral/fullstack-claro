import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { deleteTeam, fetchTeams } from "../api/services";
import { colors, styles } from "../styles";
import { TeamChip } from "../components/TeamChip";
import { useDebounce } from "use-debounce";
import { MaterialIcons } from "@expo/vector-icons";
import { Team } from "../types";

export function TeamsScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [searchDebounced] = useDebounce(search, 500);
  const query = useQuery({
    queryKey: ["teams", searchDebounced],
    queryFn: () => fetchTeams(searchDebounced.trim() || undefined),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível remover o time.",
      );
    },
  });

  const confirmDelete = (team: Team) => {
    Alert.alert(
      "Remover time",
      `Tem certeza que deseja remover o time "${team.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => deleteMutation.mutate(team.id),
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Times</Text>
        <Pressable
          style={[styles.buttonSecondary, { marginBottom: 8 }]}
          onPress={() => navigation.navigate("Tasks")}
        >
          <Text style={styles.buttonText}>Todas as tarefas</Text>
        </Pressable>

        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar time"
            placeholderTextColor={colors.muted}
            style={styles.input}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
        {query.isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : query.isError ? (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={styles.error}>
              Não foi possível carregar os times.
            </Text>
            <Pressable
              style={[styles.buttonSecondary, { marginTop: 12 }]}
              onPress={() => void query.refetch()}
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          query.data?.map((team) => (
            <View key={team.id} style={styles.card}>
              <TeamChip team={team} />
              {team.description ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "space-between",
                    justifyContent: "space-between",
                    paddingHorizontal: 8,
                  }}
                >
                  <Text style={{ color: colors.muted, marginTop: 10 }}>
                    {team.description}
                  </Text>
                </View>
              ) : null}
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 16,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: colors.surface,
                  },
                ]}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { flex: 1, marginRight: 8, flexDirection: "row" },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() =>
                    navigation.navigate("Tasks", {
                      teamId: team.id,
                      teamName: team.name,
                    })
                  }
                >
                  <MaterialIcons name="checklist" size={18} color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 6 }]}>
                    Tarefas
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Editar ${team.name}`}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => navigation.navigate("TeamForm", { team })}
                  disabled={deleteMutation.isPending}
                >
                  <MaterialIcons name="edit" size={19} color={colors.primary} />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Remover ${team.name}`}
                  style={({ pressed }) => [
                    styles.iconButton,
                    { marginLeft: 8, borderColor: `${colors.error}66` },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => confirmDelete(team)}
                  disabled={deleteMutation.isPending}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={colors.error}
                  />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { position: "absolute", bottom: 20, right: 20 },
          pressed && { opacity: 0.75 },
        ]}
        onPress={() => navigation.navigate("TeamForm")}
      >
        <Text style={styles.buttonText}>Criar Time</Text>
      </Pressable>
    </View>
  );
}
