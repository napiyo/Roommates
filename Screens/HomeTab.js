import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { useSelector } from 'react-redux'
import {db} from '../firebaseConfiguration'

export default function HomeTab() {
    const userData = useSelector(state => state)
    const [RoomDetails, setRoomDetails] = useState(null)
    const [AllTasks, setAllTasks] = useState(null)
    const [showLoader, setshowLoader] = useState(true)
    // const [TaskDetails, setRoomDetails] = useState(null)

    // fetch data from firebase

    useEffect(() => {
        //getting Room Data
        let roomid = userData.roomId.toLowerCase()
        db.collection("Rooms").doc(roomid).get().then((data)=>{
             if(data.exists){setRoomDetails(data.data())
                let alltaskdetailstemp=[];
                let taskNamearray = data.data().task;
                taskNamearray.map((taskName)=>{
                    //get task detail
                    db.collection("Tasks").doc(roomid+"_"+taskName).get().then((taskfirebasedata)=>{
                            if(taskfirebasedata.exists){
                               
                                alltaskdetailstemp.push(taskfirebasedata.data())
                                
                                // if this the last task then put all data in alltasks
                                if(alltaskdetailstemp.length===taskNamearray.length){
                                    setAllTasks(alltaskdetailstemp)
                                
                                    setshowLoader(false)
                                }
                            }
                            else{
                                console.log("not fouond");
                            }
                    }).catch((e)=>{
                        console.log(e.message);
                    })
                    
                })

              
            
            }
             
        }).catch((e)=>{
            console.log(e.message);
            setshowLoader(false)
        })
        
        
        
    }, [])


    return (
        <View style={style.MainContainer}>
             <StatusBar style="auto"/>
             <View style={{
                marginLeft:4,
             }}>
            <Text style={{fontSize:27,}}>
                Welcome {userData.Name}
            </Text>
            <Text>Your room Id is {userData.roomId.toLowerCase()}</Text>
             </View>
             <View>
                 {/* show loader while data fetching  */}
                 { (showLoader)?<ActivityIndicator style={{marginTop:30}}/>:<>
                {/* //  data fetched  */}
                <View style={{marginTop:10,flexDirection:'row',flexWrap:'wrap',marginHorizontal:10,
                        borderRadius:5,
                        borderWidth:2,
                    }}>
                        <ImageBackground source={{uri:'https://image.freepik.com/free-photo/blue-paperboard-texture_1409-1329.jpg'}}  resizeMode="cover" 
                        style={{flex:1}}>
                            <Text style={{color:'white',paddingVertical:5,paddingHorizontal:10,fontSize:21}}>All Tasks</Text>
                             <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:10,
                       
                    }}>

                        

                {
                    
                    AllTasks.map((task)=>{
                        return(
                            <Button key={task.Name} color='white'>{task.Name}</Button>
                            )
                        })
                    }
                    </View>
                    </ImageBackground>
                    </View>
                    
                 
                 
                 
                 
                 </>
                 }
             </View>
        </View>
    )
}
const style = StyleSheet.create({
    MainContainer:{
        flex:1,
        marginTop:30,
        padding:10,
    }
})