import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverStackParamList, RootTabParamList } from '../types';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShortlistScreen from '../screens/ShortlistScreen';
import { useShortlist } from '../hooks/useShortlist';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<DiscoverStackParamList>();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#0f172a' },
  headerTintColor: '#f8fafc',
  headerTitleStyle: { fontWeight: '700' as const },
  contentStyle: { backgroundColor: '#0f172a' },
};

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen
        name="DiscoverFeed"
        component={DiscoverScreen}
        options={{ title: 'Discover Athletes' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Athlete Profile' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { shortlist } = useShortlist();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#334155' },
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tab.Screen
          name="Discover"
          component={DiscoverStack}
          options={{
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🔍</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Shortlist"
          component={ShortlistScreen}
          options={{
            tabBarLabel: 'Shortlist',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>⭐</Text>
            ),
            tabBarBadge: shortlist.length > 0 ? shortlist.length : undefined,
            headerShown: true,
            title: 'My Shortlist',
            ...HEADER_STYLE,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
