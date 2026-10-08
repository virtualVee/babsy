import {
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
import { feedStyles } from "../styles/feedStyles";

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

  const [editLeftHoursError, setEditLeftHoursError] = useState("");
  const [editLeftMinutesError, setEditLeftMinutesError] = useState("");
  const [editLeftSecsError, setEditLeftSecsError] = useState("");

  const [editRightHoursError, setEditRightHoursError] = useState("");
  const [editRightMinutesError, setEditRightMinutesError] = useState("");
  const [editRightSecsError, setEditRightSecsError] = useState("");

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
      style={[
        feedStyles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={feedStyles.content}>
          <Text style={[feedStyles.title, { color: isDark ? "#fff" : "#000" }]}>
            Feed
          </Text>

          {isFeeding && (
            <>
              <Text
                style={[feedStyles.timer, { color: isDark ? "#fff" : "#000" }]}
              >
                {formatDuration(leftSeconds + rightSeconds)}
              </Text>

              <Text
                style={[
                  feedStyles.breastTimer,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Left: {formatDuration(leftSeconds)}
              </Text>

              <Text
                style={[
                  feedStyles.breastTimer,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Right: {formatDuration(rightSeconds)}
              </Text>

              <Text
                style={[
                  feedStyles.activeSide,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                {activeSide ? `${activeSide} breast` : "Select a breast"}
              </Text>

              <View style={feedStyles.sideButtons}>
                <Pressable
                  style={[
                    feedStyles.sideButton,
                    activeSide === "Left" && feedStyles.selectedSideButton,
                  ]}
                  onPress={() => setActiveSide("Left")}
                >
                  <Text style={feedStyles.buttonText}>Left</Text>
                </Pressable>

                <Pressable
                  style={[
                    feedStyles.sideButton,
                    activeSide === "Right" && feedStyles.selectedSideButton,
                  ]}
                  onPress={() => setActiveSide("Right")}
                >
                  <Text style={feedStyles.buttonText}>Right</Text>
                </Pressable>
              </View>
            </>
          )}

          <Pressable style={feedStyles.button} onPress={recordFeed}>
            <Text style={feedStyles.buttonText}>
              {isFeeding ? "Stop feed" : "Start feed"}
            </Text>
          </Pressable>

          <Text
            style={[feedStyles.heading, { color: isDark ? "#fff" : "#000" }]}
          >
            Today
          </Text>

          {feeds.length === 0 ? (
            <Text
              style={[feedStyles.empty, { color: isDark ? "#aaa" : "#666" }]}
            >
              No feeds recorded yet.
            </Text>
          ) : (
            feeds.map((feed, index) => (
              <View key={index} style={feedStyles.feedRow}>
                <Text
                  style={[
                    feedStyles.feedTime,
                    { color: isDark ? "#fff" : "#000" },
                  ]}
                >
                  {`${String(feed.startTime.getHours()).padStart(
                    2,
                    "0",
                  )}:${String(feed.startTime.getMinutes()).padStart(2, "0")}`}
                </Text>

                <Text
                  style={[
                    feedStyles.feedType,
                    { color: isDark ? "#aaa" : "#666" },
                  ]}
                >
                  Breastfeed
                </Text>

                <Text
                  style={[
                    feedStyles.feedType,
                    { color: isDark ? "#aaa" : "#666" },
                  ]}
                >
                  Total: {formatDuration(feed.leftSeconds + feed.rightSeconds)}
                </Text>

                <Text
                  style={[
                    feedStyles.feedType,
                    { color: isDark ? "#aaa" : "#666" },
                  ]}
                >
                  Left: {formatDuration(feed.leftSeconds)} · Right:{" "}
                  {formatDuration(feed.rightSeconds)}
                </Text>

                {editingIndex === index && (
                  <View style={feedStyles.editCard}>
                    <Text style={feedStyles.editTitle}>Edit feed</Text>

                    <View style={feedStyles.editSection}>
                      <Text style={feedStyles.editLabel}>Left breast</Text>

                      <View style={feedStyles.timeInputs}>
                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editLeftHours}
                            onChangeText={(value) => {
                              setEditLeftHours(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditLeftHoursError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editLeftHoursError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editLeftHoursError}
                            </Text>
                          )}
                        </View>

                        <Text style={feedStyles.timeSeparator}>:</Text>

                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editLeftMinutes}
                            onChangeText={(value) => {
                              setEditLeftMinutes(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditLeftMinutesError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editLeftMinutesError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editLeftMinutesError}
                            </Text>
                          )}
                        </View>

                        <Text style={feedStyles.timeSeparator}>:</Text>

                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editLeftSecs}
                            onChangeText={(value) => {
                              setEditLeftSecs(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditLeftSecsError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editLeftSecsError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editLeftSecsError}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={feedStyles.editSection}>
                      <Text style={feedStyles.editLabel}>Right breast</Text>

                      <View style={feedStyles.timeInputs}>
                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editRightHours}
                            onChangeText={(value) => {
                              setEditRightHours(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditRightHoursError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editRightHoursError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editRightHoursError}
                            </Text>
                          )}
                        </View>

                        <Text style={feedStyles.timeSeparator}>:</Text>

                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editRightMinutes}
                            onChangeText={(value) => {
                              setEditRightMinutes(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditRightMinutesError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editRightMinutesError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editRightMinutesError}
                            </Text>
                          )}
                        </View>

                        <Text style={feedStyles.timeSeparator}>:</Text>

                        <View style={feedStyles.timeInputGroup}>
                          <TextInput
                            style={feedStyles.timeInput}
                            selectTextOnFocus
                            value={editRightSecs}
                            onChangeText={(value) => {
                              setEditRightSecs(
                                value.replace(/\D/g, "").slice(0, 2),
                              );
                              setEditRightSecsError("");
                            }}
                            keyboardType="number-pad"
                            maxLength={2}
                          />

                          {editRightSecsError !== "" && (
                            <Text style={feedStyles.editError}>
                              {editRightSecsError}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={feedStyles.editActions}>
                      <Pressable
                        style={feedStyles.cancelButton}
                        onPress={() => setEditingIndex(null)}
                      >
                        <Text style={feedStyles.cancelButtonText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        style={feedStyles.saveButton}
                        onPress={() => {
                          const leftHours = Number(editLeftHours) || 0;
                          const leftMinutes = Number(editLeftMinutes) || 0;
                          const leftSecs = Number(editLeftSecs) || 0;

                          const rightHours = Number(editRightHours) || 0;
                          const rightMinutes = Number(editRightMinutes) || 0;
                          const rightSecs = Number(editRightSecs) || 0;

                          setEditLeftHoursError(leftHours > 23 ? "00–23" : "");
                          setEditLeftMinutesError(
                            leftMinutes > 59 ? "00–59" : "",
                          );
                          setEditLeftSecsError(leftSecs > 59 ? "00–59" : "");

                          setEditRightHoursError(
                            rightHours > 23 ? "00–23" : "",
                          );
                          setEditRightMinutesError(
                            rightMinutes > 59 ? "00–59" : "",
                          );
                          setEditRightSecsError(rightSecs > 59 ? "00–59" : "");

                          if (
                            leftHours > 23 ||
                            rightHours > 23 ||
                            leftMinutes > 59 ||
                            rightMinutes > 59 ||
                            leftSecs > 59 ||
                            rightSecs > 59
                          ) {
                            return;
                          }

                          const newLeftSeconds =
                            leftHours * 3600 + leftMinutes * 60 + leftSecs;

                          const newRightSeconds =
                            rightHours * 3600 + rightMinutes * 60 + rightSecs;

                          setFeeds((currentFeeds) =>
                            currentFeeds.map((currentFeed, feedIndex) =>
                              feedIndex === index
                                ? {
                                    ...currentFeed,
                                    leftSeconds: newLeftSeconds,
                                    rightSeconds: newRightSeconds,
                                  }
                                : currentFeed,
                            ),
                          );

                          setEditingIndex(null);
                        }}
                      >
                        <Text style={feedStyles.saveButtonText}>Save</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <Pressable
                  style={feedStyles.editButton}
                  onPress={() => {
                    setEditingIndex(index);

                    setEditLeftSeconds(feed.leftSeconds);
                    setEditRightSeconds(feed.rightSeconds);

                    setEditLeftHoursError("");
                    setEditLeftMinutesError("");
                    setEditLeftSecsError("");
                    setEditRightHoursError("");
                    setEditRightMinutesError("");
                    setEditRightSecsError("");

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
                  <Text style={feedStyles.editButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={feedStyles.deleteButton}
                  onPress={() => {
                    setFeeds((currentFeeds) =>
                      currentFeeds.filter(
                        (_, feedIndex) => feedIndex !== index,
                      ),
                    );
                  }}
                >
                  <Text style={feedStyles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
