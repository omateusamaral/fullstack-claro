import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors, styles } from "../styles";

type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({
  message = "Carregando...",
}: LoadingScreenProps) {
  return (
    <View style={[styles.screen, styles.loadingScreen]}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
