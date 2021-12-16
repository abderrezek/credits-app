import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, ScrollView } from "react-native";
import { RadioButton, Text, Colors, Button, List } from "react-native-paper";

import DatabaseManager from "../config/database";
import ListProduits from "../components/ListProduits";
import LoadingPage from "../components/LoadingPage";
import { AddZero, isNumberDecimal } from "../utils/func";
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

// get & format date
const formatDate = (date) => {
  let fullDate = date.split(" ")[0].split("-");
  let year = fullDate[0];
  let month = fullDate[1];
  let day = fullDate[2];

  let fullTime = date.split(" ")[1].split(":");
  let hour = fullTime[0];
  let minute = fullTime[1];

  return new Date(year, month, day, hour, minute);
};

const EditCredits = ({ route, navigation }) => {
  const { id, idPerson } = route.params;
  console.log(id, idPerson);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [prixTotal, setPrixTotal] = useState(0);
  const [payer, setPayer] = useState(false);
  const [data, setData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (data) {
      setPrixTotal(
        data.reduce((pVal, cVal) => {
          return pVal + cVal.pu * cVal.qt;
        }, 0)
      );
    }
  }, [data]);

  useEffect(() => {
    DatabaseManager.getCredit("WHERE id=?", [id])
      .then((c) => {
        setPrixTotal(c[0].prix);
        setPayer(c[0].est_payer === 1 ? true : false);
        setDate(formatDate(c[0].date_achat));
        DatabaseManager.getListProduitsCredit("WHERE id_credit=?", [c[0].id])
          .then((pds) => {
            // console.log(produits);
            let produits = pds.map((p) => ({
              id: p.id,
              nom: p.nom,
              qt: p.qte,
              pu: p.prix,
            }));
            setData(produits);
            setOldData(produits);
            setLoadingData(false);
          })
          .catch((errs) => {
            console.log("errors when get produits list", errs);
            alert("impossible get liste des produits");
            setLoadingData(false);
            setData([]);
          });
      })
      .catch((errs) => {
        console.log("errors when get credit", errs);
        alert("impossible get credit");
        setLoadingData(false);
        setData([]);
      });
  }, []);

  const edit = () => {
    console.log("oldData: ", oldData);
    // return;
    setLoading(true);
    if (data.length === 0) {
      alert("Vous devez ajouter des produits");
      setLoading(false);
      return;
    }
    // edit old produits
    oldData.forEach((p) => {
      console.log("id", p.id);
      DatabaseManager.deleteListProduitsCreditWithId(p.id)
        .then(() => {
          console.log("tem el hathef");
        })
        .catch((errs) => {
          console.log("delete produits list: ", errs);
          alert("Erreur impossible de supprimer les produits");
          setLoading(false);
        });
    });
    let d = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    DatabaseManager.editCredit([
      prixTotal,
      null,
      null,
      payer ? prixTotal : null,
      payer ? 1 : 0,
      payer ? d : null,
      id,
    ])
      .then(() => {
        data.forEach((produit) => {
          DatabaseManager.createListProduitsCredit([
            idPerson,
            id,
            produit.nom,
            produit.pu,
            produit.qt,
          ])
            .then(() => {
              console.log("tem el hifth");
              // setLoading(false);
            })
            .catch((errs) => {
              console.log("impossible edit list item: ", errs);
              alert("impossible d'modifier les produits");
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
        console.log("create credit: ", errs);
        alert("Erreur impossible d'modifier un nouveau credit");
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

  if (loadingData) {
    return <LoadingPage />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* est regler */}
        <RadioButton.Group
          onValueChange={(p) => setPayer(p)}
          value={payer.toString()}
        >
          <View style={styles.radioElems}>
            <View style={styles.radioElem}>
              <RadioButton value="true" />
              <Text>Est Réglé</Text>
            </View>
            <View style={styles.radioElem}>
              <RadioButton value="false" />
              <Text>Est n'est Réglé</Text>
            </View>
          </View>
        </RadioButton.Group>

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
          icon="account-cash-outline"
          mode="contained"
          onPress={edit}
        >
          Modifier
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

export default EditCredits;
