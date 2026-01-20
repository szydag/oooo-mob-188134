import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// --- Theme & Types Setup ---
const THEME = {
  danger: "#DC2626",
  primary: "#2563EB",
  success: "#059669",
  secondary: "#F3F4F6",
  background: "#FFFFFF"
};
// IMPORTANT: Use 10.0.2.2 for Android Emulator connecting to host localhost:3000
const API_BASE_URL = 'http://10.0.2.2:3000/api/tasks'; 

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null; // ISO string date
  status: 'Pending' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (data: { title: string, description: string, dueDate: string | null }) => Promise<boolean>;
  updateTaskStatus: (id: number, status: 'Pending' | 'Completed') => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;
  getTaskById: (id: number) => Task | undefined;
  theme: typeof THEME;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- App Provider ---
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      Alert.alert("Hata", "Görevler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (data: { title: string, description: string, dueDate: string | null }): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to create task:", error);
      Alert.alert("Hata", "Görev kaydedilemedi.");
      return false;
    }
  };
  
  const updateTaskStatus = async (id: number, status: 'Pending' | 'Completed'): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update status:", error);
      Alert.alert("Hata", "Görev durumu güncellenemedi.");
      return false;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete task:", error);
      Alert.alert("Hata", "Görev silinemedi.");
      return false;
    }
  };

  const getTaskById = (id: number) => tasks.find(t => t.id === id);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const contextValue: AppContextType = {
    tasks,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    theme: THEME,
  };

  if (loading) {
    return (
      <ActivityIndicator 
        style={{ flex: 1, justifyContent: 'center', backgroundColor: THEME.background }} 
        size="large" 
        color={THEME.primary} 
      />
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// --- Main App Component ---
export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      <AppNavigator />
    </AppProvider>
  );
}