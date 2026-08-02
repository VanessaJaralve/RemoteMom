import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from './src/constants/colors';
import { GroceryScreen } from './src/screens/GroceryScreen';
import { HealthScreen } from './src/screens/HealthScreen';
import { KidScreen } from './src/screens/KidScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { TodosScreen } from './src/screens/TodosScreen';
import { AppStateProvider } from './src/state/AppState';

type RootTabParamList = {
  Today: undefined;
  Health: undefined;
  Kid: undefined;
  Grocery: undefined;
  'To-Dos': undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICON_LABELS: Record<keyof RootTabParamList, string> = {
  Today: 'T',
  Health: 'H',
  Kid: 'K',
  Grocery: 'G',
  'To-Dos': '✓',
  More: 'M'
};

const TAB_COLORS: Record<keyof RootTabParamList, string> = {
  Today: LIFE_AREA_COLORS.work,
  Health: LIFE_AREA_COLORS.health,
  Kid: LIFE_AREA_COLORS.kid,
  Grocery: LIFE_AREA_COLORS.household,
  'To-Dos': LIFE_AREA_COLORS.work,
  More: LIFE_AREA_COLORS.work
};

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Today"
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: SURFACE_COLORS.card
            },
            headerTitleStyle: {
              color: SURFACE_COLORS.text,
              fontWeight: '700'
            },
            tabBarActiveTintColor: TAB_COLORS[route.name],
            tabBarInactiveTintColor: SURFACE_COLORS.muted,
            tabBarStyle: {
              backgroundColor: SURFACE_COLORS.card,
              borderTopColor: SURFACE_COLORS.border
            },
            tabBarIcon: ({ color }) => (
              <Text
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{ color, fontSize: 16, fontWeight: '700' }}
              >
                {TAB_ICON_LABELS[route.name]}
              </Text>
            )
          })}
        >
          <Tab.Screen component={TodayScreen} name="Today" />
          <Tab.Screen component={HealthScreen} name="Health" />
          <Tab.Screen component={KidScreen} name="Kid" />
          <Tab.Screen component={GroceryScreen} name="Grocery" />
          <Tab.Screen component={TodosScreen} name="To-Dos" />
          <Tab.Screen component={MoreScreen} name="More" />
        </Tab.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
}
