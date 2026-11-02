import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "./src/query";
import { TeamsScreen } from "./src/screens/TeamsScreen";
import { TasksScreen } from "./src/screens/TasksScreen";
import { TaskDetailsScreen } from "./src/screens/TaskDetailsScreen";
import { TaskFormScreen } from "./src/screens/TaskFormScreen";
import { TeamFormScreen } from "./src/screens/TeamFormScreen";
import { ErrorBoundary } from "./src/components/ErrorBoundary";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Teams"
                component={TeamsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Tasks"
                component={TasksScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TaskForm"
                component={TaskFormScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TeamForm"
                component={TeamFormScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
