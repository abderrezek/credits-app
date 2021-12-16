import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Text,
  HelperText,
  RadioButton,
  Button,
  Colors,
} from "react-native-paper";

import LoadingPage from "../components/LoadingPage";
import DatabaseManager from "../config/database";
import { isPhoneNumber } from "../utils/func";
const MARGIN = 10;

const EditPerson = ({ navigation, route }) => {
  const { id } = route.params;
  const [nom, setNom] = useState("");
  const [oldNom, setOldNom] = useState("");
  const [phone, setPhone] = useState("");
  const [genre, setGenre] = useState("homme");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPerson, setLoadingPerson] = useState(true);

  useEffect(() => {
    if (id) {
      DatabaseManager.getPerson("WHERE id=?", [id])
        .then((p) => {
          console.log(p);
          if (p.length > 0) {
            setNom(p[0]["nom"]);
            setOldNom(p[0]["nom"]);
            setPhone(p[0]["phone"]);
            setGenre(p[0]["genre"] === 0 ? "homme" : "femelle");
            setLoadingPerson(false);
          } else {
            navigation.goBack();
          }
        })
        .catch((errs) => {
          console.log(errs);
          alert("Erreur edit person, ", errs);
          navigation.goBack();
        });
    }
  }, [id]);

  const edit = () => {
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
        if (p.length === 0 || oldNom === nom) {
          DatabaseManager.editPerson([
            nom,
            phone,
            genre === "homme" ? 0 : 1,
            id,
          ])
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
          alert("Personne existe!");
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

  if (loadingPerson) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingPage />
      </View>
    );
  }

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
          icon="account-edit"
          mode="contained"
          onPress={edit}
        >
          Modifier
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

export default EditPerson;
