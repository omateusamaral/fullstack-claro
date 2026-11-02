import { Pressable, Text } from "react-native";
import { Task, COLORS_BY_STATUS } from "../types";
import { styles } from "../styles";

export function TaskCard({
  task,
  onPress,
}: {
  task: Task;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
    >
      <Text
        style={{
          color: styles.title.color,
          fontSize: 17,
          fontWeight: "700",
          marginTop: 12,
        }}
      >
        {task.title}
      </Text>
      {task.description ? (
        <Text
          numberOfLines={2}
          style={{ color: styles.subtitle.color, marginTop: 6 }}
        >
          {task.description}
        </Text>
      ) : null}
      <Text
        style={{
          color: COLORS_BY_STATUS[task.status ?? "pendente"],
          fontSize: 12,
          fontWeight: "700",
          marginTop: 12,
        }}
      >
        {task.status ?? "pendente"}
      </Text>
    </Pressable>
  );
}
