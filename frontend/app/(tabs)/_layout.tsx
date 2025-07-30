import { Tabs } from 'expo-router';
import { Home, MessageCircle, Bell, MoreHorizontal, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tab layout combining the best navigation from AL and Mike implementations
 * Enhanced with unified DevSync branding
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1D29',
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 8,
          height: 70 + Math.max(insets.bottom, 12) - 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8B8D97',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dms"
        options={{
          title: 'DMs',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ size, color }) => (
            <Bell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color }) => (
            <MoreHorizontal size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}