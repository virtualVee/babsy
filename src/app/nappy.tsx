import { Text, View, useColorScheme, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { nappyStyles } from "../styles/nappyStyles";

type Texture = "Solid" | "Mushy" | "Runny";
type Colour = "Brown" | "Green" | "Yellow" | "Black" | "Red" | "Grey" | "Other";

type NappyRecord = {
  id: string;
  recordedAt: string;
  wet: boolean;
  dirty: boolean;
  dry: boolean;
  textures: Texture[];
  colours: Colour[];
  notes: string;
};

const getNappyIcons = (record: NappyRecord) => {
  const icons: string[] = [];

  if (record.wet) icons.push("💧");
  if (record.dirty) icons.push("🧻");
  if (record.dry) icons.push("🌵");

  if (record.dirty) {
    if (record.textures.includes("Solid")) icons.push("💩");
    if (record.textures.includes("Mushy")) icons.push("🫟");
    if (record.textures.includes("Runny")) icons.push("💦");

    if (record.colours.includes("Brown")) icons.push("🟤");
    if (record.colours.includes("Green")) icons.push("🟢");
    if (record.colours.includes("Yellow")) icons.push("🟡");
    if (record.colours.includes("Black")) icons.push("⚫");
    if (record.colours.includes("Red")) icons.push("🔴");
    if (record.colours.includes("Grey")) icons.push("⚪");
    if (record.colours.includes("Other")) icons.push("❓");
  }

  if (record.notes.trim()) icons.push("📝");

  return icons.join(" ");
};

export default function NappyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [wet, setWet] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dry, setDry] = useState(false);

  const [textures, setTextures] = useState<Texture[]>([]);
  const [colours, setColours] = useState<Colour[]>([]);
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<NappyRecord[]>([]);

  const dryDisabled = wet || dirty;

  const toggleWet = () => {
    setWet(!wet);
    setDry(false);
  };

  const toggleDirty = () => {
    setDirty(!dirty);
    setDry(false);
  };

  const toggleDry = () => {
    if (!wet && !dirty) {
      setDry(!dry);
    }
  };

  const toggleTexture = (texture: Texture) => {
    if (textures.includes(texture)) {
      setTextures(textures.filter((item) => item !== texture));
    } else {
      setTextures([...textures, texture]);
    }
  };

  const toggleColour = (colour: Colour) => {
    if (colours.includes(colour)) {
      setColours(colours.filter((item) => item !== colour));
    } else {
      setColours([...colours, colour]);
    }
  };

  const recordNappy = () => {
    if (!wet && !dirty && !dry) {
      return;
    }

    const newRecord: NappyRecord = {
      id: Date.now().toString(),
      recordedAt: new Date().toISOString(),
      wet,
      dirty,
      dry,
      textures,
      colours,
      notes,
    };

    setRecords((current) => [newRecord, ...current]);

    setWet(false);
    setDirty(false);
    setDry(false);
    setTextures([]);
    setColours([]);
    setNotes("");
  };

  return (
    <SafeAreaView
      style={[
        nappyStyles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <View style={nappyStyles.content}>
        <Text style={[nappyStyles.title, { color: isDark ? "#fff" : "#000" }]}>
          Nappy
        </Text>

        <Text
          style={[nappyStyles.heading, { color: isDark ? "#fff" : "#000" }]}
        >
          What type?
        </Text>

        <View style={nappyStyles.typeButtons}>
          <Pressable
            style={[
              nappyStyles.typeButton,

              wet && nappyStyles.selectedTypeButton,

              dry && { opacity: 0.35 },
            ]}
            onPress={toggleWet}
          >
            <Text
              style={[
                nappyStyles.buttonText,

                dry && { textDecorationLine: "line-through" },
              ]}
            >
              Wet
            </Text>
          </Pressable>

          <Pressable
            style={[
              nappyStyles.typeButton,

              dirty && nappyStyles.selectedTypeButton,

              dry && { opacity: 0.35 },
            ]}
            onPress={toggleDirty}
          >
            <Text
              style={[
                nappyStyles.buttonText,

                dry && { textDecorationLine: "line-through" },
              ]}
            >
              Dirty
            </Text>
          </Pressable>

          <Pressable
            style={[
              nappyStyles.typeButton,

              dry && nappyStyles.selectedTypeButton,

              (wet || dirty) && { opacity: 0.35 },
            ]}
            onPress={toggleDry}
          >
            <Text
              style={[
                nappyStyles.buttonText,

                (wet || dirty) && { textDecorationLine: "line-through" },
              ]}
            >
              Dry
            </Text>
          </Pressable>
        </View>

        {dirty && (
          <>
            <Text
              style={[nappyStyles.heading, { color: isDark ? "#fff" : "#000" }]}
            >
              Texture
            </Text>

            <View style={nappyStyles.optionButtons}>
              {(["Solid", "Mushy", "Runny"] as Texture[]).map((option) => (
                <Pressable
                  key={option}
                  style={[
                    nappyStyles.optionButton,
                    textures.includes(option) &&
                      nappyStyles.selectedOptionButton,
                  ]}
                  onPress={() => toggleTexture(option)}
                >
                  <Text style={nappyStyles.buttonText}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text
              style={[nappyStyles.heading, { color: isDark ? "#fff" : "#000" }]}
            >
              Colour
            </Text>

            <View style={nappyStyles.optionButtons}>
              {(
                [
                  "Brown",
                  "Green",
                  "Yellow",
                  "Black",
                  "Red",
                  "Grey",
                  "Other",
                ] as Colour[]
              ).map((option) => (
                <Pressable
                  key={option}
                  style={[
                    nappyStyles.optionButton,
                    colours.includes(option) &&
                      nappyStyles.selectedOptionButton,
                  ]}
                  onPress={() => toggleColour(option)}
                >
                  <Text style={nappyStyles.buttonText}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text
              style={[nappyStyles.heading, { color: isDark ? "#fff" : "#000" }]}
            >
              Notes
            </Text>

            <TextInput
              style={nappyStyles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes..."
              placeholderTextColor={isDark ? "#888" : "#999"}
              multiline
            />
          </>
        )}

        <Pressable style={nappyStyles.recordButton} onPress={recordNappy}>
          <Text style={nappyStyles.recordButtonText}>Record nappy</Text>
        </Pressable>

        <Text
          style={[nappyStyles.heading, { color: isDark ? "#fff" : "#000" }]}
        >
          Today
        </Text>

        {records.length === 0 ? (
          <Text style={{ color: isDark ? "#fff" : "#000" }}>
            No nappies recorded today.
          </Text>
        ) : (
          records.map((record) => (
            <View key={record.id}>
              <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
                {new Date(record.recordedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {getNappyIcons(record)}
              </Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}
