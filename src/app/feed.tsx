import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

type Feed = {
  startTime: Date;
  leftSeconds: number;
  rightSeconds: number;
};

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [feedStartTime, setFeedStartTime] = useState<Date | null>(null);

  const [isFeeding, setIsFeeding] = useState(false);
  const [activeSide, setActiveSide] = useState<
    "Left" | "Right" | null
  >(null);
  const [leftSeconds, setLeftSeconds] = useState(0);
  const [rightSeconds, setRightSeconds] = useState(0);

  useEffect(() => {
    if (!isFeeding) return;

    const timer = setInterval(() => {
      if (activeSide === "Left") {
        setLeftSeconds((seconds) => seconds + 1);
      } else if (activeSide === "Right") {
        setRightSeconds((seconds) => seconds + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isFeeding, activeSide]);

  const recordFeed = () => {
    if (!isFeeding) {
      setLeftSeconds(0);
      setRightSeconds(0);
      setActiveSide(null);
      setFeedStartTime(new Date());
      setIsFeeding(true);
      return;
    }

    const newFeed: Feed = {
      startTime: feedStartTime ?? new Date(),
      leftSeconds,
      rightSeconds,
    };

    setFeeds((currentFeeds) => [newFeed, ...currentFeeds]);

    setIsFeeding(false);
    setActiveSide(null);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
          Feed
        </Text>

        {isFeeding && (
          <>
            <Text
              style={[styles.timer, { color: isDark ? "#fff" : "#000" }]}
            >
              {formatDuration(leftSeconds + rightSeconds)}
            </Text>

            <Text
              style={[
                styles.breastTimer,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              Left: {formatDuration(leftSeconds)}
            </Text>

            <Text
              style={[
                styles.breastTimer,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              Right: {formatDuration(rightSeconds)}
            </Text>

            <Text
              style={[
                styles.activeSide,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              {activeSide ? `${activeSide} breast` : "Select a breast"}
            </Text>

            <View style={styles.sideButtons}>
              <Pressable
                style={[
                  styles.sideButton,
                  activeSide === "Left" && styles.selectedSideButton,
                ]}
                onPress={() => setActiveSide("Left")}
              >
                <Text style={styles.buttonText}>Left</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.sideButton,
                  activeSide === "Right" && styles.selectedSideButton,
                ]}
                onPress={() => setActiveSide("Right")}
              >
                <Text style={styles.buttonText}>Right</Text>
              </Pressable>
            </View>
          </>
        )}

        <Pressable style={styles.button} onPress={recordFeed}>
          <Text style={styles.buttonText}>
            {isFeeding ? "Stop feed" : "Start feed"}
          </Text>
        </Pressable>

        <Text style={[styles.heading, { color: isDark ? "#fff" : "#000" }]}>
          Today
        </Text>

        {feeds.length === 0 ? (
          <Text style={[styles.empty, { color: isDark ? "#aaa" : "#666" }]}>
            No feeds recorded yet.
          </Text>
        ) : (
          feeds.map((feed, index) => (
            <View key={index} style={styles.feedRow}>
              <Text
                style={[
                  styles.feedTime,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                {`${String(feed.startTime.getHours()).padStart(
                  2,
                  "0"
                )}:${String(feed.startTime.getMinutes()).padStart(2, "0")}`}
              </Text>

              <Text
                style={[
                  styles.feedType,
                  { color: isDark ? "#aaa" : "#666" },
                ]}
              >
                Breastfeed
              </Text>

              <Text
                style={[
                  styles.feedType,
                  { color: isDark ? "#aaa" : "#666" },
                ]}
              >
                Total: {formatDuration(feed.leftSeconds + feed.rightSeconds)}
              </Text>

              <Text
                style={[
                  styles.feedType,
                  { color: isDark ? "#aaa" : "#666" },
                ]}
              >
                Left: {formatDuration(feed.leftSeconds)} · Right:{" "}
                {formatDuration(feed.rightSeconds)}
              </Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 32,
    marginBottom: 12,
  },
  empty: {
    fontSize: 16,
  },
  feedRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  feedTime: {
    fontSize: 20,
    fontWeight: "600",
  },
  feedType: {
    fontSize: 15,
    marginTop: 4,
  },
  timer: {
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 24,
  },
  activeSide: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  sideButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  selectedSideButton: {
    backgroundColor: "#aaa",
  },
  breastTimer: {
    fontSize: 20,
    marginBottom: 8,
  },
});