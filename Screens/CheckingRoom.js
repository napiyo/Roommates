import { validate } from 'compare-versions'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Button, HelperText, IconButton, TextInput, TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import {db} from '../firebaseConfiguration'
import firebase from 'firebase'
import { useDispatch } from 'react-redux'
import * as actions from '../Redux/actions'
import { StackActions } from '@react-navigation/routers'


export default function CheckingRoom({navigation}) {
    
    const userData = useSelector(state => state)
    const [mode, setmode] = useState(null)
    const [icon, seticon] = useState("location-enter")
    const [code, setcode] = useState("")
    const [enterLoading, setenterLoading] = useState(false)
    const [RoomIdisValid, setRoomIdisValid] = useState(false)
    const [helperText, sethelperText] = useState({visible:false,message:"This Room Id is already taken",color:'red'})
    const dispatch = useDispatch()
      
    // check room id exist or not 

        useEffect(() => {
            if(mode != "Create"){
                sethelperText({...helperText,visible:false})
                return
            }
            if(!code || code.trim()===""){
                sethelperText({visible:false,message:"Please Enter a Room ID",color:'red'})
                setRoomIdisValid(false)
                return
            }
            sethelperText({visible:true,color:'orange',message:"checking..."})
            db.collection("Rooms").doc(code.trim().toLowerCase()).get().then((data)=>{
                    if(data.exists){
                        sethelperText({visible:true,message:"This Room Id is already taken",color:'red'})
                        setRoomIdisValid(false)
                    }
                    else{
                        sethelperText({visible:true,message:"This Room Id available",color:'green'})
                        setRoomIdisValid(true)
    
                    }
            }).catch((e)=>{
                Alert.alert("server Failed",e.message)
            })
            

        }, [code,mode])



// Join Room 
    function joinRoom(){
        const dbRef = db.collection("Rooms").doc(code.toLowerCase().trim());
        dbRef.update({
            members: firebase.firestore.FieldValue.arrayUnion(userData.uid)
            
        }).then((data)=>{
            //update succesfully
            dispatch(actions.userLoggedIn(userData.Name,userData.Email,userData.uid,userData.DPurl,code.toLowerCase().trim()))
            // Join room and updated userData

            // update to fireabse
            db.collection("userPersonalData").doc(userData.uid).update({
                roomId:code
            }).then(()=>{
                navigation.dispatch(StackActions.replace("Home"))
                setenterLoading(false)
            }).catch((e)=>{
                console.log(e);
                setenterLoading(false)
            })
          

        }).catch((e)=>{
            // could not update    
            setenterLoading(false)    
                    sethelperText({visible:true,message:"No Room Found or network issue try again    "+e.message,color:"red"})
        })
    }

// Create room and join 
    function createRoom(){
        db.collection("Rooms").doc(code.toLowerCase().trim()).set({
            members:[userData.uid],
            task:[]
        }).then(()=>{
            //created group succesfully
            //update locally to redux
            dispatch(actions.userLoggedIn(userData.Name,userData.Email,userData.uid,userData.DPurl,code.toLowerCase().trim()))
            
            // update to firebase
            db.collection("userPersonalData").doc(userData.uid).update({
                roomId:code
            }).then(()=>{
                navigation.dispatch(StackActions.replace("Home"))
                setenterLoading(false)
            }).catch((e)=>{
                console.log(e);
                setenterLoading(false)
            })
            
            
            
          
        }).catch((e)=>{
            // error
            setenterLoading(false)
            Alert.alert("Failed!!!",e.message)
        })
        
    }
    const Enter =  ()=>{
        Keyboard.dismiss()
        setenterLoading(true)
        if(mode=="Create" && RoomIdisValid==false){
            return
        }
        switch(mode){
            case "Join"  :
                joinRoom();
                
                break;
            case "Create":
               createRoom();
              setenterLoading(false)
                
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

{/* hero Section  */}

            <View style={{ width:'100%',position:'absolute',top:'10%'
            }}>
{/* Hero Image  */}

            <Image source={require('../assets/hero_checkroom.png')} 
            style={{height:250,width:'100%'
            }}
            resizeMode='cover'/>

{/* Room code  */}

            {(!!mode) && 
            <View>
           <View style={{flexDirection:'row',alignItems:'center'}}>
            {/* text input  */}
            <TextInput mode='outlined' label= {mode+" Room"}
             style={{flex:1,
             fontSize:18}} 
             returnKeyType='join'
             onChangeText={(text)=> setcode(text)}
             value={code}
            />
                <TouchableRipple style={{backgroundColor:'#6200EE',marginLeft:5,
            borderRadius:5,marginTop:5,
            }}>
            {(enterLoading==false)?<IconButton icon={icon} color='white' size={30} animated={true}
            disabled={code=="" || (mode=="Create" && !RoomIdisValid) }
            onPress={Enter}
            />:<ActivityIndicator size={55} color='white'/>}
            </TouchableRipple> 
                </View>
            <HelperText visible={helperText.visible && code.trim() != ""} style={{color:helperText.color}}>{helperText.message}</HelperText> 
            </View>
                
                
            }
            </View>


{/* join create btns  */}
            <Button mode='contained' style={{width:'100%',padding:5,marginBottom:5}}
            onPress={()=>{setmode("Create")
        seticon("home-edit")}}
            disabled={enterLoading}
            >Create a new Room</Button>
            <Button mode='contained' style={{width:'100%',padding:5,}} color='green'
            onPress={()=>
            {setmode("Join")
            seticon("home-import-outline")
            }}
            disabled={enterLoading}
            >Join Room</Button>
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