import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Plus, Minus, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Course } from '@/types';

interface AttendanceCardProps {
  course: Course;
  onIncrement: (type: 'total' | 'present') => void;
  onDecrement: (type: 'total' | 'present') => void;
  requiredPercentage: number;
  onLongPress: () => void;
}

export default function AttendanceCard({ 
  course, 
  onIncrement, 
  onDecrement, 
  requiredPercentage,
  onLongPress
}: AttendanceCardProps) {
  const percentage = course.totalHours > 0 ? (course.presentHours / course.totalHours) * 100 : 0;
  const isLow = percentage < requiredPercentage;
  
  const calculateRequiredClasses = () => {
    if (percentage >= requiredPercentage) return 0;
    return Math.ceil((requiredPercentage * course.totalHours - 100 * course.presentHours) / (100 - requiredPercentage));
  };

  const calculateBunkableClasses = () => {
    if (percentage < requiredPercentage) return 0;
    return Math.floor((100 * course.presentHours - requiredPercentage * course.totalHours) / requiredPercentage);
  };

  const requiredClasses = calculateRequiredClasses();
  const bunkableClasses = calculateBunkableClasses();

  return (
    <TouchableOpacity activeOpacity={0.8}  style={[styles.container, { borderLeftColor: course.color }]} onLongPress={onLongPress}>
      <View style={styles.header}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{course.courseName}</Text>
          <Text style={styles.courseId}>{course.courseId}</Text>
        </View>
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentage, { color: isLow ? '#DC2626' : '#059669' }]}>
            {percentage.toFixed(1)}%
          </Text>
          {isLow ? (
            <AlertTriangle size={20} color="#DC2626" />
          ) : (
            <CheckCircle size={20} color="#059669" />
          )}
        </View>
      </View>

      <View style={styles.hoursContainer}>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Total Hours:</Text>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => onDecrement('total')}
            >
              <Minus size={16} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.hoursValue}>{course.totalHours}</Text>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => onIncrement('total')}
            >
              <Plus size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Present Hours:</Text>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => onDecrement('present')}
            >
              <Minus size={16} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.hoursValue}>{course.presentHours}</Text>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => onIncrement('present')}
            >
              <Plus size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isLow ? (
        <View style={[styles.statusContainer, styles.warningContainer]}>
          <Text style={styles.statusText}>
            Need to attend {requiredClasses} more classes to reach {requiredPercentage}%
          </Text>
        </View>
      ) : (
        <View style={[styles.statusContainer, styles.successContainer]}>
          <Text style={styles.statusTextSuccess}>
            You can skip {bunkableClasses} classes and maintain {requiredPercentage}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  courseId: {
    fontSize: 14,
    color: '#64748B',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700',
  },
  hoursContainer: {
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoursLabel: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoursValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 40,
    textAlign: 'center',
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
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
    textAlign: 'center',
  },
  statusTextSuccess: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
    textAlign: 'center',
  },
});