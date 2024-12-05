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
  TouchableOpacity
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
        <Text style={styles.text}>No hay materias disponibles.</Text>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.materiaItem}>
              <Text style={styles.materiaName}>{item.nombre}</Text>
              <Text style={styles.materiaDetails}>{item.horario}</Text>
              <Text style={styles.materiaDetails}>{item.aula}</Text>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => openModal(item)}
              >
                <Text style={styles.buttonText}>Preseleccionar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.sectionTitle}>Mis Preselecciones</Text>

      {preseleccionadas.length === 0 ? (
        <Text style={styles.text}>No tienes preselecciones.</Text>
      ) : (
        <FlatList
          data={preseleccionadas}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.preseleccionItem}>
              <Text style={styles.preseleccionText}>
                {item.nombre} - {item.aula}
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelarPreseleccion(item.codigo)}
              >
                <Text style={styles.buttonText}>Cancelar Preselección</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMateria && (
              <>
                <Text style={styles.modalTitle}>Preseleccionar Materia</Text>
                <Text style={styles.modalMateriaName}>{selectedMateria.nombre}</Text>
                <Text style={styles.modalDetails}>{selectedMateria.horario}</Text>
                <Text style={styles.modalDetails}>{selectedMateria.aula}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => preseleccionarMateria(selectedMateria.codigo)}
                >
                  <Text style={styles.buttonText}>Preseleccionar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
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
    backgroundColor: "#f9fbfc",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  materiaItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  materiaName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  materiaDetails: {
    fontSize: 14,
    color: "#555",
  },
  preseleccionItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  preseleccionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalMateriaName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});

export default MateriasScreen;
