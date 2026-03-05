import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InspirationPhoto } from '../../types';
import * as Haptics from 'expo-haptics';

interface PhotoGridProps {
  photos: InspirationPhoto[];
  onDelete: (id: string) => void;
}

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 2;
const ITEM_SIZE = (width - GAP * (COLS + 1)) / COLS;

export function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const handleDelete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Remove Photo', 'Remove this photo from your inspiration board?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      numColumns={COLS}
      scrollEnabled={false}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            source={{ uri: item.thumbnailUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={22} color="#fff" />
          </TouchableOpacity>
          {item.source === 'instagram' && (
            <View style={styles.sourceBadge}>
              <Ionicons name="logo-instagram" size={10} color="#fff" />
            </View>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: GAP,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#1A1A2E',
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  sourceBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    padding: 2,
  },
});
