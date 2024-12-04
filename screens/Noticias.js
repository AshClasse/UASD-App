import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
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
        Alert.alert("Error", "Debes iniciar sesión primero.");
        navigation.navigate("Iniciar Sesión");
        navigation.navigate("Iniciar Sesión");
      navigation.navigate("Iniciar Sesión");
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
        Alert.alert("Error", response.data.message || "Failed to load news");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load news.");
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
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 5,
  },
  newsItem: {
    backgroundColor: "#f8f9fa",
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ff0000",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#000000",
  },
  date: {
    fontSize: 10,
    color: "#666666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loaderText: {
    marginTop: 5,
    fontSize: 16,
    color: "#ff0000",
  },
});

export default Noticias;
