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
  link: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default Login;