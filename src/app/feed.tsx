import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
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
  const [hasLoadedFeeds, setHasLoadedFeeds] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLeftSeconds, setEditLeftSeconds] = useState(0);
  const [editRightSeconds, setEditRightSeconds] = useState(0);

  const [editLeftHours, setEditLeftHours] = useState("00");
  const [editLeftMinutes, setEditLeftMinutes] = useState("00");
  const [editLeftSecs, setEditLeftSecs] = useState("00");

  const [editRightHours, setEditRightHours] = useState("00");
  const [editRightMinutes, setEditRightMinutes] = useState("00");
  const [editRightSecs, setEditRightSecs] = useState("00");

  const [feedStartTime, setFeedStartTime] = useState<Date | null>(null);

  const [isFeeding, setIsFeeding] = useState(false);
  const [activeSide, setActiveSide] = useState<"Left" | "Right" | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(0);
  const [rightSeconds, setRightSeconds] = useState(0);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const storedFeeds = await AsyncStorage.getItem("babsy-feeds");

        if (!storedFeeds) {
          setHasLoadedFeeds(true);
          return;
        }

        const parsedFeeds = JSON.parse(storedFeeds);

        const restoredFeeds: Feed[] = parsedFeeds.map(
          (feed: {
            startTime: string;
            leftSeconds: number;
            rightSeconds: number;
          }) => ({
            ...feed,
            startTime: new Date(feed.startTime),
          }),
        );

        setFeeds(restoredFeeds);
        setHasLoadedFeeds(true);
      } catch (error) {
        console.error("Failed to load feeds:", error);
        setHasLoadedFeeds(true);
      }
    };

    loadFeeds();
  }, []);

  useEffect(() => {
    if (!hasLoadedFeeds) return;

    const saveFeeds = async () => {
      try {
        await AsyncStorage.setItem("babsy-feeds", JSON.stringify(feeds));
      } catch (error) {
        console.error("Failed to save feeds:", error);
      }
    };

    saveFeeds();
  }, [feeds, hasLoadedFeeds]);

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
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
            Feed
          </Text>

          {isFeeding && (
            <>
              <Text style={[styles.timer, { color: isDark ? "#fff" : "#000" }]}>
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
                style={[styles.activeSide, { color: isDark ? "#fff" : "#000" }]}
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
                  style={[styles.feedTime, { color: isDark ? "#fff" : "#000" }]}
                >
                  {`${String(feed.startTime.getHours()).padStart(
                    2,
                    "0",
                  )}:${String(feed.startTime.getMinutes()).padStart(2, "0")}`}
                </Text>

                <Text
                  style={[styles.feedType, { color: isDark ? "#aaa" : "#666" }]}
                >
                  Breastfeed
                </Text>

                <Text
                  style={[styles.feedType, { color: isDark ? "#aaa" : "#666" }]}
                >
                  Total: {formatDuration(feed.leftSeconds + feed.rightSeconds)}
                </Text>

                <Text
                  style={[styles.feedType, { color: isDark ? "#aaa" : "#666" }]}
                >
                  Left: {formatDuration(feed.leftSeconds)} · Right:{" "}
                  {formatDuration(feed.rightSeconds)}
                </Text>

                {editingIndex === index && (
                  <View style={styles.editCard}>
                    <Text style={styles.editTitle}>Edit feed</Text>

                    <View style={styles.editSection}>
                      <Text style={styles.editLabel}>Left breast</Text>

                      <View style={styles.timeInputs}>
                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editLeftHours}
                          onChangeText={(value) => {
                            setEditLeftHours(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />

                        <Text style={styles.timeSeparator}>:</Text>

                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editLeftMinutes}
                          onChangeText={(value) => {
                            setEditLeftMinutes(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />

                        <Text style={styles.timeSeparator}>:</Text>

                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editLeftSecs}
                          onChangeText={(value) => {
                            setEditLeftSecs(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={styles.editSection}>
                      <Text style={styles.editLabel}>Right breast</Text>

                      <View style={styles.timeInputs}>
                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editRightHours}
                          onChangeText={(value) => {
                            setEditRightHours(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />

                        <Text style={styles.timeSeparator}>:</Text>

                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editRightMinutes}
                          onChangeText={(value) => {
                            setEditRightMinutes(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />

                        <Text style={styles.timeSeparator}>:</Text>

                        <TextInput
                          style={styles.timeInput}
                          selectTextOnFocus
                          value={editRightSecs}
                          onChangeText={(value) => {
                            setEditRightSecs(
                              value.replace(/\D/g, "").slice(0, 2),
                            );
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={styles.editActions}>
                      <Pressable
                        style={styles.doneButton}
                        onPress={() => Keyboard.dismiss()}
                      >
                        <Text style={styles.doneButtonText}>Done</Text>
                      </Pressable>

                      <Pressable
                        style={styles.cancelButton}
                        onPress={() => setEditingIndex(null)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        style={styles.saveButton}
                        onPress={() => {
                          setFeeds((currentFeeds) =>
                            currentFeeds.map((currentFeed, feedIndex) =>
                              feedIndex === index
                                ? {
                                    ...currentFeed,
                                    leftSeconds: editLeftSeconds,
                                    rightSeconds: editRightSeconds,
                                  }
                                : currentFeed,
                            ),
                          );

                          setEditingIndex(null);
                        }}
                      >
                        <Text style={styles.saveButtonText}>Save</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                <Pressable
                  style={styles.editButton}
                  onPress={() => {
                    setEditingIndex(index);

                    setEditLeftSeconds(feed.leftSeconds);
                    setEditRightSeconds(feed.rightSeconds);

                    setEditLeftHours(
                      String(Math.floor(feed.leftSeconds / 3600)).padStart(
                        2,
                        "0",
                      ),
                    );
                    setEditLeftMinutes(
                      String(
                        Math.floor((feed.leftSeconds % 3600) / 60),
                      ).padStart(2, "0"),
                    );
                    setEditLeftSecs(
                      String(feed.leftSeconds % 60).padStart(2, "0"),
                    );

                    setEditRightHours(
                      String(Math.floor(feed.rightSeconds / 3600)).padStart(
                        2,
                        "0",
                      ),
                    );
                    setEditRightMinutes(
                      String(
                        Math.floor((feed.rightSeconds % 3600) / 60),
                      ).padStart(2, "0"),
                    );
                    setEditRightSecs(
                      String(feed.rightSeconds % 60).padStart(2, "0"),
                    );
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    setFeeds((currentFeeds) =>
                      currentFeeds.filter(
                        (_, feedIndex) => feedIndex !== index,
                      ),
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </TouchableWithoutFeedback>
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
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    fontSize: 15,
    color: "#c00",
    fontWeight: "600",
  },
  editButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  editButtonText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  editCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  editValue: {
    fontSize: 15,
    marginTop: 3,
  },
  adjustButtons: {
    flexDirection: "row",
    gap: 8,
  },
  adjustButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  adjustButtonText: {
    fontSize: 22,
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#bbb",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  doneButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
