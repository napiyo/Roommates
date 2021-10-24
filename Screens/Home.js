import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackActions } from '@react-navigation/routers'
import React from 'react'
import { Alert, StatusBar, Text, View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import auth from '../firebaseConfiguration'
import * as actions from "../Redux/actions"
import CreateTask from './CreateTask'
import HomeTab from './HomeTab'
import ProfileTab from './ProfileTab'


export default function Home({navigation}) {

  
    const TabNavigation = createBottomTabNavigator()
    return (
       <TabNavigation.Navigator initialRouteName="HomeTab">
           <TabNavigation.Screen name="HomeTab" component={HomeTab} options={{tabBarIcon:({color})=><IconButton icon="home" size={25} color={color}/>,
        headerShown:false, }}/>
           <TabNavigation.Screen name="CreateTask" component={CreateTask} options={{tabBarIcon:({color})=><IconButton icon="sticker-plus-outline" size={25} color={color}/> }}/>
           <TabNavigation.Screen name="ProfileTab" component={ProfileTab} options={{tabBarIcon:({color})=><IconButton icon="account-circle" size={25} color={color}/> }}/>

       </TabNavigation.Navigator>    )
}
