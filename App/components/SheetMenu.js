import React from "react";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

export default function SheetMenu({ sheetRef, renderContent }) {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[450, 300, 0]}
      borderRadius={10}
      renderContent={renderContent}
    />
  );
}
