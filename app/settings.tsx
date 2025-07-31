import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { Settings as SettingsIcon, Target, Trash2, Info, Moon, Bell } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import * as FileSystem from 'expo-file-system';
import * as FileSharing from 'expo-sharing'
import Header from '@/components/Header';

export default function Settings() {
  const { value: requiredPercentage, setValue: setRequiredPercentage } = useStorage('requiredPercentage', 75);
  const { value: courses, setValue: setCourses } = useStorage<{ totalHours: number }[]>('courses', []);
  const { value: timetable, setValue: setTimetable } = useStorage('timetable', []);
  const { value: darkMode, setValue: setDarkMode } = useStorage('darkMode', false);
  const { value: notifications, setValue: setNotifications } = useStorage('notifications', true);
  
  const [tempPercentage, setTempPercentage] = useState(requiredPercentage.toString());

  const updateRequiredPercentage = () => {
    const percentage = parseInt(tempPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      Alert.alert('Invalid Input', 'Please enter a valid percentage between 0 and 100');
      setTempPercentage(requiredPercentage.toString());
      return;
    }
    setRequiredPercentage(percentage);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your courses, timetable, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            setCourses([]);
            setTimetable([]);
            setRequiredPercentage(75);
            setTempPercentage('75');
            Alert.alert('Success', 'All data has been cleared');
          }
        },
      ]
    );
  };

  const exportFile = async (data: any) => {
    const fileUri = FileSystem.documentDirectory + 'attendance_data.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
    
    if (await FileSharing.isAvailableAsync()) {
      await FileSharing.shareAsync(fileUri);
    } else {
      Alert.alert('Export Failed', 'File sharing is not available on this device.');
    }
  }

  
  const exportData = async () => {
    const data = {
      courses,
      timetable,
      requiredPercentage,
      exportDate: new Date().toISOString(),
    };
    
    Alert.alert(
      'Export Data',
      `Export contains:\n• ${courses.length} courses\n• ${timetable.length} timetable entries\n• Settings\n\nData: ${JSON.stringify(data).slice(0, 100)}...`,
      [
        { text: 'OK' ,
          onPress: async () => {
            try {
              await exportFile(data);
              Alert.alert('Export Successful', 'Your data has been exported successfully.');
            } catch (error) {
              Alert.alert('Export Failed', 'An error occurred while exporting your data.');
            }
          }
         }
      ]
    );
  };


  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Attendance Target</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Required Attendance Percentage</Text>
            <Text style={styles.settingDescription}>
              Set your target attendance percentage. Courses below this will show warnings.
            </Text>
            <View style={styles.percentageContainer}>
              <TextInput
                style={styles.percentageInput}
                value={tempPercentage}
                onChangeText={setTempPercentage}
                onBlur={updateRequiredPercentage}
                keyboardType="numeric"
                placeholder="75"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.percentageSymbol}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Enable dark theme for better viewing in low light
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get reminders for upcoming classes and low attendance
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={exportData}>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>
                Export your attendance data for backup
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={clearAllData}
          >
            <Trash2 size={20} color="#DC2626" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: '#DC2626' }]}>Clear All Data</Text>
              <Text style={[styles.actionDescription, { color: '#B91C1C' }]}>
                Permanently delete all courses and timetable data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection }>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>75Plus</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Your personal attendance tracking companion. Stay on top of your academic goals 
              with smart insights and trend analysis.
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{courses.length}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timetable.length}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {courses.reduce((sum, course) => sum + course.totalHours, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
          </View>
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  settingItem: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  percentageInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    width: 80,
    textAlign: 'center',
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  aboutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 66,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  aboutContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});