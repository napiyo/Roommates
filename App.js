import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store'
import { StyleSheet, Text, View } from 'react-native';
import AuthScreen from './Screens/AuthScreens/AuthScreen'
import CheckingRoom from './Screens/CheckingRoom';

export default function App() {
  const MainStackNavigation =createNativeStackNavigator()
  return (
    <Provider store={store}>
    <NavigationContainer>
      <MainStackNavigation.Navigator>
        <MainStackNavigation.Screen name="AuthScreens"  component={AuthScreen} options={{headerShown:false}}/>
        <MainStackNavigation.Screen name="CheckForRoom"  component={CheckingRoom} options={{headerShown:false}}/>
      </MainStackNavigation.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
