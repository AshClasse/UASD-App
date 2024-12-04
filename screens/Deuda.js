import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Deuda = () => {
  const [deuda, setDeuda] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          fetch("https://uasdapi.ia3x.com/deudas", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.length > 0) {
                setDeuda(data[0]);
              } else {
                Alert.alert("No tienes deudas pendientes");
              }
            })
            .catch((error) => {
              console.error("Error fetching debt data:", error);
            })
            .finally(() => setLoading(false));
        } else {
          Alert.alert("No se ha encontrado el token de autenticación");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting token from AsyncStorage:", error);
        setLoading(false);
      }
    };

    getToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando deuda...</Text>
      </View>
    );
  }

  if (!deuda) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDebtText}>
          No se encontraron deudas pendientes.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de tu deuda</Text>
      <View style={styles.debtContainer}>
        <Text style={styles.debtInfo}>
          Monto: <Text style={styles.debtValue}>${deuda.monto}</Text>
        </Text>
        <Text style={styles.debtInfo}>
          Estado:{" "}
          <Text style={deuda.pagada ? styles.paidText : styles.pendingText}>
            {deuda.pagada ? "Pagada" : "Pendiente"}
          </Text>
        </Text>
        <Text style={styles.debtInfo}>
          Última actualización:{" "}
          <Text style={styles.dateText}>
            {new Date(deuda.fechaActualizacion).toLocaleString()}
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => {
          const paymentUrl = `https://uasd.edu.do/servicios/pago-en-linea/`;
          Linking.openURL(paymentUrl).catch((err) =>
            console.error("No se pudo abrir el enlace", err)
          );
        }}
      >
        <Text style={styles.paymentButtonText}>Pagar ahora</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#6c757d",
  },
  noDebtText: {
    fontSize: 20,
    color: "#dc3545",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
  },
  debtContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  debtInfo: {
    fontSize: 18,
    color: "#495057",
    marginBottom: 10,
  },
  debtValue: {
    fontWeight: "bold",
    color: "#007bff",
  },
  paidText: {
    color: "#28a745",
    fontWeight: "bold",
  },
  pendingText: {
    color: "#ffc107",
    fontWeight: "bold",
  },
  dateText: {
    color: "#6c757d",
    fontStyle: "italic",
  },
  paymentButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  paymentButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Deuda;
