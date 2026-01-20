import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import DetailScreen from '../screens/DetailScreen';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../../App';

const Stack = createNativeStackNavigator();

// --- Reusable Components ---

// Component: Header
interface HeaderProps {
  title: string;
  color: string;
  showBackButton?: boolean;
  actions?: ('edit' | 'delete')[];
  navigation: any; 
  taskId?: number;
}
const CustomHeader: React.FC<HeaderProps> = ({ title, color, showBackButton, actions, navigation, taskId }) => {
    const { deleteTask, theme } = useAppContext();

    const handleAction = (action: 'edit' | 'delete') => {
        if (!taskId) return; 

        if (action === 'delete') {
            navigation.goBack();
            deleteTask(taskId);
        } else if (action === 'edit') {
             // For simplicity, skip actual editing flow
             alert("Düzenleme özelliği şuan aktif değil.");
        }
    }

    return (
        <View style={[styles.header, { backgroundColor: color }]}>
            {showBackButton && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>{title}</Text>
            {actions && (
                <View style={styles.headerActions}>
                    {actions.includes('edit') && (
                        <TouchableOpacity onPress={() => handleAction('edit')} style={{ marginLeft: 15 }}>
                            <Icon name="edit" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                    {actions.includes('delete') && (
                        <TouchableOpacity onPress={() => handleAction('delete')} style={{ marginLeft: 15 }}>
                            <Icon name="delete" size={24} color={theme.danger} /> 
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {/* Spacer for alignment if no actions/back button */}
            {!showBackButton && !actions && <View style={styles.spacer} />}
        </View>
    );
}

// --- App Navigator Setup ---

export type RootStackParamList = {
  home: undefined;
  add_task: undefined;
  detail: { taskId: number };
};

const AppNavigator: React.FC = () => {
  const { theme } = useAppContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="add_task" component={AddTaskScreen} />
        <Stack.Screen name="detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        height: 60,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        zIndex: 10,
    },
    headerActions: {
        flexDirection: 'row',
        position: 'absolute',
        right: 15,
    },
    spacer: { width: 24, height: 24 } // To balance title centering
});

export { CustomHeader }; 
export default AppNavigator;