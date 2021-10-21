import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Button, IconButton, TextInput, TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
export default function CheckingRoom() {
    
    const userData = useSelector(state => state)
    const [mode, setmode] = useState(null)
    const [icon, seticon] = useState("location-enter")
    const [code, setcode] = useState("")
    const [enterLoading, setenterLoading] = useState(false)
    const Enter =  ()=>{
        setenterLoading(true)
        switch(mode){
            case "Join"  :
                console.log("joinn");
                setenterLoading(false)
                break;
            case "Create":
                console.log("Create");
              setenterLoading(false)
                console.log(enterLoading);
                break;
            default:
                setenterLoading(false)
                console.log("check mode, something wrong");
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={style.MainContainer}>
            <StatusBar style='auto' />
            <View style={{ width:'100%',position:'absolute',top:'10%'
            }}>
            <Image source={require('../assets/hero_checkroom.png')} 
            style={{height:250,width:'100%'
            }}
            resizeMode='cover'/>
            {(!!mode) && 
            <KeyboardAvoidingView>
           <View style={{flexDirection:'row',alignItems:'center'}}>
            <TextInput mode='outlined' label= {mode+" Room"}
             style={{flex:1,
            //  position:'absolute',top:'35%',
             fontSize:18}} 
             returnKeyType='done'
             value={code}
             onChangeText={(text)=>setcode(text)}
            />
                <TouchableRipple style={{backgroundColor:'#6200EE',marginLeft:5,
            borderRadius:5,marginTop:5,
            }}>
            {(enterLoading==false)?<IconButton icon={icon} color='white' size={30} animated={true}
            disabled={code===""}
            onPress={Enter}
            />:<ActivityIndicator size={55} color='white'/>}
            </TouchableRipple>
                </View>
                </KeyboardAvoidingView>
            }
            </View>
            <Button mode='contained' style={{width:'100%',padding:5,marginBottom:5}}
            onPress={()=>{setmode("Create")
        seticon("home-edit")}}
            >Create a new Room</Button>
            <Button mode='contained' style={{width:'100%',padding:5,}} color='green'
            onPress={()=>
            {setmode("Join")
            seticon("home-import-outline")
            }}>Join Room</Button>
        </View>
        </TouchableWithoutFeedback>
    )
}
const style = StyleSheet.create({
    MainContainer:{
        // paddingTop:40,
        flex:1,
        padding:10,
        paddingBottom:20,
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:'white',
        position:'relative',
    }
})