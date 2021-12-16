import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Portal,
  Dialog,
  Modal,
  List,
  Text,
  Button,
  Colors,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

import LoadingPage from "../components/LoadingPage";
import DatabaseManager from "../config/database";
import { AddZero } from "../utils/func";
import ListCredits from "../components/ListCredits";
import PrixAttent from "../components/PrixAttent";

const PADDING = 30;

const PersonCredits = ({ route, navigation }) => {
  const { nom } = route.params;
  const isVisible = useIsFocused();
  const [idPerson, setIdPerson] = useState(0);
  const [id, setId] = useState(0);
  const [credits, setCredits] = useState([]);
  const [credit, setCredit] = useState(null);
  const [AlertEdit, setAlertEdit] = useState(false);
  const [AlertDelete, setAlertDelete] = useState(false);
  const [AlertEnable, setAlertEnable] = useState(false);
  const [alertPrixAttent, setAlertPrixAttent] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  // called when focus screen
  useEffect(() => {
    if (isVisible) {
      console.log("isVisible");
      LoadData();
    }
  }, [isVisible]);

  useEffect(() => {
    if (nom) {
      // get person
      LoadData();
    }
  }, [nom]);

  useEffect(() => {
    if (reload) {
      LoadData();
      setReload(false);
    }
  }, [reload]);

  const LoadData = () => {
    setLoading(true);
    setRefreshing(true);
    DatabaseManager.getPerson("WHERE nom = ?", [nom])
      .then((d) => {
        if (d.length === 1) {
          setIdPerson(d[0].id);
          DatabaseManager.getCredit("WHERE id_person=?", [d[0].id])
            .then((c) => {
              // console.log("credits: ", c);
              setCredits(c);
              setLoading(false);
              setRefreshing(false);
            })
            .catch((errs) => {
              console.log(errs);
              setLoading(false);
              setRefreshing(false);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    LoadData();
  };

  const toCredit = (item) => {
    console.log(item);
  };

  // edit handler
  const editPerson = (id) => {
    setCredit(null);
    navigation.navigate("EditCredits", { id, idPerson });
  };
  const handleEdit = (rowMap, item) => {
    setAlertEdit(true);
    setCredit(item);
  };
  const hideEdit = () => {
    setAlertEdit(false);
    setCredit(null);
  };

  // delete handler
  const deletePerson = (id) => {
    setLoading(true);
    setCredit(null);
    DatabaseManager.getListProduitsCredit("WHERE id_credit=?", [id])
      .then((produits) => {
        // delete products
        produits.forEach((p) => {
          DatabaseManager.deleteListProduitsCreditWithId(p.id)
            .then(() => {
              console.log("p delete");
            })
            .catch((errs) => {
              console.log("delete produit", errs);
              alert("impossible de supprimer, quelque chose de mal tournant");
              setCredit(null);
              setLoading(false);
            });
        });
        DatabaseManager.deleteCreditWithId(id)
          .then(() => {
            LoadData();
          })
          .catch((errs) => {
            console.log("delete credit", errs);
            alert("impossible de supprimer, quelque chose de mal tournant");
            setCredit(null);
            setLoading(false);
          });
      })
      .catch((errs) => {
        console.log("get data produits in credit", errs);
        alert("impossible de supprimer, quelque chose de mal tournant");
        setCredit(null);
        setLoading(false);
      });
  };
  const handleDelete = (rowMap, item) => {
    setAlertDelete(true);
    setCredit(item);
  };
  const hideDelete = () => {
    setAlertDelete(false);
    setCredit(null);
  };

  // enable handler
  const enable = (id) => {
    setLoading(true);
    let date = new Date();
    let d = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${AddZero(
      date.getHours()
    )}:${AddZero(date.getMinutes())}`;
    DatabaseManager.editCredit([
      credit.prix,
      null,
      null,
      credit.prix,
      "1",
      d,
      credit.id,
    ])
      .then(() => {
        console.log(id);
        console.log(credit);
        setCredit(null);
        LoadData();
      })
      .catch((errs) => {
        console.log("enable credit", errs);
        alert(
          "impossible de regler cette credit, quelque chose de mal tournant"
        );
        setCredit(null);
        setLoading(false);
      });
  };
  const handleEnable = (rowMap, item) => {
    setAlertEnable(true);
    setCredit(item);
  };
  const hideEnable = () => {
    setAlertEnable(false);
    setCredit(null);
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <View style={styles.container}>
        {credits.length === 0 ? (
          <View style={styles.containerEmpty}>
            <Text>Les crédits sont vides</Text>
            <Button
              icon="cash-plus"
              onPress={() =>
                navigation.navigate("AddCredits", { id: idPerson })
              }
              color={Colors.orange500}
            >
              Ajouter
            </Button>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {credits.length > 0 && (
              <ListCredits
                listData={credits}
                toCredit={toCredit}
                details={() => console.log("detail")}
                edit={handleEdit}
                remove={handleDelete}
                enable={handleEnable}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}
          </View>
        )}
      </View>

      {/* modal links */}
      <Portal>
        <Modal
          visible={
            credit !== null && !AlertDelete && !AlertEdit && !AlertEnable
          }
          onDismiss={() => setCredit(null)}
          contentContainerStyle={styles.containerStyle}
          style={{ paddingHorizontal: PADDING }}
        >
          <List.Item
            title="Détail"
            left={(props) => (
              <List.Icon {...props} icon="card-account-details" />
            )}
            onPress={() => {
              setCredit(null);
              // toCredits(person.nom);
            }}
          />
          <List.Item
            title="Modifier"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => handleEdit(null, { id: credit.id })}
          />
          <List.Item
            title="Supprimer"
            left={(props) => <List.Icon {...props} icon="account-remove" />}
            onPress={() => handleDelete(null, { id: credit.id })}
          />
          <List.Item
            title="Partager"
            left={(props) => <List.Icon {...props} icon="share" />}
            onPress={() => alert("share: " + credit.id)}
          />
        </Modal>

        {/* ask for regler */}
        <Modal
          visible={AlertEnable}
          onDismiss={hideEnable}
          contentContainerStyle={styles.containerStyle}
          style={{ paddingHorizontal: PADDING }}
        >
          <Text style={styles.titleModel}>Votre régler</Text>

          <List.Item
            title="Règles"
            left={(props) => <List.Icon {...props} icon="cash" />}
            onPress={() => {
              enable(credit.id);
              setAlertEnable(false);
            }}
          />
          <List.Item
            title="Règles Attend"
            left={(props) => <List.Icon {...props} icon="cash-multiple" />}
            onPress={() => {
              setAlertEnable(false);
              setId(credit.id);
              setCredit(null);
              setAlertPrixAttent(true);
            }}
          />
          <List.Item
            title="Annuler"
            left={(props) => <List.Icon {...props} icon="close" />}
            onPress={hideEnable}
          />
        </Modal>

        {/* ask for money if regler attent */}
        <Modal
          visible={alertPrixAttent}
          onDismiss={() => setAlertPrixAttent(false)}
          contentContainerStyle={styles.containerStyle}
          style={{ paddingHorizontal: PADDING }}
        >
          <PrixAttent
            id={id}
            onClose={() => setAlertPrixAttent(false)}
            reloadData={() => setReload(true)}
          />
        </Modal>

        {/* ask for editing */}
        <Dialog visible={AlertEdit} onDismiss={hideEdit}>
          <Dialog.Content>
            <Text>voulez-vous vraiment modifier cette crédit ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideEdit}>Annuler</Button>
            <Button
              onPress={() => {
                editPerson(credit.id);
                setAlertEdit(false);
              }}
            >
              d'accord
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* ask for deleting */}
        <Dialog visible={AlertDelete} onDismiss={hideDelete}>
          <Dialog.Content>
            <Text>voulez-vous vraiment supprimer cette crédit ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDelete}>Annuler</Button>
            <Button
              onPress={() => {
                deletePerson(credit.id);
                setAlertDelete(false);
              }}
            >
              d'accord
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerStyle: {
    backgroundColor: Colors.white,
    paddingVertical: 3,
    // paddingHorizontal: 5,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleModel: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PersonCredits;
