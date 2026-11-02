import { Text, View } from "react-native";
import { Team } from "../types";

export function TeamChip({ team }: { team: Team }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${team?.colorHex ?? "#000000"}18`,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: team?.colorHex ?? "#000000",
          marginRight: 6,
        }}
      />
      <Text
        style={{
          color: team?.colorHex ?? "#000000",
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {team?.name}
      </Text>
    </View>
  );
}
