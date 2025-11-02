import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          title: "Note APP",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#111827" }, // header stays dark
          headerTintColor: "#fff", // header text white
          contentStyle: { backgroundColor: "#111827" }, // page stays dark too
        }}
      />
    </SafeAreaProvider>
  );
}
