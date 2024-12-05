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
  const colors = {
    primary: "#007BFF",
    white: "#fff",
    light: "#ddd",
    darkOverlay: "rgba(0, 0, 0, 0.5)",
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?cs=srgb&dl=pexels-repuding-12064.jpg&fm=jpg",
      }}
      style={styles.background}
      resizeMode="cover"
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
          Su Misión es formar críticamente profesionales, investigadores y
          técnicos en las ciencias, las humanidades y las artes necesarias y
          eficientes para coadyuvar a las transformaciones que demanda el
          desarrollo nacional sostenible. Además, busca difundir los ideales de
          la cultura de paz, progreso, justicia social, equidad de género y
          respeto a los derechos humanos, contribuyendo a la formación de una
          conciencia colectiva basada en valores.
        </Text>

        <Text style={styles.sectionTitle}>Visión</Text>
        <Text style={styles.text}>
          La Universidad tiene como Visión ser una institución de excelencia y
          liderazgo académico, gestionada con eficiencia y acreditada nacional e
          internacionalmente. Se esfuerza por contar con un personal docente,
          investigador, extensionista y egresados ​​de alta calificación,
          creadora de conocimientos científicos y nuevas tecnologías, reconocida
          por su contribución al desarrollo humano con equidad y hacia una
          sociedad democrática y solidaria.
        </Text>

        <Text style={styles.sectionTitle}>Valores</Text>
        <Text style={styles.text}>
          La Universidad está orientada hacia el respeto y la defensa de la
          dignidad humana y se sustenta en los siguientes valores:
        </Text>
        <Text style={styles.valuesList}>
          a) Solidaridad{"\n"}
          b) Transparencia{"\n"}
          c) Verdad{"\n"}
          d) Igualdad{"\n"}
          e) Libertad{"\n"}
          f) Equidad{"\n"}
          g) Tolerancia{"\n"}
          h) Responsabilidad{"\n"}
          i) Convivencia{"\n"}
          j) Paz
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation?.navigate("Iniciar Sesión")}
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
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
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
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 24,
  },
  valuesList: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "left",
    lineHeight: 24,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
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
