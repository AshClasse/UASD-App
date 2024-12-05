import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!username || !email) {
      Alert.alert("Información faltante", "Por favor, complete ambos campos para continuar.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("https://uasdapi.ia3x.com/reset_password", {
        usuario: username,
        email,
      });
      if (response.data.success) {
        Alert.alert(
          "Enlace enviado",
          "Un enlace para restablecer su contraseña ha sido enviado a su correo. Revise su bandeja de entrada."
        );
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "No se pudo restablecer la contraseña.");
      }
    } catch (error) {
      Alert.alert("Error", "Algo salió mal. Por favor, intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
        <Text style={styles.headerSubtitle}>
          Ingrese su nombre de usuario y correo electrónico a continuación. Le enviaremos instrucciones para restablecer su contraseña.
        </Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección de correo"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePasswordReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar Enlace</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Volver al Inicio de Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fbfc",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  form: {
    marginTop: 20,
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
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0056b3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
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
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#0056b3",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default ForgotPassword;