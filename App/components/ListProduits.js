import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Text,
  Portal,
  Modal,
  Colors,
  IconButton,
  TextInput,
  Button,
  HelperText,
  Dialog,
} from "react-native-paper";

import { isNumberInt, isNumberDecimal } from "../utils/func";
const SIZE_ICON_HEADER = 25;

const Produit = ({ produit, remove }) => (
  <View style={styles.produitContainer}>
    <Text>
      {produit.nom} - ({produit.qt})
    </Text>

    <IconButton
      icon="delete"
      size={23}
      color={Colors.red600}
      onPress={remove}
    />
  </View>
);

const AddItem = ({ margin, onClose, data, setData }) => {
  const [nom, setNom] = useState("");
  const [qte, setQte] = useState("");
  const [prix, setPrix] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const add = () => {
    setLoading(true);
    if (data.filter((p) => p.nom === nom).length > 0) {
      alert("le produit est existe");
      setLoading(false);
      return;
    }
    if (nom === "" || qte === "" || qte <= 0 || prix === "" || prix <= 0) {
      setShowError(true);
      setLoading(false);
      return;
    }
    console.log(nom, qte, prix);
    setData((prevState) => {
      return [
        ...prevState,
        { id: prevState.length + 1, nom, qt: qte, pu: prix },
      ];
    });
    setLoading(false);
    onClose();
  };

  const onChangeQte = (text) => (isNumberInt(text) ? setQte(text) : setQte(1));

  const onChangePrix = (text) =>
    isNumberDecimal(text) ? setPrix(text) : setPrix(0);

  return (
    <ScrollView>
      <View>
        <Text style={styles.header}>Ajouter nouveau produit</Text>

        {/* nom produit */}
        <TextInput
          label="Nom de produit"
          value={nom}
          onChangeText={(t) => setNom(t)}
          selectionColor={Colors.orange600}
          activeUnderlineColor={Colors.orange600}
        />
        {showError && nom === "" && (
          <HelperText type="error" visible={nom === ""}>
            Nom de produit est requis
          </HelperText>
        )}

        {/* qty produit */}
        <View style={{ marginVertical: margin }}>
          <TextInput
            label="Qte de produit"
            value={qte.toString()}
            onChangeText={onChangeQte}
            keyboardType="number-pad"
            selectionColor={Colors.orange600}
            activeUnderlineColor={Colors.orange600}
          />
          {showError && qte === "" && qte <= 0 && (
            <HelperText type="error" visible={qte === "" && qte <= 0}>
              Qte de produit est requis et pas moins que 0
            </HelperText>
          )}
        </View>

        {/* prix produit */}
        <TextInput
          label="Prix unitaire de produit"
          value={prix.toString()}
          onChangeText={onChangePrix}
          keyboardType="decimal-pad"
          selectionColor={Colors.orange600}
          activeUnderlineColor={Colors.orange600}
        />
        {showError && prix === "" && prix <= 0 && (
          <HelperText type="error" visible={prix === "" && prix <= 0}>
            Prix de produit est requis et pas moins que 0
          </HelperText>
        )}

        {/* buttons */}
        <View style={[styles.footer, { marginTop: margin }]}>
          <Button mode="contained" onPress={add} loading={loading}>
            Ajouter
          </Button>

          <Button
            style={{ marginHorizontal: 5 }}
            mode="outlined"
            onPress={onClose}
          >
            Annuler
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const ListProduits = ({ data, setData, margin }) => {
  const [visible, setVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const removeItem = (id) =>
    setData((prevState) => prevState.filter((p) => p.id !== id));

  const handleRemoveAll = () => {
    setData([]);
    setShowDialog(false);
  };

  return (
    <>
      <View style={[styles.container, { marginVertical: margin }]}>
        <View style={styles.head}>
          <Text>Liste des produits</Text>

          <View style={styles.rightBtns}>
            <IconButton
              icon="delete-sweep"
              color={Colors.red600}
              size={SIZE_ICON_HEADER}
              onPress={() => setShowDialog(true)}
              disabled={data.length === 0}
            />
            <IconButton
              icon="plus-circle-outline"
              color={Colors.grey800}
              size={SIZE_ICON_HEADER}
              onPress={() => setVisible(true)}
            />
          </View>
        </View>

        {data.length > 0 &&
          data.map((p, i) => (
            <Produit key={i} produit={p} remove={() => removeItem(p.id)} />
          ))}
      </View>

      <Portal>
        {/* modal add new */}
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.containerStyle}
          style={{ paddingHorizontal: 10 }}
        >
          <AddItem
            margin={margin}
            onClose={() => setVisible(false)}
            data={data}
            setData={setData}
          />
        </Modal>

        {/* dialog if remove all */}
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Supprimer</Dialog.Title>
          <Dialog.Content>
            <Text>Voulez-vous vraiment supprimer tous les produits</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Non</Button>
            <Button onPress={handleRemoveAll}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  produitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerStyle: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
  },
  footer: { flexDirection: "row-reverse" },
});

export default ListProduits;
