import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";

import Navigation from "./config/Navigation";
import DatabaseManager from "./config/database";

export default () => {
  useEffect(() => {
    DatabaseManager.initializeDatabase();
  }, []);

  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
};
