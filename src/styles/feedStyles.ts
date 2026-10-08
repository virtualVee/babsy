import { StyleSheet } from "react-native";

export const feedStyles = StyleSheet.create({
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
  editLabel: {
    fontSize: 16,
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
  editError: {
    fontSize: 14,
    color: "#c00",
    marginBottom: 12,
  },
  editSection: {
    marginBottom: 16,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
  },
  timeInput: {
    width: 48,
    height: 44,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: "600",
  },
  errorRow: {
  flexDirection: "row",
  gap: 6,
  marginTop: 4,
},
timeInputGroup: {
  alignItems: "center",
  justifyContent: "flex-start",
},
});
