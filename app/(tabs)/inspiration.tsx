import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useInspirationStore } from '../../src/store/inspirationStore';
import { PhotoGrid } from '../../src/components/inspiration/PhotoGrid';
import { InstagramInput } from '../../src/components/inspiration/InstagramInput';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { saveGalleryPhoto } from '../../src/utils/instagram';
import * as Haptics from 'expo-haptics';

export default function InspirationScreen() {
  const { photos, accounts, deletePhoto, removeAccount } = useInspirationStore();
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);

  const handlePickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo access in Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 20,
    });

    if (result.canceled) return;

    setAddingPhotos(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { addPhoto } = useInspirationStore.getState();
      for (const asset of result.assets) {
        const photo = await saveGalleryPhoto(asset.uri);
        await addPhoto(photo);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save some photos.');
    } finally {
      setAddingPhotos(false);
    }
  };

  const handleRemoveAccount = (username: string) => {
    Alert.alert(
      'Remove Account',
      `Remove @${username} and all their photos from your board?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeAccount(username),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspiration</Text>
        <Text style={styles.count}>{photos.length} photos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Add photos row */}
        <View style={styles.addRow}>
          <TouchableOpacity
            style={[styles.addCard, addingPhotos && styles.addCardLoading]}
            onPress={handlePickPhotos}
            disabled={addingPhotos}
            activeOpacity={0.8}
          >
            {addingPhotos ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <Ionicons name="image-outline" size={22} color="#7C3AED" />
            )}
            <Text style={styles.addCardText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addCard, showInstagramInput && styles.addCardActive]}
            onPress={() => setShowInstagramInput(!showInstagramInput)}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-instagram" size={22} color="#F59E0B" />
            <Text style={styles.addCardText}>Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Instagram input */}
        {showInstagramInput && (
          <View style={styles.instagramSection}>
            <InstagramInput
              onSuccess={() => setShowInstagramInput(false)}
            />
          </View>
        )}

        {/* Instagram accounts */}
        {accounts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instagram Accounts</Text>
            {accounts.map((account) => (
              <View key={account.username} style={styles.accountRow}>
                <View style={styles.accountLeft}>
                  <Ionicons name="logo-instagram" size={18} color="#F59E0B" />
                  <Text style={styles.accountName}>@{account.username}</Text>
                  <Text style={styles.accountCount}>{account.photoCount} photos</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveAccount(account.username)}
                  hitSlop={12}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#475569" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Photo grid */}
        {photos.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Photos</Text>
            <PhotoGrid photos={photos} onDelete={deletePhoto} />
          </View>
        ) : (
          <EmptyState
            icon="🌟"
            title="Add your inspiration"
            subtitle="Photos from your gallery or Instagram accounts will appear here and play during your alarm"
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
  count: {
    color: '#94A3B8',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  addCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  addCardActive: {
    borderColor: '#F59E0B',
  },
  addCardLoading: {
    opacity: 0.6,
  },
  addCardText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  instagramSection: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accountName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  accountCount: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
