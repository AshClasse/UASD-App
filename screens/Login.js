import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  const handleLogin = async () => {
    setLoading(true); // Inicia el indicador de carga
    setError(""); // Resetea el mensaje de error
    try {
      const response = await axios.post("https://uasdapi.ia3x.com/login", {
        username,
        password,
      }); // Realiza la solicitud POST al endpoint de login
      if (response.data.success) {
        await AsyncStorage.setItem("authToken", response.data.data.authToken); // Almacena el authToken en AsyncStorage
        Alert.alert("Login successful"); // Muestra una alerta de éxito
        navigation.navigate("Profile"); // Navega a la pantalla de inicio
      } else {
        setError(response.data.message); // Establece el mensaje de error desde la respuesta
      }
    } catch (err) {
      setError("Login failed"); // Establece un mensaje de error genérico
    } finally {
      setLoading(false); // Detiene el indicador de carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.formGroup}>
        <Text>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />{" "}
        {/* Campo de entrada para el nombre de usuario */}
      </View>
      <View style={styles.formGroup}>
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />{" "}
        {/* Campo de entrada para la contraseña */}
      </View>
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />{" "}
      {/* Botón de inicio de sesión */}
      {error ? <Text style={styles.error}>{error}</Text> : null}{" "}
      {/* Muestra el mensaje de error si existe */}
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
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Login;
