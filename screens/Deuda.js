import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeudasScreen = () => {
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeudas = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Error", "No se encontró el token de autenticación.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://uasdapi.ia3x.com/deudas", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (data && data.length > 0) {
          setDeudas(data);
        } else {
          Alert.alert("Información", "No tienes deudas pendientes.");
        }
      } catch (error) {
        console.error("Error fetching deudas:", error);
        Alert.alert("Error", "Hubo un problema al obtener las deudas.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeudas();
  }, []);

  const handlePago = (deuda) => {
    const paymentUrl = `https://uasd.edu.do/servicios/pago-en-linea/`; // URL de pago
    Linking.openURL(paymentUrl)
      .then(() => {
        Alert.alert("Redirigiendo", `Pagando la deuda de ${deuda.monto}.`);
      })
      .catch((err) => {
        console.error("Error al abrir el enlace de pago:", err);
        Alert.alert("Error", "No se pudo abrir el enlace de pago.");
      });
  };

  const renderDeuda = ({ item }) => (
    <View style={styles.deudaRow}>
      <Text style={styles.columnText}>{item.monto}</Text>
      <Text style={styles.columnText}>{item.pagada ? "Pagada" : "Pendiente"}</Text>
      <Text style={styles.columnText}>
        {new Date(item.fechaActualizacion).toLocaleDateString()}
      </Text>
      {!item.pagada && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePago(item)}
        >
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loaderText}>Cargando deudas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Deudas</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Monto</Text>
        <Text style={styles.headerText}>Estado</Text>
        <Text style={styles.headerText}>Actualización</Text>
        <Text style={styles.headerText}>Acción</Text>
      </View>
      <FlatList
        data={deudas}
        renderItem={renderDeuda}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.tableBody}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fbfc",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0056b3",
    textAlign: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0056b3",
    padding: 10,
    borderRadius: 8,
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableBody: {
    marginTop: 10,
  },
  deudaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginBottom: 5,
  },
  columnText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});

export default DeudasScreen;