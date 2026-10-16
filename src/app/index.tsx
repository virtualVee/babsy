import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const appColours = {
    background: isDarkMode ? "#242426" : "#fafafa",
    text: isDarkMode ? "#f2f2f2" : "#29292c",
    button: isDarkMode ? "#333336" : "#ededf0",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: appColours.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: appColours.text }]}>Babsy</Text>

        <Text style={[styles.subtitle, { color: appColours.text }]}>
          Baby's Routine
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appColours.text }]}>
            Breastfeed
          </Text>

          <View style={styles.buttonRow}>
            {["⬅️ Left", "Right ➡️"].map((label) => (
              <Pressable
                key={label}
                style={[styles.button, { backgroundColor: appColours.button }]}
                onPress={() => router.push("/feed")}
              >
                <Text style={[styles.buttonText, { color: appColours.text }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appColours.text }]}>
            Food
          </Text>

          <View style={styles.buttonRow}>
            {["🍳 Breakfast", "🍴 Lunch", "🍴 Dinner", "🍎 Snack"].map(
              (label) => (
                <View
                  key={label}
                  style={[
                    styles.button,
                    { backgroundColor: appColours.button },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: appColours.text }]}>
                    {label}
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>
        {[
          {
            title: "Nappy",
            buttons: ["💧 Wet", "🧻 Dirty", "💧🧻 Wet & dirty", "🌵 Dry"],
          },
          {
            title: "Sleep",
            buttons: ["😴 Sleep"],
          },
          {
            title: "Pump",
            buttons: ["⛽ Log", "❄️ Storage"],
          },
          {
            title: "Routine",
            buttons: ["🛁 Bath", "🥾 Walk", "📖 Book"],
          },
          {
            title: "Journal",
            buttons: ["📝 Add an entry"],
          },
        ].map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: appColours.text }]}>
              {section.title}
            </Text>

            <View style={styles.buttonRow}>
              {section.buttons.map((label) => (
                <View
                  key={label}
                  style={[
                    styles.button,
                    { backgroundColor: appColours.button },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: appColours.text }]}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
