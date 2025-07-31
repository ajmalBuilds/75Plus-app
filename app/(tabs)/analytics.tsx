import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react-native';
import { Course } from '@/types';
import { useStorage } from '@/hooks/useStorage';
import Header from '@/components/Header';

const screenWidth = Dimensions.get('window').width;

export default function Analytics() {
  const { value: courses } = useStorage<Course[]>('courses', []);
  const { value: requiredPercentage } = useStorage('requiredPercentage', 75);

  const generateTrendData = () => {
    if (courses.length === 0) {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [0, 0, 0, 0],
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        }]
      };
    }

    // Simulate weekly attendance data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const trendData = weeks.map((_, index) => {
      const weeklyAttendance = courses.reduce((sum, course) => {
        const percentage = course.totalHours > 0 ? (course.presentHours / course.totalHours) * 100 : 0;
        // Simulate slight variation in weekly data
        const variation = (Math.random() - 0.5) * 10;
        return sum + Math.max(0, Math.min(100, percentage + variation));
      }, 0) / courses.length;
      
      return Math.round(weeklyAttendance);
    });

    return {
      labels: weeks,
      datasets: [{
        data: trendData,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 3,
      }]
    };
  };

  const chartData = generateTrendData();
  const currentAverage = courses.length > 0 
    ? courses.reduce((sum, course) => {
        const percentage = course.totalHours > 0 ? (course.presentHours / course.totalHours) * 100 : 0;
        return sum + percentage;
      }, 0) / courses.length
    : 0;

  const lastWeekAverage = chartData.datasets[0].data[chartData.datasets[0].data.length - 2] || 0;
  const trend = currentAverage - lastWeekAverage;
  const isPositiveTrend = trend >= 0;

  const coursesAboveTarget = courses.filter(course => {
    const percentage = course.totalHours > 0 ? (course.presentHours / course.totalHours) * 100 : 0;
    return percentage >= requiredPercentage;
  }).length;

  const totalHours = courses.reduce((sum, course) => sum + course.totalHours, 0);
  const totalPresentHours = courses.reduce((sum, course) => sum + course.presentHours, 0);

  return (
    <View style={styles.container}>
      <Header title="Analytics" subtitle="Track your attendance trends" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#EFF6FF' }]}>
              <Target size={20} color="#2563EB" />
            </View>
            <Text style={styles.metricValue}>{currentAverage.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Overall Average</Text>
            <View style={styles.trendContainer}>
              {isPositiveTrend ? (
                <TrendingUp size={16} color="#059669" />
              ) : (
                <TrendingDown size={16} color="#DC2626" />
              )}
              <Text style={[styles.trendText, { color: isPositiveTrend ? '#059669' : '#DC2626' }]}>
                {Math.abs(trend).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#F0FDF4' }]}>
              <Calendar size={20} color="#059669" />
            </View>
            <Text style={styles.metricValue}>{coursesAboveTarget}</Text>
            <Text style={styles.metricLabel}>Above Target</Text>
            <Text style={styles.metricSubtext}>
              out of {courses.length} courses
            </Text>
          </View>
        </View>

        {courses.length > 0 && (
          <View style={styles.chartContainer}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitle}>Attendance Trend</Text>
            </View>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: {
                  borderRadius: 16,
                  padding: 0,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2563EB',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Classes:</Text>
            <Text style={styles.summaryValue}>{totalHours}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Classes Attended:</Text>
            <Text style={styles.summaryValue}>{totalPresentHours}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Classes Missed:</Text>
            <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
              {totalHours - totalPresentHours}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Target Percentage:</Text>
            <Text style={styles.summaryValue}>{requiredPercentage}%</Text>
          </View>
        </View>

        {courses.length > 0 && (
          <View style={styles.courseBreakdown}>
            <Text style={styles.breakdownTitle}>Course Breakdown</Text>
            {courses.map(course => {
              const percentage = course.totalHours > 0 ? (course.presentHours / course.totalHours) * 100 : 0;
              const isAboveTarget = percentage >= requiredPercentage;
              
              return (
                <View key={course.id} style={styles.courseItem}>
                  <View style={styles.courseHeader}>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseName}>{course.name}</Text>
                      <Text style={styles.courseId}>{course.courseId}</Text>
                    </View>
                    <Text style={[styles.coursePercentage, { color: isAboveTarget ? '#059669' : '#DC2626' }]}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progress, 
                        { 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isAboveTarget ? '#059669' : '#DC2626'
                        }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.targetLine,
                        { left: `${requiredPercentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.courseStats}>
                    {course.presentHours}/{course.totalHours} classes attended
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {courses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptySubtitle}>
              Add some courses to see your attendance analytics
            </Text>
          </View>
        )}
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
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
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricSubtext: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitleContainer: {
    width: '100%',
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  chart: {
    borderRadius: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  courseBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  courseItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  courseId: {
    fontSize: 14,
    color: '#64748B',
  },
  coursePercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginBottom: 8,
    position: 'relative',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
  targetLine: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: '#F59E0B',
  },
  courseStats: {
    fontSize: 12,
    color: '#64748B',
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
});