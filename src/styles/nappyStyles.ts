import { StyleSheet } from "react-native";

export const nappyStyles = StyleSheet.create({
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

  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
  },

  typeButtons: {
    flexDirection: "row",
    gap: 8,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#ddd",
    alignItems: "center",
  },

  selectedTypeButton: {
    backgroundColor: "#A8BFA3",
  },

  optionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#ddd",
    alignItems: "center",
  },

  selectedOptionButton: {
    backgroundColor: "#A8BFA3",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  notesInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },

  recordButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#A8BFA3",
    alignItems: "center",
  },

  recordButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
