import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const appColours = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#121212',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appColours.background },
      ]}
    >
      <Text style={[styles.title, { color: appColours.text }]}>
        🍼 Feed
      </Text>
      <Text style={{ color: appColours.text }}>
        Feed tracking will go here.
      </Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});