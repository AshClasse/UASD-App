import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
      <Text>{new Date(item.fechaPublicacion).toLocaleDateString()}</Text>
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
        <WebView
          source={{ uri: `https://www.youtube.com/watch?v=${selectedVideo}` }}
          style={styles.webview}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  videoItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: 400,
  }
});

export default Videos;