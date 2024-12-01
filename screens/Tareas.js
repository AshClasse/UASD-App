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

  // Verificación del token y carga de tareas al obtener el foco
  useFocusEffect(
    React.useCallback(() => {
      const fetchTareas = async () => {
        try {
          const authToken = await AsyncStorage.getItem("authToken");

          if (!authToken) {
            Alert.alert("Error", "Debes iniciar sesión primero.");
            navigation.navigate("Login"); // Redirige a Login si no hay token
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
            Alert.alert("Error", "No se pudieron cargar las tareas");
          }
        } catch (error) {
          Alert.alert("Error", "Hubo un problema al cargar las tareas");
        } finally {
          setIsLoading(false);
        }
      };

      fetchTareas();
    }, [navigation]) // Agregar navigation como dependencia para asegurar que se redirige correctamente
  );

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text>{item.titulo}</Text>
      <Text>{item.descripcion}</Text>
      <Text>{item.fechaVencimiento}</Text>
      <Text>{item.completada ? "Completada" : "Pendiente"}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tareas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  taskItem: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});

export default Tareas;
