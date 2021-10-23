import React from 'react'
import { Alert, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'

export default function ProfileTab() {
    const dispatch = useDispatch()
    function logout(){
        auth.signOut().then(()=>{
            dispatch(actions.userLoggedOut())
            navigation.dispatch(StackActions.replace("AuthScreens"))
        }).catch((e)=>{
            Alert.alert("couldn't logout",e.message)
        })}
    return (
        <View style={{flex:1,justifyContent:'center'}}>
            <Text>Profile</Text>
            <Button mode='outlined' onPress={logout}>Logout</Button>
        </View>
    )
}
