import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MateriasScreen = ({ navigation }) => {
  const [materias, setMaterias] = useState([]); 
  const [preseleccionadas, setPreseleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthToken = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {

          Alert.alert("Error", "Debes iniciar sesión primero.");
          navigation.navigate("Iniciar Sesión");
        navigation.navigate("Iniciar Sesión");
      navigation.navigate("Iniciar Sesión");
        } else {

          fetchMateriasDisponibles();
          fetchPreseleccionadas();
        }
      };
      checkAuthToken();
    }, [])
  );

  const fetchMateriasDisponibles = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "https://uasdapi.ia3x.com/materias_disponibles",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMaterias(response.data || []);
    } catch (error) {
      console.error("Error al obtener las materias disponibles:", error);
      Alert.alert("Error", "No se pudo cargar las materias disponibles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreseleccionadas = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "https://uasdapi.ia3x.com/ver_preseleccion",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPreseleccionadas(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener las preselecciones:", error);
      Alert.alert("Error", "No se pudo cargar las preselecciones.");
    }
  };

  const preseleccionarMateria = async (codigo) => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        "https://uasdapi.ia3x.com/preseleccionar_materia",
        JSON.stringify(codigo),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Éxito", "Materia preseleccionada.");
        fetchPreseleccionadas();
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo preseleccionar la materia.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarPreseleccion = async (codigo) => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        "https://uasdapi.ia3x.com/cancelar_preseleccion_materia",
        JSON.stringify(codigo),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Éxito", "Materia cancelada.");
        fetchPreseleccionadas(); 
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la preselección.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (materia) => {
    setSelectedMateria(materia);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMateria(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Materias Disponibles</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : materias.length === 0 ? (
        <Text>No hay materias disponibles.</Text>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.materiaItem}>
              <Text>{item.nombre}</Text>
              <Text>{item.horario}</Text>
              <Text>{item.aula}</Text>
              <Button
                style={styles.button}
                title="Preseleccionar"
                onPress={() => openModal(item)}
              />
            </View>
          )}
        />
      )}

      <Text style={styles.sectionTitle}>Mis Preselecciones</Text>

      {preseleccionadas.length === 0 ? (
        <Text>No tienes preselecciones.</Text>
      ) : (
        <FlatList
          data={preseleccionadas}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.preseleccionItem}>
              <Text>
                {item.nombre} - {item.aula}
              </Text>
              <Button
                style={styles.button}
                title="Cancelar Preselección"
                onPress={() => cancelarPreseleccion(item.codigo)}
              />
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMateria && (
              <>
                <Text style={styles.modalTitle}>Preseleccionar Materia</Text>
                <Text>{selectedMateria.nombre}</Text>
                <Text>{selectedMateria.horario}</Text>
                <Text>{selectedMateria.aula}</Text>
                <Button
                  title="Preseleccionar"
                  onPress={() => preseleccionarMateria(selectedMateria.codigo)}
                />
                <Button title="Cerrar" onPress={closeModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    marginTop: 10,
  },
  materiaItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  preseleccionItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 250,
    backgroundColor: "white",
    padding: 10,
  },
  modalTitle: {
    fontWeight: "bold",
  },
});

export default MateriasScreen;
