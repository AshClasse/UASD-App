import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          'Authorization': `Bearer ${token}`,
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

  const renderEventDetails = (item) => {
    return (
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.titulo}</Text>
        <Text style={styles.eventText}>Descripción: {item.descripcion}</Text>
        <Text style={styles.eventText}>Fecha: {new Date(item.fechaEvento).toLocaleString()}</Text>
        <Text style={styles.eventText}>Lugar: {item.lugar}</Text>
        <Text style={styles.eventText}>Coordenadas: {item.coordenadas}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos de la UASD</Text>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Button
                title="Ver detalles"
                onPress={() => Alert.alert("Detalles del Evento", renderEventDetails(item))}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  eventItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 14,
    marginTop: 5,
  },
  eventDetails: {
    padding: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default Eventos;