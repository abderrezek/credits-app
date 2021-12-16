import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import { StyleSheet, View, Platform, ScrollView } from "react-native";
import { Text, Colors, Button, List } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import DatabaseManager from "../config/database";
import ListProduits from "../components/ListProduits";
import { AddZero } from "../utils/func";
const MARGIN = 10;
const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const AddCredits = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [prixTotal, setPrixTotal] = useState(0);
  const [idPerson, setIdPerson] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    params: { id },
  } = useRoute();
  console.log(id);

  useEffect(() => {
    if (id) {
      setIdPerson(id);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      setPrixTotal(
        data.reduce((pVal, cVal) => {
          return pVal + cVal.pu * cVal.qt;
        }, 0)
      );
    }
  }, [data]);

  const add = () => {
    setLoading(true);
    if (data.length === 0) {
      alert("Vous devez ajouter des produits");
      setLoading(false);
      return;
    }
    let d = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${AddZero(
      date.getHours()
    )}:${AddZero(date.getMinutes())}`;
    DatabaseManager.createCredit([idPerson, d, prixTotal])
      .then(() => {
        // get last id after create
        DatabaseManager.GetLastIdAdd()
          .then((lastId) => {
            // ajouter plusier produits
            data.forEach((produit) => {
              DatabaseManager.createListProduitsCredit([
                id,
                lastId,
                produit.nom,
                produit.pu,
                produit.qt,
              ])
                .then(() => {
                  console.log("tem el hifth");
                })
                .catch((errs) => {
                  console.log("impossible add list item: ", errs);
                  alert("impossible d'ajouter les produits");
                  setLoading(false);
                });
            });
            setLoading(false);
            navigation.navigate({
              name: "PersonCredits",
              merge: true,
            });
          })
          .catch((errs) => {
            console.log("impossible get last id: ", errs);
            alert("Erreurs");
            setLoading(false);
          });
      })
      .catch((errs) => {
        console.log("create credit: ", errs);
        alert("Erreur impossible d'ajouter un nouveau credit");
        setLoading(false);
      });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => showMode("date");

  const showTimepicker = () => showMode("time");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const getDate = () => {
    return `${DAYS[date.getDay()]}, ${AddZero(date.getDate())} ${
      MONTHS[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const getTime = () =>
    `${AddZero(date.getHours())}:${AddZero(date.getMinutes())}`;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* prix */}
        {<Text style={styles.prix}>Prix Total: {prixTotal} DZD</Text>}

        {/* date achat */}
        <List.Item
          style={{ marginTop: MARGIN }}
          title={getDate()}
          right={(props) => <List.Icon {...props} icon="calendar-account" />}
          onPress={showDatepicker}
        />
        {/* time achat */}
        <List.Item
          style={{ marginTop: MARGIN }}
          title={getTime()}
          right={(props) => <List.Icon {...props} icon="account-clock" />}
          onPress={showTimepicker}
        />
        {/* date & time picker */}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}

        {/* produits */}
        <ListProduits data={data} setData={setData} margin={MARGIN} />

        <Button
          uppercase
          loading={loading}
          color={Colors.orange600}
          labelStyle={{ color: Colors.white }}
          icon="cash-plus"
          mode="contained"
          onPress={add}
        >
          Ajouter
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingVertical: 10 },
  prix: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 3,
    fontSize: 18,
  },
  radioElems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  radioElem: { flexDirection: "row", alignItems: "center" },
});

export default AddCredits;
