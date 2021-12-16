import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import {
  Text,
  IconButton,
  Colors,
  Portal,
  Button,
  Dialog,
} from "react-native-paper";

const About = () => {
  const [open, setOpen] = useState(false);

  const goUrl = () => {
    let url = "http://abderrezek.netlify.app";
    setOpen(false);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Je ne sais pas comment ouvrir URI: " + url);
      }
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.nom}>Abderrezek Gallal</Text>

          <Text style={styles.desc}>Ingénieure en Informatique</Text>

          <IconButton
            size={30}
            color={Colors.grey800}
            icon="web"
            onPress={() => setOpen(true)}
          />
        </View>
      </View>

      <Portal>
        <Dialog visible={open} onDismiss={() => setOpen(false)}>
          <Dialog.Content>
            <Text>Vous serez emmené sur le site web</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpen(false)}>Annuler</Button>
            <Button onPress={goUrl}>d'accord</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nom: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: Colors.grey700,
  },
  desc: {
    fontSize: 18,
    fontWeight: "900",
  },
});

export default About;
