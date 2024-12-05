import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Noticias = ({ navigation }) => {
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNoticias = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      if (!authToken) {
        Alert.alert("Error", "Debes iniciar sesión primero.", [
          {
            text: "Ir a iniciar sesión",
            onPress: () => navigation.navigate("Iniciar Sesión"),
          },
        ]);
        return;
      }

      const response = await axios.get("https://uasdapi.ia3x.com/noticias", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setNoticias(response.data.data);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Error al cargar noticias."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las noticias.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchNoticias();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          Publicado: {new Date(item.date).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate("DetallesNoticia", { noticia: item })
          }
        >
          <Text style={styles.detailsButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loaderText}>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  newsItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007bff",
  },
});

export default Noticias;
