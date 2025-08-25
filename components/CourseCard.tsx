import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  Pressable,
  StyleSheet,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { Course } from '@/constants/courses';
import React from 'react';
import { TrendingUp } from 'lucide-react-native';

interface CourseCardProps {
  course: Course;
  isSelected?: boolean;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.card]}
      activeOpacity={0.4}
      onPress={onPress}
    >
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {isSelected && <View style={styles.selected}></View>}
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            {course.courseName.slice(0, 25) + (course.courseName.length > 25 ? '...' : '')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>{course.courseId} {`(${course.department})`}</Text>
        </View>
      </View>
      <TrendingUp size={24} color="#4F46E5" />
    </TouchableOpacity>
  );
};

export default React.memo(CourseCard);
const styles = StyleSheet.create({
  card: {
    width: '95%',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selected: {
    backgroundColor: '#018dff',
    borderRadius: 10,
    width: 3,
    height: 40,
    marginLeft: 5,
  },
});
