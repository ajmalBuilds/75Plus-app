import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Plus, X, Clock, MapPin } from 'lucide-react-native';
import { TimetableEntry, DAYS } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';

export default function Timetable() {
  const { value: timetable, setValue: setTimetable } = useStorage<TimetableEntry[]>('timetable', []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDay, setCurrentDay] = useState<string>('');
  const [currentClass, setCurrentClass] = useState<TimetableEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    day: 'Monday',
    time: '',
    courseName: '',
    courseId: '',
    location: '',
    duration: '55',
  });

  useEffect(() => {
    updateCurrentClass();
    const interval = setInterval(updateCurrentClass, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timetable]);

  const updateCurrentClass = () => {
    const now = new Date();
    const currentDayName = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    setCurrentDay(currentDayName);

    const todayClasses = timetable
      .filter(entry => entry.day === currentDayName)
      .sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA - timeB;
      });

    let current = null;
    for (const classEntry of todayClasses) {
      const classTime = parseTime(classEntry.time);
      const classEnd = classTime + classEntry.duration;
      
      if (currentTime >= classTime && currentTime < classEnd) {
        current = classEntry;
        break;
      }
    }

    // If no current class, find next class
    if (!current) {
      for (const classEntry of todayClasses) {
        const classTime = parseTime(classEntry.time);
        if (currentTime < classTime) {
          current = classEntry;
          break;
        }
      }
    }

    setCurrentClass(current);
  };

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const addEntry = () => {
    if (!newEntry.time || !newEntry.courseName.trim() || !newEntry.courseId.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const entry: TimetableEntry = {
      id: Date.now().toString(),
      day: newEntry.day,
      time: newEntry.time,
      courseName: newEntry.courseName.trim(),
      courseId: newEntry.courseId.trim(),
      location: newEntry.location.trim(),
      duration: parseInt(newEntry.duration) || 60,
    };

    setTimetable([...timetable, entry]);
    setNewEntry({
      day: 'Monday',
      time: '',
      courseName: '',
      courseId: '',
      location: '',
      duration: '60',
    });
    setShowAddModal(false);
  };

  const deleteEntry = (id: string) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setTimetable(timetable.filter(entry => entry.id !== id));
        }},
      ]
    );
  };

  const isCurrentClass = (entry: TimetableEntry): boolean => {
    if (entry.day !== currentDay) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const classTime = parseTime(entry.time);
    const classEnd = classTime + entry.duration;
    return currentTime >= classTime && currentTime < classEnd;
  };

  const isNextClass = (entry: TimetableEntry): boolean => {
    return currentClass?.id === entry.id && !isCurrentClass(entry);
  };

  return (
    <View style={styles.container}>
      <Header title="Timetable" subtitle="Manage your class schedule" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentClass && (
          <View style={[styles.currentClassCard, isCurrentClass(currentClass) ? styles.activeClass : styles.nextClass]}>
            <View style={styles.currentClassHeader}>
              <Text style={styles.currentClassLabel}>
                {isCurrentClass(currentClass) ? '🟢 Current Class' : '⏰ Next Class'}
              </Text>
              <View style={styles.timeContainer}>
                <Clock size={16} color="#64748B" />
                <Text style={styles.currentClassTime}>
                  {formatTime(currentClass.time)}
                </Text>
              </View>
            </View>
            <Text style={styles.currentClassName}>{currentClass.courseName}</Text>
            <Text style={styles.currentClassId}>{currentClass.courseId}</Text>
            {currentClass.location && (
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#64748B" />
                <Text style={styles.currentClassLocation}>{currentClass.location}</Text>
              </View>
            )}
          </View>
        )}

        {DAYS.map(day => {
          const dayClasses = timetable
            .filter(entry => entry.day === day)
            .sort((a, b) => parseTime(a.time) - parseTime(b.time));

          return (
            <View key={day} style={styles.daySection}>
              <Text style={[styles.dayTitle, day === currentDay && styles.currentDayTitle]}>
                {day} {day === currentDay && '(Today)'}
              </Text>
              {dayClasses.length === 0 ? (
                <Text style={styles.noClassesText}>No classes scheduled</Text>
              ) : (
                dayClasses.map(entry => (
                  <TouchableOpacity
                    key={entry.id}
                    style={[
                      styles.classCard,
                      isCurrentClass(entry) && styles.activeClassCard,
                      isNextClass(entry) && styles.nextClassCard,
                    ]}
                    onLongPress={() => deleteEntry(entry.id)}
                  >
                    <View style={styles.classHeader}>
                      <Text style={styles.classTime}>{formatTime(entry.time)}</Text>
                      <Text style={styles.classDuration}>{entry.duration} min</Text>
                    </View>
                    <Text style={styles.className}>{entry.courseName}</Text>
                    <Text style={styles.classId}>{entry.courseId}</Text>
                    {entry.location && (
                      <View style={styles.locationContainer}>
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.classLocation}>{entry.location}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          );
        })}
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Class</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Day</Text>
              <View style={styles.daySelector}>
                {DAYS.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      newEntry.day === day && styles.selectedDayButton
                    ]}
                    onPress={() => setNewEntry(prev => ({ ...prev, day }))}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      newEntry.day === day && styles.selectedDayButtonText
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={newEntry.time}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, time: text }))}
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name</Text>
              <TextInput
                style={styles.input}
                value={newEntry.courseName}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, courseName: text }))}
                placeholder="e.g., Data Structures"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course ID</Text>
              <TextInput
                style={styles.input}
                value={newEntry.courseId}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, courseId: text }))}
                placeholder="e.g., CS101"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.location}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, location: text }))}
                  placeholder="Room 101"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.duration}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, duration: text }))}
                  placeholder="55"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addEntry}>
              <Text style={styles.addButtonText}>Add Class</Text>
            </TouchableOpacity>
          </View>
        </View>
         </ScrollView>
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
  currentClassCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  activeClass: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  nextClass: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  currentClassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentClassLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentClassTime: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  currentClassName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  currentClassId: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentClassLocation: {
    fontSize: 14,
    color: '#64748B',
  },
  daySection: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  currentDayTitle: {
    color: '#2563EB',
  },
  noClassesText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeClassCard: {
    borderLeftColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  nextClassCard: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  classDuration: {
    fontSize: 12,
    color: '#64748B',
  },
  className: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  classId: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  classLocation: {
    fontSize: 12,
    color: '#64748B',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
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
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedDayButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
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