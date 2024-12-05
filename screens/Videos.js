import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    return token;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      const token = await getAuthToken();
      
      if (!token) {
        console.error('No token found');
        return;
      }

      fetch('https://uasdapi.ia3x.com/videos', {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          setVideos(data);
        })
        .catch(error => console.error('Error al obtener los videos:', error));
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => setSelectedVideo(item.url)}>
      <Text style={styles.videoTitle}>{item.titulo}</Text>
      <Text style={styles.videoDate}>{new Date(item.fechaPublicacion).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!selectedVideo ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: `https://www.youtube.com/watch?v=${selectedVideo}` }}
            style={styles.webview}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedVideo(null)}>
            <Text style={styles.backButtonText}>Volver a la lista</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  videoItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#007bff",
  },
  videoDate: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15,
  },
  backButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Videos;
