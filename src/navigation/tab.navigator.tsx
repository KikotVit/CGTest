import { AddRequestScreen } from '@/screens/add-request/AddRequest.screen';
import { RequestListScreen } from '@/screens/request-list/RequestList.screen';
import Icon from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import icons from '../../node_modules/@react-native-vector-icons/ionicons/glyphmaps/Ionicons.json';

export const RootTabs = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof icons = 'add-circle';

            if (route.name === 'AddRequestScreen') {
                iconName = 'add-circle';
            } else if (route.name === 'RequestListScreen') {
                iconName = 'list';
            } else if (route.name === 'RateExecutorScreen') {
                iconName = 'star';
            } 
            return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'cornflowerblue',
        tabBarInactiveTintColor: 'gray',
    }),
    screens: {
        AddRequestScreen: {
            screen: AddRequestScreen,
            options: {
                title: 'Add request',
            },
        },
        RequestListScreen : {
            screen: RequestListScreen,
            options: {
                title: 'Request list',
            },
        },
    },
});