import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Deuda = () => {
  const [deuda, setDeuda] = useState(null);

  useEffect(() => {
    
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {

          fetch('https://uasdapi.ia3x.com/deudas', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': '*/*'
            }
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.length > 0) {
                setDeuda(data[0]); 
              } else {
                Alert.alert('No tienes deudas pendientes');
              }
            })
            .catch((error) => {
              console.error('Error fetching debt data:', error);
            });
        } else {
          Alert.alert('No se ha encontrado el token de autenticación');
        }
      } catch (error) {
        console.error('Error getting token from AsyncStorage:', error);
      }
    };

    getToken();
  }, []);

  if (!deuda) {
    return (
      <View style={styles.container}>
        <Text>Cargando deuda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de tu deuda</Text>
      <Text style={styles.debtInfo}>Monto: ${deuda.monto}</Text>
      <Text style={styles.debtInfo}>
        Estado: {deuda.pagada ? 'Pagada' : 'Pendiente'}
      </Text>
      <Text style={styles.debtInfo}>
        Última actualización: {new Date(deuda.fechaActualizacion).toLocaleString()}
      </Text>
      <Button
        title="Pagar"
        onPress={() => {
          const paymentUrl = `https://uasd.edu.do/servicios/pago-en-linea/`;
          Linking.openURL(paymentUrl).catch((err) => console.error("No se pudo abrir el enlace", err));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debtInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Deuda;