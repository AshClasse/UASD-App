import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Tareas = ({ navigation }) => {
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTareas = async () => {
        try {
          const authToken = await AsyncStorage.getItem("authToken");

          if (!authToken) {
            Alert.alert("Error", "Debes iniciar sesión primero.");
            navigation.navigate("Iniciar Sesión");
            return;
          }

          const response = await axios.get("https://uasdapi.ia3x.com/tareas", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.data) {
            setTareas(response.data);
          } else {
            Alert.alert("Error", "No se encontraron tareas disponibles.");
          }
        } catch (error) {
          console.error("Error al cargar las tareas:", error);
          Alert.alert("Error", "Hubo un problema al cargar las tareas.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchTareas();
    }, [navigation])
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        item.completada ? styles.taskCompleted : styles.taskPending,
      ]}
    >
      <Text style={styles.taskTitle}>{item.titulo}</Text>
      <Text style={styles.taskDescription}>{item.descripcion}</Text>
      <Text style={styles.taskDate}>
        Fecha de vencimiento:{" "}
        {new Date(item.fechaVencimiento).toLocaleDateString()}
      </Text>
      <Text style={styles.taskStatus}>
        Estado: {item.completada ? "Completada" : "Pendiente"}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  if (tareas.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.noTasksText}>
          No hay tareas disponibles en este momento.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tareas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  noTasksText: {
    fontSize: 16,
    color: "gray",
  },
  list: {
    paddingBottom: 20,
  },
  taskItem: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "#f9f9f9",
  },
  taskCompleted: {
    borderLeftWidth: 5,
    borderLeftColor: "green",
  },
  taskPending: {
    borderLeftWidth: 5,
    borderLeftColor: "red",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  taskDate: {
    fontSize: 14,
    color: "#555",
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default Tareas;
