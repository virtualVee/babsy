import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const appColours = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    button: isDarkMode ? "#2a2a2a" : "#f2f2f2",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: appColours.background }]}
    >
      <Text style={[styles.title, { color: appColours.text }]}>Babsy</Text>

      <Text style={[styles.subtitle, { color: appColours.text }]}>
        Baby's Routine
      </Text>

      <Pressable
        style={[styles.button, { backgroundColor: appColours.button }]}
        onPress={() => router.push("/feed")}
      >
        <Text style={[styles.buttonText, { color: appColours.text }]}>
          🍼 Feed
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: appColours.button }]}
        onPress={() => router.push("/nappy")}
      >
        <Text style={[styles.buttonText, { color: appColours.text }]}>
          🧷 Nappy
        </Text>
      </Pressable>

      <View style={[styles.button, { backgroundColor: appColours.button }]}>
        <Text style={[styles.buttonText, { color: appColours.text }]}>
          😴 Sleep
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
