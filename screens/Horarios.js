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
  container: { flex: 1, padding: 16 },
  materiaItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  materiaText: { fontSize: 18, fontWeight: "bold" },
  detalleText: { fontSize: 16, color: "#555" },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: { color: "white", fontSize: 16 },
});

export default Horarios;
