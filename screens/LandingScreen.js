import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?cs=srgb&dl=pexels-repuding-12064.jpg&fm=jpg",
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: "https://seeklogo.com/images/U/universidad-autonoma-de-santo-domingo-logo-1DB363C54A-seeklogo.com.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Universidad Autónoma de Santo Domingo</Text>
        <Text style={styles.subtitle}>La Primada de América</Text>

        <Text style={styles.sectionTitle}>Misión</Text>
        <Text style={styles.text}>
          Formar profesionales éticos y competentes, comprometidos con el
          desarrollo de la sociedad, mediante una oferta académica de calidad y
          programas de investigación.
        </Text>

        <Text style={styles.sectionTitle}>Visión</Text>
        <Text style={styles.text}>
          Ser la universidad líder en educación superior, investigación y
          extensión, reconocida nacional e internacionalmente por su excelencia
          y contribución al progreso.
        </Text>

        <Text style={styles.sectionTitle}>Valores</Text>
        <Text style={styles.text}>
          - Integridad - Excelencia - Responsabilidad Social - Innovación -
          Compromiso
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Iniciar Sesión")}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LandingScreen;