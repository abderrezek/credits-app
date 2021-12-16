import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { TextInput, Button, Colors } from "react-native-paper";

import DatabaseManager from "../config/database";
import { AddZero, isNumberDecimal } from "../utils/func";

const MARGIN = 10;

const PrixAttent = ({ onClose, id, reloadData }) => {
  const [prix, setPrix] = useState("");
  const [loading, setLoading] = useState(false);

  const onPress = () => {
    setLoading(true);
    DatabaseManager.getCredit("WHERE id=?", [id])
      .then((c) => {
        console.log("credit:", c);

        let date = new Date();
        let d = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${AddZero(
          date.getHours()
        )}:${AddZero(date.getMinutes())}`;
        DatabaseManager.editCredit([
          c[0].prix,
          parseFloat(prix),
          d,
          null,
          0,
          null,
          c[0].id,
        ])
          .then(() => {
            setLoading(false);
            reloadData();
            onClose();
          })
          .catch((errs) => {
            console.log("edit credit prix attent", errs);
            alert(
              "impossible de modifier le credit, quelque chose de mal tournant"
            );
            setLoading(false);
          });
      })
      .catch((errs) => {
        console.log("get attent", errs);
        alert(
          "impossible de recuperer le credit, quelque chose de mal tournant"
        );
        setLoading(false);
      });
  };

  const onChangePhone = (text) => {
    if (isNumberDecimal(text)) {
      setPrix(text);
    } else {
      setPrix("");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          label="Prix"
          value={prix}
          onChangeText={onChangePhone}
          selectionColor={Colors.orange600}
          activeUnderlineColor={Colors.orange600}
          right={<TextInput.Affix text="DZD" />}
          keyboardType="number-pad"
        />

        <Button
          loading={loading}
          style={styles.btn}
          mode="contained"
          onPress={onPress}
        >
          Payer
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  btn: {
    marginTop: MARGIN,
    color: Colors.white,
    backgroundColor: Colors.orange500,
  },
});

export default PrixAttent;
