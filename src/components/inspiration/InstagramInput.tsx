import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInstagram } from '../../hooks/useInstagram';

interface InstagramInputProps {
  onSuccess?: () => void;
}

export function InstagramInput({ onSuccess }: InstagramInputProps) {
  const [username, setUsername] = useState('');
  const { fetchPhotos, loading, error } = useInstagram();

  const handleFetch = async () => {
    if (!username.trim()) return;
    const ok = await fetchPhotos(username);
    if (ok) {
      setUsername('');
      onSuccess?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Ionicons name="logo-instagram" size={20} color="#94A3B8" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Instagram username"
          placeholderTextColor="#475569"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleFetch}
        />
        <TouchableOpacity
          style={[styles.btn, (!username.trim() || loading) && styles.btnDisabled]}
          onPress={handleFetch}
          disabled={!username.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>Import</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      <Text style={styles.hint}>
        Public accounts only. Photos are saved locally.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2D4E',
    paddingHorizontal: 12,
    height: 52,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    height: '100%',
  },
  btn: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  btnDisabled: {
    backgroundColor: '#2D2D4E',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  hint: {
    color: '#475569',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
});
