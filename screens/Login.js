import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://uasdapi.ia3x.com/login", {
        username,
        password,
      });
      if (response.data.success) {
        await AsyncStorage.setItem("authToken", response.data.data.authToken);
        Alert.alert("Inicio de Sesión Exitoso");
        navigation.navigate("Mi Perfil");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Inicio de Sesión Fallido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.formGroup}>
        <Text>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Contraseña:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Button
        title={loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
        onPress={handleLogin}
        disabled={loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate("Olvidé mi Contraseña")}>
        <Text style={styles.link}>Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL("https://uasd.edu.do/")}>
        <Text style={styles.link}>Estudia con Nosotros</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fbfc",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0056b3",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0056b3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a0b1c2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#0056b3",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 15,
  },
});

export default Login;