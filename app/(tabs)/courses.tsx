import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { ChartPie, Plus, X } from 'lucide-react-native';
import { Course, COURSE_COLORS } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';
import AttendanceCard from '@/components/AttendanceCard';

export default function Courses() {
  const { value: courses, setValue: setCourses } = useStorage<Course[]>('courses', []);
  const { setValue: removeValue } = useStorage<Course[]>('courses', []);
  const { value: requiredPercentage } = useStorage('requiredPercentage', 75);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    courseId: '',
    totalHours: '',
    presentHours: '',
  });

  const overallTotalHours = courses.reduce((sum, course) => sum + course.totalHours, 0);
  const overallPresentHours = courses.reduce((sum, course) => sum + course.presentHours, 0);
  const overallAttendancePercentage = overallTotalHours > 0 ? (overallPresentHours/overallTotalHours) * 100 : 0 ;
  const calculateRequiredClasses : any  = () => {
    if (overallAttendancePercentage >= requiredPercentage) return 0;
    return Math.ceil((requiredPercentage * overallTotalHours - 100 * overallPresentHours) / (100 - requiredPercentage));
  };

  const calculateBunkableClasses : any = () => {
    if (overallAttendancePercentage < requiredPercentage) return 0;
    return Math.floor((100 * overallPresentHours - requiredPercentage * overallTotalHours) / requiredPercentage);
  };

  const requiredClasses = calculateRequiredClasses();
  const bunkableClasses = calculateBunkableClasses();

  const addCourse = () => {
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

    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name.trim(),
      courseId: newCourse.courseId.trim(),
      totalHours,
      presentHours,
      color: COURSE_COLORS[courses.length % COURSE_COLORS.length],
      createdAt: new Date(),
    };

    setCourses([...courses, course]);
    setNewCourse({ name: '', courseId: '', totalHours: '', presentHours: '' });
    setShowAddModal(false);
  };

  const updateCourse = (courseId: string, type: 'total' | 'present', increment: boolean) => {
    setCourses(courses.map(course => {
      if (course.id !== courseId) return course;

      if (type === 'total') {
        const newTotal = increment ? course.totalHours + 1 : Math.max(0, course.totalHours - 1);
        return {
          ...course,
          totalHours: newTotal,
          presentHours: Math.min(course.presentHours, newTotal)
        };
      } else {
        const newPresent = increment 
          ? Math.min(course.totalHours, course.presentHours + 1)
          : Math.max(0, course.presentHours - 1);
        return {
          ...course,
          presentHours: newPresent
        };
      }
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="Courses" subtitle="Attend smart, Bunk Smarter!" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.overallStats}>
          <View style={styles.alertSection}>
            <Text style={styles.alertTitle}>Overall Attendance</Text>
            <Text style={styles.alertText}>
              Your overall attendance is {overallAttendancePercentage.toFixed(2)}%. 
              You need to maintain at least {requiredPercentage}% attendance.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E293B' }}>
              Present Hours: {overallPresentHours}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E293B' }}>
              Total Hours: {overallTotalHours}
            </Text>
          </View>
        </View>

        <View style={styles.seperator}></View>

        {overallAttendancePercentage < requiredPercentage ? (
                <View style={[styles.statusContainer, styles.warningContainer]}>
                  <Text style={styles.alertTitle}>⚠️ Attention Required</Text>
                  <Text style={styles.statusText}>
                    Need to attend {requiredClasses} more classes to reach {requiredPercentage}%
                  </Text>
                </View>
              ) : (
                <View style={[styles.statusContainer, styles.successContainer]}>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <ChartPie style={{ color: '#1A6730', marginRight: 4, marginBottom: 8 }} size={16} />
                  <Text style={styles.statusTextSuccessHeading}>Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}</Text>
                  </View> */}
                  <Text style={{ fontSize: 14, color: '#1A6730', fontWeight: '500',  marginBottom: 8 }}>
                    You are on right track!
                  </Text>
                  <Text style={styles.statusTextSuccess}>
                    You can skip {bunkableClasses} classes and maintain {requiredPercentage}%
                  </Text>
                </View>
              )}
        <View style={{ marginBottom: 100 }}>
        {courses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first course to start tracking attendance
            </Text>
          </View>
        ) : (
          courses.map(course => (
            <AttendanceCard
              key={course.id}
              course={course}
              requiredPercentage={requiredPercentage}
              onIncrement={(type) => updateCourse(course.id, type, true)}
              onDecrement={(type) => updateCourse(course.id, type, false)}
            />
          ))
        )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Course</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name</Text>
              <TextInput
                style={styles.input}
                value={newCourse.name}
                onChangeText={(text) => setNewCourse(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Data Structures"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course ID</Text>
              <TextInput
                style={styles.input}
                value={newCourse.courseId}
                onChangeText={(text) => setNewCourse(prev => ({ ...prev, courseId: text }))}
                placeholder="e.g., CS101"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Total Hours</Text>
                <TextInput
                  style={styles.input}
                  value={newCourse.totalHours}
                  onChangeText={(text) => setNewCourse(prev => ({ ...prev, totalHours: text }))}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Present Hours</Text>
                <TextInput
                  style={styles.input}
                  value={newCourse.presentHours}
                  onChangeText={(text) => setNewCourse(prev => ({ ...prev, presentHours: text }))}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addCourse}>
              <Text style={styles.addButtonText}>Add Course</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  overallStats: {

  },
  seperator: {
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
  chatIcon:{
    color: '#1A6730',
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
    textAlign: 'center',
  },
  statusTextSuccessHeading: {
    fontSize: 16,
    color: '#1A6730',
    fontWeight: '500',
    marginBottom: 8,
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
    padding: 20,
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
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});