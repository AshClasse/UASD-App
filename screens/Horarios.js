import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const Horarios = () => {
  const [horariosData, setHorariosData] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null); 

  useEffect(() => {
    axios
      .get("https://uasdapi.ia3x.com/horarios")
      .then((response) => setHorariosData(response.data))
      .catch((error) => console.error("Error fetching horarios:", error)); 
  }, []);

  return (
    <View style={styles.container}>
      {selectedMateria ? (

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedMateria.ubicacion.latitude,
              longitude: selectedMateria.ubicacion.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={selectedMateria.ubicacion}
              title={selectedMateria.materia}
              description={selectedMateria.aula}
            />
          </MapView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedMateria(null)}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      ) : (
   
        <FlatList
          data={horariosData}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.materiaItem}
              onPress={() => setSelectedMateria(item)}
            >
              <Text style={styles.materiaText}>{item.materia}</Text>
              <Text style={styles.detalleText}>
                {item.hora} - {item.aula}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fbfc",
  },
  materiaItem: {
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    transition: "all 0.3s ease",
  },
  materiaItemHovered: {
    backgroundColor: "#e3f2fd",
  },
  materiaText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detalleText: {
    fontSize: 14,
    color: "#777",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    marginBottom: 20,
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#F44336",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  materiaItemActive: {
    backgroundColor: "#e1f5fe",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007bff",
  },
  modalMateriaName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});


export default Horarios;
