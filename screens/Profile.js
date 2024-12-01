import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.get(
          "https://uasdapi.ia3x.com/info_usuario",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.data.success) {
          setUsername(response.data.data.username);
          setFullName(
            `${response.data.data.nombre} ${response.data.data.apellido}`
          );
          setEmail(response.data.data.email);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to load user data"
          );
        }
      } else {
        Alert.alert("Error", "Debes iniciar sesión primero.");
        navigation.navigate("Login");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchUserData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
  },
  value: {
    fontSize: 16,
    color: "#6c757d",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "100%",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
