import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAlarmStore } from '../../src/store/alarmStore';
import { useInspirationStore } from '../../src/store/inspirationStore';
import {
  getNextEnabledAlarm,
  formatTime,
  getNextAlarmLabel,
  generateId,
} from '../../src/utils/alarmUtils';

const { width } = Dimensions.get('window');

function LiveClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours() % 12 || 12;
  const m = time.getMinutes().toString().padStart(2, '0');
  const period = time.getHours() < 12 ? 'AM' : 'PM';
  const day = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={styles.clockContainer}>
      <Text style={styles.clockTime}>
        {h}:{m}
        <Text style={styles.clockPeriod}> {period}</Text>
      </Text>
      <Text style={styles.clockDate}>{day}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { alarms } = useAlarmStore();
  const { photos } = useInspirationStore();
  const nextAlarm = getNextEnabledAlarm(alarms);

  const previewPhotos = photos.slice(0, 8);

  const handleAddAlarm = () => {
    router.push({ pathname: '/alarm-edit/[id]', params: { id: 'new' } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.tagline}>Rise & be inspired</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddAlarm}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Clock */}
        <LiveClock />

        {/* Next Alarm Card */}
        {nextAlarm ? (
          <TouchableOpacity
            style={styles.nextAlarmCard}
            onPress={() => router.push({ pathname: '/alarm-edit/[id]', params: { id: nextAlarm.id } })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4C1D95', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.nextAlarmContent}>
              <View>
                <Text style={styles.nextAlarmLabel}>Next alarm</Text>
                <Text style={styles.nextAlarmTime}>{formatTime(nextAlarm.time)}</Text>
                {nextAlarm.label ? (
                  <Text style={styles.nextAlarmName}>{nextAlarm.label}</Text>
                ) : null}
              </View>
              <View style={styles.nextAlarmRight}>
                <Text style={styles.nextAlarmIn}>{getNextAlarmLabel(nextAlarm)}</Text>
                <Ionicons name="alarm" size={32} color="rgba(255,255,255,0.4)" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.noAlarmCard} onPress={handleAddAlarm} activeOpacity={0.85}>
            <Ionicons name="add-circle-outline" size={28} color="#7C3AED" />
            <Text style={styles.noAlarmText}>Set your first alarm</Text>
            <Text style={styles.noAlarmSub}>Wake up to your inspiration</Text>
          </TouchableOpacity>
        )}

        {/* Inspiration Preview */}
        {previewPhotos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Inspiration</Text>
              <TouchableOpacity onPress={() => router.push('/inspiration')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={previewPhotos}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoStrip}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.thumbnailUri }}
                  style={styles.previewPhoto}
                  resizeMode="cover"
                />
              )}
            />
          </View>
        )}

        {previewPhotos.length === 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.addInspirationCard}
              onPress={() => router.push('/inspiration')}
              activeOpacity={0.85}
            >
              <Ionicons name="images-outline" size={28} color="#F59E0B" />
              <Text style={styles.addInspirationText}>Add inspiration photos</Text>
              <Text style={styles.addInspirationSub}>
                Gallery or Instagram · shown during alarm
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  tagline: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  clockTime: {
    color: '#F8FAFC',
    fontSize: 68,
    fontWeight: '200',
    letterSpacing: -2,
  },
  clockPeriod: {
    fontSize: 24,
    color: '#94A3B8',
  },
  clockDate: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  nextAlarmCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
  },
  nextAlarmContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nextAlarmLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nextAlarmTime: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -1,
  },
  nextAlarmName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  nextAlarmRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  nextAlarmIn: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  noAlarmCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2D2D4E',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  noAlarmText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  noAlarmSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '600',
  },
  photoStrip: {
    gap: 8,
  },
  previewPhoto: {
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
  },
  addInspirationCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2D2D4E',
    borderStyle: 'dashed',
  },
  addInspirationText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  addInspirationSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
  },
});
