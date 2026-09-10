// Stack + bottom tabs mirroring apps/web/src/App.tsx's route shape:
// Onboarding -> (tab shell: Home / Search / [Review] / You), with
// Detail/Edit/AddMosque pushed on top of the tab shell.
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
import EditScreen from '../screens/EditScreen';
import AddMosqueScreen from '../screens/AddMosqueScreen';
import ModeratorQueueScreen from '../screens/ModeratorQueueScreen';
import YouScreen from '../screens/YouScreen';
import TabBarDot from '../components/TabBarDot';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { editQueue } = useAppState();
  const { theme } = useAppState();
  const t = getTheme(theme);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.accent,
        tabBarInactiveTintColor: t.colors.neutral600,
        tabBarStyle: { backgroundColor: t.colors.bg, borderTopColor: t.colors.divider },
      }}
    >
      <Tab.Screen
        name="Near me"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <TabBarDot color={color} shape="rounded" /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color }) => <TabBarDot color={color} shape="circle" /> }}
      />
      {editQueue && (
        <Tab.Screen
          name="Review"
          component={ModeratorQueueScreen}
          options={{ tabBarIcon: ({ color }) => <TabBarDot color={color} shape="square" /> }}
        />
      )}
      <Tab.Screen
        name="You"
        component={YouScreen}
        options={{ tabBarIcon: ({ color }) => <TabBarDot color={color} shape="circle" /> }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { theme } = useAppState();
  const t = getTheme(theme);
  const navTheme = theme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: t.colors.bg, card: t.colors.bg, text: t.colors.text, border: t.colors.divider, primary: t.colors.accent } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: t.colors.bg, card: t.colors.bg, text: t.colors.text, border: t.colors.divider, primary: t.colors.accent } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="AddMosque" component={AddMosqueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
