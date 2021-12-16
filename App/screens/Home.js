import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Colors,
  Text,
  Portal,
  Modal,
  List,
  Searchbar,
  Dialog,
  Button,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import DatabaseManager from "../config/database";
import LoadingPage from "../components/LoadingPage";
import ListPersons from "../components/ListPersons";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [person, setPerson] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPerson, setSearchPerson] = useState("");
  const [AlertEdit, setAlertEdit] = useState(false);
  const [AlertDelete, setAlertDelete] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = () => {
    DatabaseManager.getPerson()
      .then((d) => {
        // console.log(d);
        setData(d);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((errs) => {
        console.log(errs);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const toCredits = (nom, id) =>
    navigation.navigate("PersonCredits", { nom, id });

  const longPress = (p) => setPerson(p);

  // edit handler
  const editPerson = (id) => {
    setPerson(null);
    navigation.navigate("EditPerson", { id });
  };
  const handleEdit = (rowMap, item) => {
    setAlertEdit(true);
    setPerson(item);
  };
  const hideEdit = () => {
    setAlertEdit(false);
    setPerson(null);
  };

  // delete handler
  const deletePerson = (id) => {
    setLoading(true);
    setPerson(null);
    DatabaseManager.deletePersonWithId(id)
      .then(() => {
        console.log("deleted");
        LoadData();
      })
      .catch((errs) => {
        console.log("not deleted, ", errs);
        alert("impossible de supprimer, quelque chose de mal tournant");
        setPerson(null);
        setLoading(false);
      });
  };
  const handleDelete = (rowMap, item) => {
    setAlertDelete(true);
    setPerson(item);
  };
  const hideDelete = () => {
    setAlertDelete(false);
    setPerson(null);
  };

  // share handler
  const shareBtn = (rowMap, item) => alert("share " + item.nom);

  const handleRefresh = () => {
    setRefreshing(true);
    LoadData();
  };

  const onChangeSearch = (query) => {
    setLoading(true);
    setSearchPerson(query);
    if (query === "") {
      LoadData();
    } else {
      DatabaseManager.getPerson("WHERE nom LIKE ?", [`${query}%`])
        .then((p) => {
          console.log(p);
          setData(p);
          setLoading(false);
        })
        .catch((errs) => {
          console.log("search errs: ", errs);
          setLoading(false);
        });
    }
  };

  return (
    <>
      {/* search */}
      <Searchbar
        placeholder="Cherche quelqu'un ici..."
        onChangeText={onChangeSearch}
        value={searchPerson}
        style={{ elevation: 0 }}
      />
      {/* content */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <LoadingPage />
        ) : (
          <View style={{ flex: 1, paddingTop: 8 }}>
            {data.length > 0 ? (
              <ListPersons
                listData={data}
                toCredits={toCredits}
                details={longPress}
                edit={handleEdit}
                remove={handleDelete}
                share={shareBtn}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={50}
                  color={Colors.grey600}
                />
                <Text style={styles.emptyTitle}>Il n'est aucun persons</Text>
              </View>
            )}
          </View>
        )}
      </View>
      {/* modal links */}
      <Portal>
        <Modal
          visible={person !== null && !AlertDelete && !AlertEdit}
          onDismiss={() => setPerson(null)}
          contentContainerStyle={styles.containerStyle}
          style={{ paddingHorizontal: 30 }}
        >
          <List.Item
            title="Détail"
            left={(props) => (
              <List.Icon {...props} icon="card-account-details" />
            )}
            onPress={() => {
              setPerson(null);
              toCredits(person.nom);
            }}
          />
          <List.Item
            title="Modifier"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => handleEdit(null, { id: person.id })}
          />
          <List.Item
            title="Supprimer"
            left={(props) => <List.Icon {...props} icon="account-remove" />}
            onPress={() => handleDelete(null, { id: person.id })}
          />
          <List.Item
            title="Partager"
            left={(props) => <List.Icon {...props} icon="share" />}
            onPress={() => alert("share: " + person.id)}
          />
        </Modal>

        {/* ask for editing */}
        <Dialog visible={AlertEdit} onDismiss={hideEdit}>
          <Dialog.Content>
            <Text>voulez-vous vraiment modifier cette client ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideEdit}>Annuler</Button>
            <Button
              onPress={() => {
                editPerson(person.id);
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
            <Text>voulez-vous vraiment supprimer cette client ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDelete}>Annuler</Button>
            <Button
              onPress={() => {
                deletePerson(person.id);
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
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
    backgroundColor: Colors.orange600,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, color: Colors.grey600 },
  containerStyle: {
    backgroundColor: Colors.white,
    paddingVertical: 3,
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
});

export default Home;
