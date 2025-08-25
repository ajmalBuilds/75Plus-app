import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
  Dimensions,
  Switch,
  Share,
} from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  X,
  Clock,
  MapPin,
  Calendar,
  Grid3X3,
  List,
  Bell,
  Check,
  XCircle,
  RotateCcw,
  BarChart3,
  Download,
  Upload,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';
import { TimetableEntry, DAYS } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import { Course as CourseType, COURSE_COLORS } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

interface ExtendedTimetableEntry extends TimetableEntry {
  status?: 'scheduled' | 'attended' | 'canceled' | 'rescheduled';
  color?: string;
  reminder?: boolean;
  conflicts?: string[];
}

const STATUS_COLORS = {
  scheduled: '#64748B',
  attended: '#059669',
  canceled: '#DC2626',
  rescheduled: '#F59E0B',
};

const CLASS_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#84CC16',
  '#06B6D4',
];

type DataEntry = {
  [key: string]: string;
};

type SlotEntry = {
  id: string;
  courseId: string;
  day: string;
  slot: string;
  courseName: string;
};

type SlotMap = {
  [key: string]: {
    courseId: string;
    courseName: string;
  };
};
export default function Timetable() {
  const { value: timetable, setValue: setTimetable } = useStorage<
    ExtendedTimetableEntry[]
  >('timetable', []);
  const { value: userCourses, setValue: setUserCourses } = useStorage<
    CourseType[]
  >('userCourses', []);
  const { value: viewMode, setValue: setViewMode } = useStorage<
    'grid' | 'list'
  >('timetableView', 'grid');
  const { value: showAnalytics, setValue: setShowAnalytics } = useStorage(
    'showAnalytics',
    false
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] =
    useState<ExtendedTimetableEntry | null>(null);
  const [currentClass, setCurrentClass] =
    useState<ExtendedTimetableEntry | null>(null);
  const [newDataEntry, setNewDataEntry] = useState<DataEntry>({});
  const [currentDay, setCurrentDay] = useState<string>('');
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [newData] = useState<SlotEntry[]>([]);
  const [day, setDay] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<SlotMap>({});
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [numberOfSlots, setNumberOfSlots] = useState(4);

  const finalDataToSave: SlotEntry[] = Object.entries(selectedSlots).map(
    ([slot, { courseId, courseName }]) => ({
      id: Date.now().toString(),
      courseId,
      day,
      slot,
      courseName,
    })
  );

  const userCoursesData = [
    { label: 'Free Slot', value: 'freeSlot' },
    ...userCourses.map((course, index) => ({
      label: course.courseName,
      value: course.courseId,
    })),
  ];

  const [newEntry, setNewEntry] = useState({
    day: '',
    time: '',
    courseName: '',
    courseId: '',
    location: '',
    duration: '55',
    color: CLASS_COLORS[0],
    reminder: true,
  });

  const timelineRef = useRef<Animated.Value>(new Animated.Value(0)).current;
  const progressAnimation = useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    updateCurrentClass();
    detectConflicts();
    const interval = setInterval(() => {
      updateCurrentClass();
      updateTimeProgress();
    }, 60000);
    return () => clearInterval(interval);
  }, [timetable]);

  const updateCurrentClass = () => {
    const now = new Date();
    const currentDayName = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    setCurrentDay(currentDayName);

    const todayClasses = timetable
      .filter((entry) => entry.day === currentDayName)
      .sort((a, b) => parseTime(a.time) - parseTime(b.time));

    let current = null;
    for (const classEntry of todayClasses) {
      const classTime = parseTime(classEntry.time);
      const classEnd = classTime + classEntry.duration;

      if (currentTime >= classTime && currentTime < classEnd) {
        current = classEntry;
        break;
      }
    }

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

  const updateTimeProgress = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const dayStart = 8 * 60; // 8 AM
    const dayEnd = 20 * 60; // 8 PM
    const progress = Math.max(
      0,
      Math.min(1, (currentTime - dayStart) / (dayEnd - dayStart))
    );
    setTimeProgress(progress);

    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const detectConflicts = () => {
    const conflictList: string[] = [];

    DAYS.forEach((day) => {
      const dayClasses = timetable
        .filter((entry) => entry.day === day)
        .sort((a, b) => parseTime(a.time) - parseTime(b.time));

      for (let i = 0; i < dayClasses.length - 1; i++) {
        const current = dayClasses[i];
        const next = dayClasses[i + 1];
        const currentEnd = parseTime(current.time) + current.duration;
        const nextStart = parseTime(next.time);

        if (currentEnd > nextStart) {
          conflictList.push(
            `${day}: ${current.courseName} overlaps with ${next.courseName}`
          );
        }
      }
    });

    setConflicts(conflictList);
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

  const saveSlots = () => {
    if (!day) {
      Alert.alert('Error', 'Please select a day');
      return;
    }

    const slotsToSave = Object.entries(selectedSlots)
      .filter(([slot, { courseId }]) => courseId && courseId !== 'freeSlot')
      .map(([slot, { courseId, courseName }]) => {
        // Generate time based on slot number
        const slotNumber = parseInt(slot.replace('slot', ''));
        const startHour = 8 + slotNumber; // Starting from 9 AM
        const time = `${startHour.toString().padStart(2, '0')}:00`;

        const entry: ExtendedTimetableEntry = {
          id: `${day}-${slot}-${Date.now()}`,
          day: day,
          time: time,
          courseName: courseName,
          courseId: courseId,
          location: '',
          duration: 55, // Default 55 minutes
          status: 'scheduled',
          color: CLASS_COLORS[Math.floor(Math.random() * CLASS_COLORS.length)],
          reminder: true,
        };
        return entry;
      });

    if (slotsToSave.length === 0) {
      Alert.alert('Error', 'Please select at least one course');
      return;
    }

    // Remove existing entries for this day to avoid duplicates
    const filteredTimetable = timetable.filter((entry) => entry.day !== day);

    // Add new slots
    setTimetable([...filteredTimetable, ...slotsToSave]);

    // Reset form
    resetSlots();
    setShowAddModal(false);

    Alert.alert('Success', `${slotsToSave.length} classes added to ${day}`);
  };

  // Add a reset function for the slots
  const resetSlots = () => {
    setSelectedSlots({});
    setNewDataEntry({});
    setNumberOfSlots(4);
    setDay('');
  };

  const addOrUpdateEntry = () => {
    if (
      !newEntry.time ||
      !newEntry.courseName.trim() ||
      !newEntry.courseId.trim()
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const entry: ExtendedTimetableEntry = {
      id: editingEntry?.id || Date.now().toString(),
      day: newEntry.day,
      time: newEntry.time,
      courseName: newEntry.courseName.trim(),
      courseId: newEntry.courseId.trim(),
      location: newEntry.location.trim(),
      duration: parseInt(newEntry.duration) || 60,
      status: 'scheduled',
      color: newEntry.color,
      reminder: newEntry.reminder,
    };

    // finalDataToSave.forEach((slot) => {
    //   setTimetable([ ...timetable,])
    // })
    if (editingEntry) {
      setTimetable(
        timetable.map((item) => (item.id === editingEntry.id ? entry : item))
      );
    } else {
      setTimetable([...timetable, entry]);
    }

    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setNewEntry({
      day: '',
      time: '',
      courseName: '',
      courseId: '',
      location: '',
      duration: '55',
      color: CLASS_COLORS[Math.floor(Math.random() * CLASS_COLORS.length)],
      reminder: true,
    });
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    Alert.alert('Delete Class', 'Are you sure you want to delete this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTimetable(timetable.filter((entry) => entry.id !== id));
        },
      },
    ]);
  };

  const updateEntryStatus = (
    id: string,
    status: ExtendedTimetableEntry['status']
  ) => {
    setTimetable(
      timetable.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const editEntry = (entry: ExtendedTimetableEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      day: entry.day,
      time: entry.time,
      courseName: entry.courseName,
      courseId: entry.courseId,
      location: entry.location || '',
      duration: entry.duration.toString(),
      color: entry.color || CLASS_COLORS[0],
      reminder: entry.reminder || true,
    });
    setShowAddModal(true);
  };

  const exportTimetable = async () => {
    try {
      const timetableText = timetable
        .map(
          (entry) =>
            `${entry.day} - ${formatTime(entry.time)} - ${entry.courseName} (${
              entry.courseId
            }) - ${entry.location || 'No location'}`
        )
        .join('\n');

      await Share.share({
        message: `My Timetable:\n\n${timetableText}`,
        title: 'My Class Timetable',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export timetable');
    }
  };

  const getWeeklyStats = () => {
    const totalClasses = timetable.length;
    const attendedClasses = timetable.filter(
      (entry) => entry.status === 'attended'
    ).length;
    const canceledClasses = timetable.filter(
      (entry) => entry.status === 'canceled'
    ).length;
    const attendanceRate =
      totalClasses > 0
        ? ((attendedClasses / totalClasses) * 100).toFixed(1)
        : '0';

    return { totalClasses, attendedClasses, canceledClasses, attendanceRate };
  };

  const isCurrentClass = (entry: ExtendedTimetableEntry): boolean => {
    if (entry.day !== currentDay) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const classTime = parseTime(entry.time);
    const classEnd = classTime + entry.duration;
    return currentTime >= classTime && currentTime < classEnd;
  };

  const isNextClass = (entry: ExtendedTimetableEntry): boolean => {
    return currentClass?.id === entry.id && !isCurrentClass(entry);
  };

  const renderListView = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Current/Next Class Card */}
      {currentClass && (
        <View
          style={[
            styles.currentClassCard,
            isCurrentClass(currentClass)
              ? styles.activeClass
              : styles.nextClass,
          ]}
        >
          <View style={styles.currentClassHeader}>
            <Text style={styles.currentClassLabel}>
              {isCurrentClass(currentClass)
                ? '🟢 Current Class'
                : '⏰ Next Class'}
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
              <Text style={styles.currentClassLocation}>
                {currentClass.location}
              </Text>
            </View>
          )}

          {isCurrentClass(currentClass) && (
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.quickActionButton, styles.attendedButton]}
                onPress={() => updateEntryStatus(currentClass.id, 'attended')}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Attended</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, styles.canceledButton]}
                onPress={() => updateEntryStatus(currentClass.id, 'canceled')}
              >
                <XCircle size={16} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Canceled</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <View style={styles.conflictsCard}>
          <View style={styles.conflictHeader}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.conflictTitle}>Schedule Conflicts</Text>
          </View>
          {conflicts.map((conflict, index) => (
            <Text key={index} style={styles.conflictText}>
              • {conflict}
            </Text>
          ))}
        </View>
      )}

      {/* Weekly Analytics */}
      {showAnalytics && (
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>📊 Weekly Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {getWeeklyStats().totalClasses}
              </Text>
              <Text style={styles.statLabel}>Total Classes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#059669' }]}>
                {getWeeklyStats().attendedClasses}
              </Text>
              <Text style={styles.statLabel}>Attended</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#DC2626' }]}>
                {getWeeklyStats().canceledClasses}
              </Text>
              <Text style={styles.statLabel}>Canceled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#2563EB' }]}>
                {getWeeklyStats().attendanceRate}%
              </Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
          </View>
        </View>
      )}

      {/* Days Schedule */}
      {DAYS.map((day) => {
        const dayClasses = timetable
          .filter((entry) => entry.day === day)
          .sort((a, b) => parseTime(a.time) - parseTime(b.time));

        return (
          <View key={day} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <Text
                style={[
                  styles.dayTitle,
                  day === currentDay && styles.currentDayTitle,
                ]}
              >
                {day} {day === currentDay && '(Today)'}
              </Text>
              {day === currentDay && (
                <View style={styles.progressContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
              )}
            </View>

            {dayClasses.length === 0 ? (
              <Text style={styles.noClassesText}>No classes scheduled</Text>
            ) : (
              dayClasses.map((entry, index) => (
                <View key={index} style={styles.classCardWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.classCard,
                      isCurrentClass(entry) && styles.activeClassCard,
                      isNextClass(entry) && styles.nextClassCard,
                      { borderLeftColor: entry.color || '#E5E7EB' },
                    ]}
                    onPress={() => editEntry(entry)}
                    onLongPress={() => deleteEntry(entry.id)}
                  >
                    <View style={styles.classHeader}>
                      <View style={styles.classTimeContainer}>
                        <Text style={styles.classTime}>
                          {formatTime(entry.time)}
                        </Text>
                        <Text style={styles.classDuration}>
                          {entry.duration} min
                        </Text>
                      </View>
                      <View style={styles.statusContainer}>
                        <View
                          style={[
                            styles.statusIndicator,
                            {
                              backgroundColor:
                                STATUS_COLORS[entry.status || 'scheduled'],
                            },
                          ]}
                        />
                        <Text style={styles.statusText}>
                          {entry.status || 'scheduled'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.className}>{entry.courseName}</Text>
                    <Text style={styles.classId}>{entry.courseId}</Text>

                    {entry.location && (
                      <View style={styles.locationContainer}>
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.classLocation}>
                          {entry.location}
                        </Text>
                      </View>
                    )}

                    {entry.reminder && (
                      <View style={styles.reminderBadge}>
                        <Bell size={10} color="#F59E0B" />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Quick Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => updateEntryStatus(entry.id, 'attended')}
                    >
                      <Check size={14} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => updateEntryStatus(entry.id, 'canceled')}
                    >
                      <XCircle size={14} color="#DC2626" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => editEntry(entry)}
                    >
                      <Edit3 size={14} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderGridView = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        <View style={styles.timeColumn}>
          <View style={styles.gridHeader} />
          {Array.from({ length: 9 }, (_, i) => {
            const hour = i + 9; // 9 AM to 5 PM
            return (
              <View key={hour} style={styles.timeSlot}>
                <Text style={styles.timeText}>
                  {/* {hour > 12 ? `${hour - 12}PM` : `${hour}AM`} */}
                  slot {i + 1}
                </Text>
              </View>
            );
          })}
        </View>

        {DAYS.slice(0, 6).map((day) => (
          <View key={day} style={styles.dayColumn}>
            <View style={styles.gridHeader}>
              <Text
                style={[
                  styles.gridDayTitle,
                  day === currentDay && styles.currentGridDay,
                ]}
              >
                {day.slice(0, 3)}
              </Text>
            </View>

            <View style={styles.daySlots}>
              {timetable
                .filter((entry) => entry.day === day)
                .map((entry, index) => {
                  const startHour = Math.floor(parseTime(entry.time) / 60);
                  const startMinute = parseTime(entry.time) % 60;
                  const top = ((startHour - 9) * 60 + startMinute) * (60 / 60); // 60px per hour
                  const height = (entry.duration / 60) * 60;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.gridClassCard,
                        {
                          top,
                          height,
                          backgroundColor: entry.color || '#3B82F6',
                        },
                        isCurrentClass(entry) && styles.currentGridClass,
                      ]}
                      onPress={() => editEntry(entry)}
                      onLongPress={() => deleteEntry(entry.id)}
                    >
                      <Text style={styles.gridClassName} numberOfLines={1}>
                        {entry.courseName}
                      </Text>
                      <Text style={styles.gridClassTime} numberOfLines={1}>
                        {formatTime(entry.time)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="Timetable" subtitle="Smart schedule management" />

      {/* View Toggle & Actions */}
      <View style={styles.controlBar}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'grid' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3
              size={20}
              color={viewMode === 'grid' ? '#FFFFFF' : '#64748B'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('list')}
          >
            <List
              size={20}
              color={viewMode === 'list' ? '#FFFFFF' : '#64748B'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionBar}>
          {viewMode === 'list' && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3
                size={20}
                color={showAnalytics ? '#2563EB' : '#64748B'}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={exportTimetable}
          >
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'list' ?  renderListView() : renderGridView()}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowAddModal(true);
        }}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEntry ? 'Edit Class' : 'Add Class'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {!editingEntry && <TouchableOpacity style={styles.clearButton} onPress={resetSlots}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {!editingEntry && <View>
              {/* Day Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Day</Text>
                <View style={styles.daySelector}>
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        newEntry.day === day && styles.selectedDayButton,
                      ]}
                      onPress={() => {
                        setNewEntry((prev) => ({ ...prev, day }));
                        setDay(day);
                      }}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          newEntry.day === day && styles.selectedDayButtonText, //no day should be selected by defaultr, do it tomorrow when wokeup
                        ]}
                      >
                        {day.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {Array.from({ length: numberOfSlots }, (_, i) => {
                const slotKey = `slot${i + 1}`;
                return (
                  <View key={slotKey}  style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Slot {i + 1}</Text>
                    <Dropdown
                      key={slotKey}
                      data={userCoursesData}
                      onChange={(item) => {
                        setNewDataEntry((prev) => ({
                          ...prev,
                          [slotKey]: item.value,
                        }));
                        setSelectedSlots((prev) => ({
                          ...prev,
                          [slotKey]: {
                            courseId: item.value,
                            courseName: item.label,
                          },
                        }));
                      }}
                      style={styles.dropdown}
                      labelField={'label'}
                      valueField={'value'}
                      placeholder="Select Course"
                      value={selectedSlots[slotKey]?.courseId || ''}
                    />
                  </View>
                );
              })}

              {numberOfSlots < 10 && (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { marginBottom: 0, backgroundColor: '#198754' },
                  ]}
                  onPress={() =>
                    setNumberOfSlots((prev) => (prev < 10 ? prev + 1 : prev))
                  }
                >
                  <Text style={styles.addButtonText}>Add Slot</Text>
                </TouchableOpacity>
              )}

              {numberOfSlots > 1 && (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: '#6B7280', marginBottom: 0 },
                  ]}
                  onPress={() =>
                    setNumberOfSlots((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  <Text style={styles.addButtonText}>Remove Slot</Text>
                </TouchableOpacity>
              )}

              {
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { marginBottom: 20, backgroundColor: '#2563EB' },
                  ]}
                  onPress={saveSlots}
                >
                  <Text style={styles.addButtonText}>Save Slots</Text>
                </TouchableOpacity>
              }

              <Text style={styles.orText}>OR</Text>

              <TouchableOpacity
                style={[styles.addButton, styles.secondaryButton]}
                activeOpacity={0.8}
              >
                <Text style={[styles.addButtonText, { color: '#2563EB' }]}>
                  Add Courses Manually
                </Text>
                <Text style={[styles.addButtonSubtext, { color: '#64748B' }]}>
                  Add your courses manually below
                </Text>
              </TouchableOpacity>
            </View>}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={newEntry.time}
                onChangeText={(text) =>
                  setNewEntry((prev) => ({ ...prev, time: text }))
                }
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Course Details */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name</Text>
              <TextInput
                style={styles.input}
                value={newEntry.courseName}
                onChangeText={(text) =>
                  setNewEntry((prev) => ({ ...prev, courseName: text }))
                }
                placeholder="e.g., Data Structures"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course ID</Text>
              <TextInput
                style={styles.input}
                value={newEntry.courseId}
                onChangeText={(text) =>
                  setNewEntry((prev) => ({ ...prev, courseId: text }))
                }
                placeholder="e.g., CS101"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>

            {/* Location and Duration */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.location}
                  onChangeText={(text) =>
                    setNewEntry((prev) => ({ ...prev, location: text }))
                  }
                  placeholder="Room 101"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.duration}
                  onChangeText={(text) =>
                    setNewEntry((prev) => ({ ...prev, duration: text }))
                  }
                  placeholder="55"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Color Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Color Theme</Text>
              <View style={styles.colorPicker}>
                {CLASS_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      newEntry.color === color && styles.selectedColor,
                    ]}
                    onPress={() => setNewEntry((prev) => ({ ...prev, color }))}
                  />
                ))}
              </View>
            </View>

            {/* Reminder Toggle */}
            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Enable Reminder</Text>
              <Switch
                value={newEntry.reminder}
                onValueChange={(value) =>
                  setNewEntry((prev) => ({ ...prev, reminder: value }))
                }
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={newEntry.reminder ? '#2563EB' : '#64748B'}
              />
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={addOrUpdateEntry}
            >
              <Text style={styles.addButtonText}>
                {editingEntry ? 'Update Class' : 'Add Class'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#2563EB',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
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
    marginBottom: 8,
  },
  currentClassLocation: {
    fontSize: 14,
    color: '#64748B',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  attendedButton: {
    backgroundColor: '#059669',
  },
  canceledButton: {
    backgroundColor: '#DC2626',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  conflictsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  conflictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  conflictTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  conflictText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  currentDayTitle: {
    color: '#2563EB',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  noClassesText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  classCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeClassCard: {
    backgroundColor: '#F0FDF4',
    borderLeftColor: '#059669',
  },
  nextClassCard: {
    backgroundColor: '#FFFBEB',
    borderLeftColor: '#F59E0B',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  classTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  className: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
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
  reminderBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    marginLeft: 8,
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    // marginBottom: 100,
  },
  timeColumn: {
    width: 60,
  },
  gridHeader: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  timeSlot: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  dayColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  gridDayTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  currentGridDay: {
    color: '#2563EB',
  },
  daySlots: {
    position: 'relative',
    height: 650, // 13 hours * 60px
  },
  gridClassCard: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
    padding: 4,
    opacity: 0.9,
  },
  currentGridClass: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gridClassName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridClassTime: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.8,
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
    shadowOffset: { width: 0, height: 4 },
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
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#1E293B',
  },
  dropdown: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginVertical: 15,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
});
