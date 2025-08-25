import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Clock } from 'lucide-react-native';
import { Course } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';

export default function Dashboard() {
  const router = useRouter();
  const { value: courses, loadValue } = useStorage<Course[]>('userCourses', []);
  const { value: requiredPercentage } = useStorage('requiredPercentage', 75);
  const [refreshing, setRefreshing] = useState(false);

  const totalCourses = courses.length;
  
  const overallTotalHours = courses.reduce(
    (sum, course) => sum + course.totalHours,
    0
  );
  const overallPresentHours = courses.reduce(
    (sum, course) => sum + course.presentHours,
    0
  );
  const averageAttendance =
    overallTotalHours > 0 ? (overallPresentHours / overallTotalHours) * 100 : 0;

  const lowAttendanceCourses = courses.filter((course) => {
    const percentage =
      course.totalHours > 0
        ? (course.presentHours / course.totalHours) * 100
        : 0;
    return percentage < requiredPercentage;
  }).length;

  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12
      ? 'Good Morning'
      : currentTime.getHours() < 16
      ? 'Good Afternoon'
      : 'Good Evening';
  let overallAttendance;
  if (averageAttendance.toFixed(0) === '100') {
    overallAttendance = averageAttendance.toFixed(0);
  } else {
    overallAttendance = averageAttendance.toFixed(1);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add any refresh logic here
      await loadValue();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="75Plus" subtitle={`${greeting}! Track your attendance`} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      >

{lowAttendanceCourses > 0 && (
          <View style={styles.alertSection}>
            <Text style={styles.alertTitle}>⚠️ Attention Required</Text>
            <Text style={styles.alertText}>
              You have {lowAttendanceCourses} course
              {lowAttendanceCourses > 1 ? 's' : ''} below {requiredPercentage}%
              attendance. Tap on "Courses" to see which ones need attention.
            </Text>
          </View>
        )}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <TrendingUp size={24} color="#2563EB" />
            </View>
            <Text style={styles.statValue}>{overallAttendance}%</Text>
            <Text style={styles.statLabel}>Overall Attendance</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
              <Calendar size={24} color="#059669" />
            </View>
            <Text style={styles.statValue}>{totalCourses}</Text>
            <Text style={styles.statLabel}>Total Courses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}>
              <Clock size={24} color="#DC2626" />
            </View>
            <Text style={styles.statValue}>{lowAttendanceCourses}</Text>
            <Text style={styles.statLabel}>Below {requiredPercentage}%</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push('/courses')}
          >
            <View style={styles.actionIcon}>
              <Plus size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add New Course</Text>
              <Text style={styles.actionSubtitle}>
                Start tracking a new subject
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push('/timetable')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#059669' }]}>
              <Calendar size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Timetable</Text>
              <Text style={styles.actionSubtitle}>
                View and update your schedule
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#7C3AED' }]}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Analytics</Text>
              <Text style={styles.actionSubtitle}>
                Check your attendance trends
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  alertSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 40,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#B91C1C',
    lineHeight: 20,
  },
});
