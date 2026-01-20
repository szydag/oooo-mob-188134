import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext, Task } from '../../App';
import { CustomHeader } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'home'>;

// Component: Search Bar
const SearchBar: React.FC<{ placeholder: string, onSearch: (text: string) => void }> = ({ placeholder, onSearch }) => {
    const { theme } = useAppContext();
    return (
        <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#999"
                onChangeText={onSearch}
            />
        </View>
    );
};

// Component: Task Item (List)
interface TaskItemProps {
    task: Task;
    onPress: () => void;
    showStatusIcon: boolean;
}
const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, showStatusIcon }) => {
    const { theme } = useAppContext();
    const isCompleted = task.status === 'Completed';

    const statusColor = isCompleted ? theme.success : theme.primary;
    const statusIcon = isCompleted ? 'check-circle' : 'hourglass-empty';

    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : 'Tarih Belirtilmemiş';

    return (
        <TouchableOpacity style={styles.listItem} onPress={onPress}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{task.title}</Text>
                <Text style={styles.itemDate}>Bitiş: {dueDate}</Text>
            </View>
            {showStatusIcon && (
                <Icon name={statusIcon} size={24} color={statusColor} style={styles.statusIcon} />
            )}
        </TouchableOpacity>
    );
};

// Component: Floating Action Button
const FloatingActionButton: React.FC<{ icon: string, color: string, action: () => void }> = ({ icon, color, action }) => (
    <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={action}>
        <Icon name={icon} size={30} color="#FFFFFF" />
    </TouchableOpacity>
);


const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { tasks, theme } = useAppContext();
    const [searchText, setSearchText] = useState('');

    const filteredTasks = useMemo(() => {
        if (!searchText) {
            return tasks;
        }
        const lowerSearch = searchText.toLowerCase();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(lowerSearch) || 
            (task.description?.toLowerCase().includes(lowerSearch))
        );
    }, [tasks, searchText]);
    
    // Design Component Mapping
    const headerProps = { color: theme.primary, title: "Görevlerim" };
    const searchBarProps = { placeholder: "Görev ara..." };
    const listProps = { showStatusIcon: true, itemCount: 5 }; 
    const fabProps = { icon: "add", color: theme.primary };
    
    return (
        <View style={styles.container}>
            
            {/* 1. Header */}
            <CustomHeader {...headerProps} navigation={navigation} />

            <View style={styles.content}>
                {/* 2. Search Bar */}
                <SearchBar {...searchBarProps} onSearch={setSearchText} />

                {/* 3. List */}
                {filteredTasks.length === 0 ? (
                     <Text style={styles.noTasks}>Henüz görev bulunmamaktadır.</Text>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TaskItem
                                task={item}
                                showStatusIcon={listProps.showStatusIcon}
                                onPress={() => navigation.navigate('detail', { taskId: item.id })}
                            />
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                )}
            </View>

            {/* 4. FAB */}
            <FloatingActionButton 
                {...fabProps} 
                action={() => navigation.navigate('add_task')}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 15,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    listItem: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    itemDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusIcon: {
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    noTasks: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    }
});

export default HomeScreen;