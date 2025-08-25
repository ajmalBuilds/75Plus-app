import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { BadgeCheck, ChartPie, Plus, X } from 'lucide-react-native';
import { Course as CourseType, COURSE_COLORS } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';
import AttendanceCard from '@/components/AttendanceCard';
import { useRouter } from 'expo-router';

export default function Courses() {
  const router = useRouter();
  const { loadValue, value: userCourses, setValue: setUserCourses } = useStorage<
    CourseType[]
  >('userCourses', []);
  const { value: requiredPercentage } = useStorage('requiredPercentage', 75);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    courseId: '',
    totalHours: '',
    presentHours: '',
  });

  const overallTotalHours = userCourses.reduce(
    (sum, course) => sum + course.totalHours,
    0
  );
  const overallPresentHours = userCourses.reduce(
    (sum, course) => sum + course.presentHours,
    0
  );
  const overallAttendancePercentage =
    overallTotalHours > 0 ? (overallPresentHours / overallTotalHours) * 100 : 0;

  const calculateRequiredClasses = () => {
    if (overallAttendancePercentage >= requiredPercentage) return 0;
    return Math.ceil(
      (requiredPercentage * overallTotalHours - 100 * overallPresentHours) /
        (100 - requiredPercentage)
    );
  };

  const calculateBunkableClasses = () => {
    if (overallAttendancePercentage < requiredPercentage) return 0;
    return Math.floor(
      (100 * overallPresentHours - requiredPercentage * overallTotalHours) /
        requiredPercentage
    );
  };

  const requiredClasses = calculateRequiredClasses();
  const bunkableClasses = calculateBunkableClasses();

  const fetchData = async () => {
    try {
      await loadValue();

    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add any refresh logic here
      await fetchData();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const addManualCourse = () => {
    if (!newCourse.name.trim() || !newCourse.courseId.trim()) {
      Alert.alert('Error', 'Please fill in course name and ID');
      return;
    }

    const totalHours = parseInt(newCourse.totalHours) || 0;
    const presentHours = parseInt(newCourse.presentHours) || 0;

    if (presentHours > totalHours) {
      Alert.alert('Error', 'Present hours cannot be more than total hours');
      return;
    }

    // Check for duplicate course ID
    const existingCourse = userCourses.find(course => course.courseId === newCourse.courseId.trim());
    if (existingCourse) {
      Alert.alert('Error', 'A course with this ID already exists');
      return;
    }

    const course: CourseType = {
      id: Date.now(),
      courseName: newCourse.name.trim(),
      courseId: newCourse.courseId.trim(),
      totalHours,
      presentHours,
      color: COURSE_COLORS[userCourses.length % COURSE_COLORS.length],
      createdAt: new Date(),
      department: 'Custom',
      year: 'Custom',
      semester: 'Custom',
    };

    setUserCourses([...userCourses, course]);
    setNewCourse({ name: '', courseId: '', totalHours: '', presentHours: '' });
    setShowAddModal(false);
  };

  const updateCourse = (
    courseId: string,
    type: 'total' | 'present',
    increment: boolean
  ) => {
    setUserCourses(
      userCourses.map((course) => {
        if (course.courseId !== courseId) return course;

        if (type === 'total') {
          const newTotal = increment
            ? course.totalHours + 1
            : Math.max(0, course.totalHours - 1);
          return {
            ...course,
            totalHours: newTotal,
            presentHours: Math.min(course.presentHours, newTotal),
          };
        } else {
          const newPresent = increment
            ? Math.min(course.totalHours, course.presentHours + 1)
            : Math.max(0, course.presentHours - 1);
          return {
            ...course,
            presentHours: newPresent,
          };
        }
      })
    );
    fetchData();
  };

  const deleteEntry = (id: number) => {
    Alert.alert('Delete Class', 'Are you sure you want to delete this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setUserCourses(userCourses.filter((entry) => entry.id !== id));
        },
      },
    ]);
  };

  const navigateToAllCourses = () => {
    setShowAddModal(false);
    // Get existing course IDs to prevent duplicates
    const existingCourseIds = userCourses.map((course) => course.id);
    router.push({
      pathname: '/allCourses',
      params: { existingCourseIds: JSON.stringify(existingCourseIds) },
    });
  };

  const renderItem = useCallback(({ item }: { item: CourseType }) => (
    <AttendanceCard
      course={item}
      requiredPercentage={requiredPercentage}
      onIncrement={(type) => updateCourse(item.courseId, type, true)}
      onDecrement={(type) => updateCourse(item.courseId, type, false)}
      onLongPress={() => deleteEntry(item.id)}
    />
  ), [requiredPercentage, updateCourse, deleteEntry]);

  const keyExtractor = useCallback((item: CourseType) => item.id.toString(), []);

  const renderHeader = () => {
    if (userCourses.length === 0) return null;

    return (
      <View>
        <View style={styles.overallStats}>
          {overallAttendancePercentage < requiredPercentage ? (
            <View style={[styles.statusContainer, styles.warningContainer]}>
              <Text style={styles.alertTitle}>⚠️ Attention Required</Text>
              <Text
                style={[
                  styles.statusTextSuccess,
                  { color: '#B91C1C' , fontSize: 18, marginBottom: 8},
                ]}
              >
                Your overall attendance is{' '}
                {overallAttendancePercentage.toFixed(2)}%
              </Text>
              <Text style={styles.statusText}>
                Need to attend {requiredClasses} more classes to reach{' '}{requiredPercentage}%
              </Text>
            </View>
          ) : (
            <View style={[styles.statusContainer, styles.successContainer]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginBottom: 8,
                }}
              >
                <BadgeCheck
                  size={26}
                  color={'#1A6730'}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#1A6730',
                    fontWeight: '500',
                  }}
                >
                  You are on right track!
                </Text>
              </View>
              <Text
                style={[
                  styles.statusTextSuccess,
                  { fontSize: 18, marginBottom: 8 },
                ]}
              >
                Your overall attendance is{' '}{overallAttendancePercentage.toFixed(2)}%
              </Text>
              <Text style={styles.statusTextSuccess}>
                You can skip {bunkableClasses} classes and maintain{' '}
                {requiredPercentage}%
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: '500', color: '#1E293B' }}
            >
              Present Hours: {overallPresentHours}
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: '500', color: '#1E293B' }}
            >
              Total Hours: {overallTotalHours}
            </Text>
          </View>
        </View>
        <View style={styles.separator}></View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No courses yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first course to start tracking attendance
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Courses" subtitle="Attend smart, Bunk Smarter!" />

      <FlatList
        style={styles.content}
        data={userCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.contentContainer,
          userCourses.length === 0 && styles.emptyContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Course</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
              activeOpacity={0.7}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            style={styles.modalContent}
            data={[1]} // Dummy data to make FlatList work
            keyExtractor={() => 'modal-content'}
            renderItem={() => (
              <View>
                <Text style={styles.sectionTitle}>
                  Choose how to add courses:
                </Text>

                <TouchableOpacity
                  style={[styles.addButton, styles.primaryButton]}
                  onPress={navigateToAllCourses}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>Browse All Courses</Text>
                  <Text style={styles.addButtonSubtext}>
                    Select from 300+ available courses
                  </Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                <TouchableOpacity
                  style={[styles.addButton, styles.secondaryButton]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.addButtonText, { color: '#2563EB' }]}>
                    Add Custom Course
                  </Text>
                  <Text style={[styles.addButtonSubtext, { color: '#64748B' }]}>
                    Create your own course entry below
                  </Text>
                </TouchableOpacity>

                {/* Manual Course Form */}
                <View style={styles.manualForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Course Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Data Structures"
                      value={newCourse.name}
                      onChangeText={(text) =>
                        setNewCourse({ ...newCourse, name: text })
                      }
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Course ID</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., CS2101"
                      value={newCourse.courseId}
                      onChangeText={(text) =>
                        setNewCourse({ ...newCourse, courseId: text })
                      }
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}
                    >
                      <Text style={styles.inputLabel}>Total Hours</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={newCourse.totalHours}
                        onChangeText={(text) =>
                          setNewCourse({ ...newCourse, totalHours: text })
                        }
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}
                    >
                      <Text style={styles.inputLabel}>Present Hours</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={newCourse.presentHours}
                        onChangeText={(text) =>
                          setNewCourse({ ...newCourse, presentHours: text })
                        }
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.addButton, styles.primaryButton, { marginBottom: 50}]}
                    onPress={addManualCourse}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addButtonText}>Add Course</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  overallStats: {},
  separator: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 8,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  successContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusText: {
    fontSize: 14,
    color: '#B91C1C',
    fontWeight: '500',
    textAlign: 'left',
  },
  statusTextSuccess: {
    fontSize: 14,
    color: '#279D4A',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginVertical: 15,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addButtonSubtext: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '400',
  },
  manualForm: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});