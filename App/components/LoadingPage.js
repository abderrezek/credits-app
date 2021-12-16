import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Colors } from "react-native-paper";

const LoadingPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} color={Colors.orange600} />
    </View>
  );
};

export default LoadingPage;
