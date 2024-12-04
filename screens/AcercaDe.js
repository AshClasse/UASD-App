import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";

const developers = [
  {
    id: "1",
    nombre: "Ashley Classe",
    matricula: "2022-2004",
    foto: require("../assets/developers/ashley.png"),
    biografia:
      "Estudiante de término en Desarrollo de Software, actualmente desarrollando microservicios en Java Quarkus, amo la playa y los road trips.",
  },
  {
    id: "2",
    nombre: "Yahinniel Vásquez",
    matricula: "2022-1996",
    foto: require("../assets/developers/yahinniel.png"),
    biografia:
      "Soy estudiante de termino de la carrera Desarrollo de Software, Ganador de la Feria Científica ITLA, monitor de la materia Fundamentos de Programación y con una buena habilidad en programación.",
  },
  {
    id: "3",
    nombre: "Gary Campusano",
    matricula: "2022-1022",
    foto: require("../assets/developers/gary.png"),
    biografia:
      "Estudiante de Desarrollo de Software con experiencia en programación, inteligencia artificial y desarrollo backend y me destaco como monitor en materias fundamentales de programación, ayudando a otros a comprender y aplicar conceptos clave en esta área.",
  },
  {
    id: "4",
    nombre: "Julio Noboa",
    matricula: "2022-1015",
    foto: require("../assets/developers/julio.png"),
    biografia:
      "Estudiante de término en Desarrollo de Software en el ITLA y programador en Kotlin con experiencia en Jetpack Compose en el Banco Popular Dominicano, donde aplico mis conocimientos en desarrollo móvil y solución de problemas.",
  },
  {
    id: "5",
    nombre: "Allison Beato",
    matricula: "2022-2075",
    foto: require("../assets/developers/allison.png"),
    biografia:
      "Estudiante de Desarrollo de Software, amante del Frontend. Disfruto aprender nuevas habilidades. Me encanta viajar y vivir experiencias al estilo extremo.",
  },
];

const AcercaDe = () => {
  const renderItem = ({ item }) => (
    <View style={styles.developerContainer}>
      <Image source={item.foto} style={styles.photo} />
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.matricula}>{item.matricula}</Text>
      <Text style={styles.biography}>{item.biografia}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desarrolladores</Text>
      <FlatList
        data={developers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#343a40",
  },
  developerContainer: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  matricula: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 10,
  },
  biography: {
    fontSize: 15,
    textAlign: "center",
    color: "#495057",
    lineHeight: 22,
  },
});

export default AcercaDe;
