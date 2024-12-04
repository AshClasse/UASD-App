import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const SolicitudesScreen = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const tiposSolicitudes = [
    { codigo: "beca", descripcion: "Solicitud de beca" },
    { codigo: "carta_estudio", descripcion: "Carta de estudios" },
    { codigo: "record_nota", descripcion: "Record de nota" },
  ];

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        Alert.alert("Error", "Debes iniciar sesión primero.");
        navigation.navigate("Iniciar Sesión");
        navigation.navigate("Iniciar Sesión");
      navigation.navigate("Iniciar Sesión");
        return;
      }

      const response = await axios.get(
        "https://uasdapi.ia3x.com/mis_solicitudes",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        setSolicitudes(response.data.data);
      } else {
        Alert.alert("Error", "No se pudieron cargar las solicitudes.");
      }
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      Alert.alert("Error", "Ocurrió un error al cargar las solicitudes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        navigation.navigate("Iniciar Sesión");
        navigation.navigate("Iniciar Sesión");
      navigation.navigate("Iniciar Sesión");
        return;
      }

      setIsLoading(true); 

      const response = await axios.post(
        "https://uasdapi.ia3x.com/cancelar_solicitud", 
        id, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Éxito", "Solicitud cancelada exitosamente.");
        fetchSolicitudes();
      } else {
        Alert.alert("Error", "No se pudo cancelar la solicitud.");
      }
    } catch (error) {
      console.error(
        "Error al cancelar solicitud:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Ocurrió un error al cancelar la solicitud.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleTipoSelect = (codigo) => {
    setTipo(codigo);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!tipo || !descripcion) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        navigation.navigate("Iniciar Sesión");
        navigation.navigate("Iniciar Sesión");
      navigation.navigate("Iniciar Sesión");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        "https://uasdapi.ia3x.com/crear_solicitud",
        { tipo, descripcion },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json", 
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Éxito", "Solicitud creada correctamente.");
        fetchSolicitudes();
      } else {
        Alert.alert("Error", "No se pudo crear la solicitud.");
      }
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      Alert.alert("Error", "Ocurrió un error.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSolicitudes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Solicitud</Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>
          {tipo
            ? tiposSolicitudes.find((t) => t.codigo === tipo).descripcion
            : "Selecciona el tipo de solicitud"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Descripción de la solicitud"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>
          {isLoading ? "Cargando..." : "Enviar Solicitud"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FlatList
              data={tiposSolicitudes}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleTipoSelect(item.codigo)}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item.descripcion}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.codigo}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Mis Solicitudes</Text>
      <FlatList
        data={solicitudes}
        renderItem={({ item }) => (
          <View style={styles.solicitudItem}>
            <Text>
              {tiposSolicitudes.find((t) => t.codigo === item.tipo)
                ?.descripcion || "Desconocido"}
            </Text>
            <Text>{item.descripcion}</Text>
            <Text>{item.fechaVencimiento}</Text>
            <TouchableOpacity
              onPress={() => handleCancel(item.id)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
  },
  modalItem: {
    padding: 10,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
  },
  solicitudItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
  },
});

export default SolicitudesScreen;
