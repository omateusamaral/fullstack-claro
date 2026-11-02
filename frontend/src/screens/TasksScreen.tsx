import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { fetchTasks } from "../api/services";
import { colors, styles } from "../styles";
import { TaskCard } from "../components/TaskCard";
import { TaskStatus } from "../types";

type TasksScreenProps = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
  route: {
    params?: {
      teamId?: string;
      teamName?: string;
    };
  };
};

const PAGE_SIZE = 10;

export function TasksScreen({ navigation, route }: TasksScreenProps) {
  const teamId = route.params?.teamId;
  const teamName = route.params?.teamName;
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus | undefined>();
  const [appliedSearch, setAppliedSearch] = React.useState("");
  const [appliedStatus, setAppliedStatus] = React.useState<
    TaskStatus | undefined
  >();
  const [order, setOrder] = React.useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = React.useState(0);
  const query = useQuery({
    queryKey: ["tasks", teamId, appliedSearch, appliedStatus, order, page],
    queryFn: () =>
      fetchTasks(teamId, {
        search: appliedSearch || undefined,
        status: appliedStatus,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        order,
      }),
  });
  const tasks = query.data?.tasks ?? [];
  const total = query.data?.total ?? 0;
  const hasPreviousPage = page > 0;
  const hasNextPage = (page + 1) * PAGE_SIZE < total;

  const applyFilters = () => {
    setPage(0);
    setAppliedSearch(search.trim());
    setAppliedStatus(status);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Tarefas</Text>
          <Text style={styles.subtitle}>
            {teamName ? `Tarefas do time ${teamName}` : "Todas as tarefas"}
          </Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("TaskForm", { teamId })}
        >
          <Text style={styles.buttonText}>+ Nova</Text>
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por título ou descrição"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => {
            applyFilters();
          }}
        />
        <Text style={styles.label}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
        >
          <Pressable
            onPress={() => setStatus(undefined)}
            style={[
              styles.card,
              {
                marginRight: 8,
                paddingVertical: 10,
                borderColor:
                  status === undefined ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              style={{
                color: status === undefined ? colors.primary : colors.ink,
                fontWeight: "700",
              }}
            >
              Todos
            </Text>
          </Pressable>
          {Object.values(TaskStatus).map((option) => (
            <Pressable
              key={option}
              onPress={() => setStatus(option)}
              style={[
                styles.card,
                {
                  marginRight: 8,
                  paddingVertical: 10,
                  borderColor:
                    status === option ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: status === option ? colors.primary : colors.ink,
                  fontWeight: "700",
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          style={[styles.button, { marginTop: 8 }]}
          onPress={() => {
            applyFilters();
          }}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
        <Text style={styles.label}>Ordenação</Text>
        <View style={[styles.row, { marginTop: 8 }]}>
          {(["ASC", "DESC"] as const).map((value) => (
            <Pressable
              key={value}
              onPress={() => {
                setOrder(value);
                setPage(0);
              }}
              style={[
                styles.filterButton,
                {
                  marginRight: 8,
                  borderColor:
                    order === value ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: order === value ? colors.primary : colors.ink,
                  fontWeight: "700",
                }}
              >
                {value === "ASC" ? "A-Z" : "Z-A"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {query.isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : query.isError ? (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={styles.error}>
            Não foi possível carregar as tarefas deste time.
          </Text>
          <Pressable
            style={[styles.buttonSecondary, { marginTop: 12 }]}
            onPress={() => void query.refetch()}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : tasks.length ? (
        <>
          {total > 100 ? (
            <Text style={{ color: colors.warning, marginBottom: 12 }}>
              Há mais de 100 tarefas para estes filtros. Refinar a busca pode
              ajudar a encontrar uma tarefa específica.
            </Text>
          ) : null}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate("TaskDetails", { task })}
            />
          ))}
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 8 },
            ]}
          >
            <Pressable
              style={[
                styles.buttonSecondary,
                !hasPreviousPage && styles.disabledButton,
              ]}
              onPress={() => setPage((current) => current - 1)}
              disabled={!hasPreviousPage}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </Pressable>
            <Text style={{ color: colors.muted }}>
              Página {page + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}
            </Text>
            <Pressable
              style={[
                styles.buttonSecondary,
                !hasNextPage && styles.disabledButton,
              ]}
              onPress={() => setPage((current) => current + 1)}
              disabled={!hasNextPage}
            >
              <Text style={styles.buttonText}>Próxima</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text
          style={{ color: colors.muted, textAlign: "center", marginTop: 24 }}
        >
          Nenhuma tarefa encontrada.
        </Text>
      )}
    </ScrollView>
  );
}
