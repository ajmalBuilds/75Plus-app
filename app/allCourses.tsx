import { useState, useCallback, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CourseCard from '@/components/CourseCard';
import { Course as CourseType, COURSE_COLORS } from '@/types';
import { courses } from '@/constants/courses';
import { useStorage } from '@/hooks/useStorage';
import { useRouter } from 'expo-router';

const yearData = [
  { label: 'PUC-I', value: 'P1' },
  { label: 'PUC-II', value: 'P2' },
  { label: 'E1 (B. Tech 1st Year)', value: 'E1' },
  { label: 'E2 (B. Tech 2nd Year)', value: 'E2' },
  { label: 'E3 (B. Tech 3rd Year)', value: 'E3' },
  { label: 'E4 (B. Tech 4th Year)', value: 'E4' },
];

const departmentData = [
  { label: 'PUC', value: 'PUC' },
  { label: 'Mechanical Engineering', value: 'ME' },
  { label: 'Computer Science and Engineering', value: 'CSE' },
  { label: 'Electronics and Communication Engineering', value: 'ECE' },
  { label: 'Electrical and Electronics Engineering', value: 'EEE' },
  { label: 'Civil Engineering', value: 'CE' },
  { label: 'Chemical Engineering', value: 'CHE' },
  { label: 'Metallurgy and Materials Engineering', value: 'MME' },
];

const semesterData = [
  { label: 'Semester 1', value: 'S1' },
  { label: 'Semester 2', value: 'S2' },
];

interface AllCoursesProps {
  onCoursesAdded?: (selectedCourses: CourseType[]) => void;
  existingCourseIds?: number[];
}

export default function AllCourses({ onCoursesAdded, existingCourseIds = [] }: AllCoursesProps) {
  const [text, setText] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const router = useRouter();
  // Remove the courses storage since we're using static data from constants
  const { loadValue, value: userCourses, setValue: setUserCourses } = useStorage<CourseType[]>('userCourses', []);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    year: null as string | null,
    department: null as string | null,
    semester: null as string | null,
  });

  const toggleSelect = useCallback((id: number) => {
    setSelectedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const filteredCourses = useMemo(() => {
    const term = text.trim().toLowerCase();

    return courses.filter((course) => {
      // Don't show courses that are already added by the user
      if (existingCourseIds.includes(course.id)) {
        return false;
      }

      const checkAlreadyAdded = course.id && userCourses.some(userCourse => userCourse.id === course.id);
      const matchesSearch =
        course.courseName.toLowerCase().includes(term) ||
        course.courseId.toLowerCase().includes(term);

      const matchesYear = filters.year ? course.year === filters.year : true;
      const matchesDepartment = filters.department
        ? course.department === filters.department
        : true;
      const matchesSemester = filters.semester
        ? course.semester === filters.semester
        : true;

      return (
        !checkAlreadyAdded && matchesSearch && matchesYear && matchesDepartment && matchesSemester
      );
    });
  }, [text, filters, courses, existingCourseIds]);

  const handleApplyFilter = () => {
    setFilters({
      year: selectedYear,
      department: selectedDepartment,
      semester: selectedSemester,
    });
    setSelectedYear(null);
    setSelectedDepartment(null);
    setSelectedSemester(null);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({ year: null, department: null, semester: null });
    setSelectedYear(null);
    setSelectedDepartment(null);
    setSelectedSemester(null);
  };

  const handleDeselectAll = () => {
    setSelectedCourses(new Set());
  };

  const handleAddCourses = () => {
    if (selectedCourses.size === 0) {
      Alert.alert('No Selection', 'Please select at least one course to add.');
      return;
    }

    // Get the selected course objects and add additional properties for user courses
    const selectedCourseObjects = courses
      .filter(course => selectedCourses.has(course.id))
      .map(course => ({
        ...course,
        totalHours: 0,
        presentHours: 0,
        color: COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)],
        createdAt: new Date()
      }));

    // Add selected courses to user's courses
    const updatedUserCourses = [...userCourses, ...selectedCourseObjects];
    setUserCourses(updatedUserCourses);
    // Call the callback if provided (for parent component)
    if (onCoursesAdded) {
      onCoursesAdded(selectedCourseObjects);
    }

    // Show success message
    Alert.alert(
      'Success', 
      `${selectedCourses.size} ${selectedCourses.size === 1 ? 'course' : 'courses'} added successfully!`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear selections and navigate back
            setSelectedCourses(new Set());
            router.back();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    if (selectedCourses.size > 0) {
      Alert.alert(
        'Discard Changes',
        'You have selected courses. Are you sure you want to cancel?',
        [
          { text: 'Keep Selecting', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setSelectedCourses(new Set());
              router.back();
            }
          }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: '#000' }}>Select Courses</Text>
        <TouchableOpacity onPress={handleAddCourses}>
          <Text style={[styles.headerText, { opacity: selectedCourses.size > 0 ? 1 : 0.5 }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={20} color="#5f5f5f" />
        <TextInput
          style={styles.inputBox}
          placeholder="search your courses..."
          value={text}
          onChangeText={(value: string) => setText(value)}
        />
        {text.length > 0 && (
          <TouchableOpacity activeOpacity={0.3} onPress={() => setText('')}>
            <X size={20} color="#5f5f5f" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Filter section */}
      <View style={styles.filterParentConainer}>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <SlidersHorizontal size={26}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn} onPress={handleClearFilters}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: '500', marginLeft: 10 }}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={handleDeselectAll}>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '500', marginLeft: 10 }}>
            Deselect All
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 16,
          color: '#5f5f5f',
          opacity: 0.6,
          marginLeft: 20,
          marginTop: 10,
          marginBottom: 10,
          fontWeight: '400',
        }}
      >
        All Courses ({filteredCourses.length} available to add)
      </Text>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedCourses.has(item.id);
          return (
            <CourseCard
              course={item}
              onPress={() => toggleSelect(item.id)}
              isSelected={isSelected}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#999', fontSize: 16 }}>
              {courses.length === 0 
                ? 'No courses available' 
                : 'No courses match your filters'
              }
            </Text>
          </View>
        }
        extraData={selectedCourses}
        initialNumToRender={15}
        maxToRenderPerBatch={30}
        windowSize={10}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
      />

      {/* Add Button */}
      {selectedCourses.size > 0 && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddCourses}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              textAlign: 'center',
              lineHeight: 50,
            }}
          >
            Add {selectedCourses.size}{' '}
            {selectedCourses.size === 1 ? 'Course' : 'Courses'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Course</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Select Department Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Department</Text>
              <Dropdown
                data={departmentData}
                onChange={(item) => setSelectedDepartment(item.value)}
                style={styles.dropdown}
                labelField={'label'}
                valueField={'value'}
                placeholder="Select Department"
                value={selectedDepartment}
              />
            </View>

            {/* Select Year Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Year</Text>
              <Dropdown
                data={yearData}
                onChange={(item) => setSelectedYear(item.value)}
                style={styles.dropdown}
                labelField={'label'}
                valueField={'value'}
                placeholder="Select Year"
                value={selectedYear}
              />
            </View>

            {/* Select Semester Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Semester</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                (For PUC select Semester 1)
              </Text>
              <Dropdown
                data={semesterData}
                onChange={(item) => setSelectedSemester(item.value)}
                style={styles.dropdown}
                labelField={'label'}
                valueField={'value'}
                placeholder="Select Semester"
                value={selectedSemester}
              />
            </View>

            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.modalAddButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalAddButton, { backgroundColor: '#6B7280' }]}
              onPress={() => {
                setSelectedYear(null);
                setSelectedDepartment(null);
                setSelectedSemester(null);
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.modalAddButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 80,
    paddingTop: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 200,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#00bfff',
    fontSize: 18,
    fontWeight: '400',
  },
  searchBar: {
    width: '90%',
    height: 45,
    backgroundColor: '#F3F4F8',
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingRight: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-start',
  },
  filterParentConainer: {
    width: '100%',
    height: 60,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',   
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#fff'
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F8',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBox: {
    width: '85%',
    height: '100%',
    fontSize: 16,
    color: '#5f5f5f',
  },
  addBtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#018dff',
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
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
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modalAddButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  modalAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});