import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    return token;
  };

  const fetchEventos = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getAuthToken();

      if (!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://uasdapi.ia3x.com/eventos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setEventos(response.data);
      } else {
        setError("No events available at the moment.");
      }
    } catch (err) {
      setError("Error fetching events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos de la UASD</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Text style={styles.eventSummary}>
                {item.descripcion
                  ? item.descripcion.slice(0, 100) + "..."
                  : "No description available."}
              </Text>
              <Button
                title="Ver detalles"
                color="#007bff"
                onPress={() => showEventDetails(item)}
              />
            </View>
          )}
        />
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedEvent && (
              <>
                <Text style={styles.modalTitle}>{selectedEvent.titulo}</Text>
                <Text style={styles.modalText}>
                  Descripción: {selectedEvent.descripcion}
                </Text>
                <Text style={styles.modalText}>
                  Fecha: {new Date(selectedEvent.fechaEvento).toLocaleString()}
                </Text>
                <Text style={styles.modalText}>
                  Lugar: {selectedEvent.lugar}
                </Text>
                <Text style={styles.modalText}>
                  Coordenadas: {selectedEvent.coordenadas}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343a40",
    textAlign: "center",
    marginBottom: 20,
  },
  eventItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  eventSummary: {
    fontSize: 14,
    color: "#495057",
    marginVertical: 5,
  },
  error: {
    color: "#dc3545",
    textAlign: "center",
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#495057",
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default Eventos;
