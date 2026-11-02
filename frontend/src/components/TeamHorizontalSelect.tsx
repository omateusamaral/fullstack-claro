import { Control, Controller, FieldErrors } from "react-hook-form";
import { ScrollView, Pressable, Text } from "react-native";
import { styles, colors } from "../styles";
import { TaskStatus, Team } from "../types";
import { UseQueryResult } from "@tanstack/react-query";

interface TeamHorizontalSelectProps {
  teamsQuery: UseQueryResult<Team[], Error>;
  control: Control<any>;
  teams: Team[];
  errors: FieldErrors<{
    title: string;
    teamIds: string[];
    status: TaskStatus;
    dueDate: string;
    description?: string | undefined;
  }>;
}
export function TeamHorizontalSelect({
  teamsQuery,
  control,
  teams,
  errors,
}: TeamHorizontalSelectProps) {
  return (
    <>
      {teamsQuery.isError ? (
        <Text style={styles.error}>
          Não foi possível carregar os times. Tente novamente.
        </Text>
      ) : null}
      <Controller
        control={control}
        name="teamIds"
        render={({ field }) => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            {teams.map((team) => (
              <Pressable
                key={team.id}
                onPress={() =>
                  field.onChange(
                    field.value.includes(team.id)
                      ? field.value.filter((id: string) => id !== team.id)
                      : [...field.value, team.id],
                  )
                }
                style={[
                  styles.card,
                  {
                    marginRight: 8,
                    paddingVertical: 10,
                    borderColor: field.value.includes(team.id)
                      ? team.colorHex
                      : colors.surface,
                  },
                ]}
              >
                <Text style={{ color: team.colorHex, fontWeight: "700" }}>
                  {team.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      />
      {errors.teamIds ? (
        <Text style={styles.error}>{errors.teamIds.message}</Text>
      ) : null}
    </>
  );
}
