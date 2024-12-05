import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (err) {
      console.error("Error retrieving token:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        setError("No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      fetch("https://uasdapi.ia3x.com/videos", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVideos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener los videos:", error);
          setError("Hubo un problema al obtener los videos.");
          setLoading(false);
        });
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => setSelectedVideo(item.url)}
    >
      <Text style={styles.videoTitle}>{item.titulo}</Text>
      <Text style={styles.videoDate}>
        Publicado el: {new Date(item.fechaPublicacion).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setError(null)}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedVideo ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.webViewContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Text style={styles.backButtonText}>← Regresar</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: `https://www.youtube.com/watch?v=${selectedVideo}` }}
            style={styles.webview}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  list: {
    padding: 10,
  },
  videoItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  videoDate: {
    fontSize: 14,
    color: "#777",
  },
  webViewContainer: {
    flex: 1,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#007BFF",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  webview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    marginBottom: 10,
    textAlign: "center",
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Videos;
