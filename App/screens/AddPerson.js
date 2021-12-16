import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  RadioButton,
  Text,
  TextInput,
  Button,
  Colors,
  HelperText,
} from "react-native-paper";

import DatabaseManager from "../config/database";
import { isPhoneNumber } from "../utils/func";
const MARGIN = 10;

const AddPerson = ({ navigation }) => {
  const [nom, setNom] = useState("");
  const [phone, setPhone] = useState("");
  const [genre, setGenre] = useState("homme");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const add = () => {
    setLoading(true);
    if (nom === "" || phone === "" || phoneIsVrais()) {
      setShowError(true);
      setLoading(false);
      return;
    }
    // search if person exist
    DatabaseManager.getPerson("WHERE nom = ?", [nom])
      .then((p) => {
        console.log(p);
        // if not exist
        if (p.length === 0) {
          DatabaseManager.createPerson([nom, phone, genre === "homme" ? 0 : 1])
            .then(() => {
              setLoading(false);
              navigation.navigate("PersonCredits", { nom });
            })
            .catch((err) => {
              console.log("add: ", err.message);
              setLoading(false);
            });
        } else {
          // if exist
          alert("Person exist!");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("if exist: ", err);
        setLoading(false);
      });
  };

  const handlePhoneNumber = (n) => {
    if (/^\d+$/.test(n) || n === "") {
      setPhone(n);
    }
  };

  const phoneIsVrais = () => phone !== "" && !isPhoneNumber(phone);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* nom */}
        <TextInput
          label="Nom et Prénom"
          value={nom}
          onChangeText={(t) => setNom(t)}
          selectionColor={Colors.orange600}
          activeUnderlineColor={Colors.orange600}
          // error={showError && nom === ""}
          right={
            <TextInput.Icon
              name="pencil-remove"
              size={24}
              onPress={() => setNom("")}
            />
          }
        />
        {showError && nom === "" && (
          <HelperText type="error" visible={nom === ""}>
            Nom et Prénom est requis
          </HelperText>
        )}

        {/* telephone */}
        <TextInput
          label="Numéro de Téléphone"
          value={phone}
          onChangeText={handlePhoneNumber}
          selectionColor={Colors.orange600}
          activeUnderlineColor={Colors.orange600}
          style={{ marginTop: MARGIN }}
          keyboardType="numeric"
          maxLength={10}
          // clearButtonMode="while-editing"
          // error={showError && phone === ""}
          right={
            <TextInput.Icon
              name="pencil-remove"
              size={24}
              onPress={() => setPhone("")}
            />
          }
        />
        {showError && phoneIsVrais() && (
          <HelperText type="error" visible={phoneIsVrais()}>
            Numéro de Téléphone ce n'est pas vrais
          </HelperText>
        )}
        {showError && phone === "" && (
          <HelperText type="error" visible={phone === ""}>
            Numéro de Téléphone est requis
          </HelperText>
        )}

        {/* genre */}
        <View style={{ marginVertical: MARGIN }}>
          <Text style={styles.caption}>Genre</Text>
          <RadioButton.Group onValueChange={(nv) => setGenre(nv)} value={genre}>
            <View style={styles.genre}>
              <RadioButton.Item
                label="Homme"
                value="homme"
                position="leading"
                color={Colors.orange600}
              />
              <RadioButton.Item
                label="Femelle"
                value="femelle"
                position="leading"
                color={Colors.orange600}
              />
            </View>
          </RadioButton.Group>
        </View>

        <Button
          uppercase
          loading={loading}
          color={Colors.orange600}
          labelStyle={{ color: Colors.white }}
          icon="account-plus"
          mode="contained"
          onPress={add}
        >
          Ajouter
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 13,
  },
  caption: {
    fontSize: 14,
    color: "gray",
    marginBottom: MARGIN,
  },
  genre: { flexDirection: "row" },
  genreElem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  dateNaissance: {
    marginBottom: MARGIN,
    flexDirection: "row",
    alignItems: "center",
  },
  txtErrors: {
    color: Colors.red600,
  },
});

export default AddPerson;
