import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, KeyboardAvoidingView,  ScrollView, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Button, IconButton, TextInput,List, Divider, FAB, Chip } from 'react-native-paper'
import WeeklyBtn from './components/WeeklyBtn'
import {db} from '../firebaseConfiguration'
import { useSelector } from 'react-redux'
import SerachedView from './components/serachedView'


export default function CreateTask() {
    const [frequencyType, setfrequencyType] = useState(null)
    const [TaskName, setTaskName] = useState("")
    const [FixedfrequencyType, setFixedfrequencyType] = useState(null)
    const [daily, setdaily] = useState([])
    const [weekly, setweekly] = useState([])
    const [monthly, setmonthly] = useState([])
    const [members, setmembers] = useState([])
    const [useKeyboardAvoid, setuseKeyboardAvoid] = useState(false)
    const [Distributiontype, setDistributiontype] = useState(null)
    const [searchFriendValue, setsearchFriendValue] = useState(null)
    const [searchFriendResult, setsearchFriendResult] = useState([])
   const userData = useSelector(state => state)
   const [isIndividualTask, setisIndividualTask] = useState(false);
   const [selectedFriends, setselectedFriends] = useState([]);
   const [counttochangetaskafter, setcounttochangetaskafter] = useState(1);
   const toggleSwitchisIndividualTask = () => setisIndividualTask(previousState => !previousState);

//Drop Down for distribution
const [openDropDownDistribution, setopenDropDownDistribution] = useState(false);
  const [valueDropDownDistribution, setvalueDropDownDistribution] = useState(null);
  const [itemsDropDownDistribution, setItemsDropDownDistribution] = useState([
    {label: 'Fixed', value: 'fixed'},
    {label: 'Alternates', value: 'alternate'},
    {label: 'Fixed + Alternates', value: 'fixedAlternate'},
  ]);


  // get all members of room

   useEffect(()=>{
        db.collection("Rooms").doc(userData.roomId.toLowerCase()).onSnapshot((snapshot)=>{
            if(!snapshot.exists){console.log("Room Id is invalid");}
            else{
                let uids= snapshot.data().members
                let dataOfuid=[];
                uids.map((uid)=>{
                    db.collection("userPersonalData").doc(uid).get().then((data)=>{
                        let friend = {...data.data(), key:uid }
                        dataOfuid.push(friend)
                    })
                })
                setmembers(dataOfuid)

            }

        })
    },[])

    // reset timing
    useEffect(() => {
            if(FixedfrequencyType=="daily"){
                if(weekly.length != 0) {setweekly([])}
                if(monthly.length != 0) {setmonthly([])}
            }
            else if(FixedfrequencyType=="weekly"){
                if(daily.length != 0) {setdaily([])}
                if(monthly.length != 0) {setmonthly([])}
            }
            else if(FixedfrequencyType=="monthly"){
                if(daily.length != 0) {setweekly([])}
                if(weekly.length != 0) {setmonthly([])}
            }
        
    }, [FixedfrequencyType])
    // generate array with 1 to 31 number 
    // from method is from ES6
    let alldates= Array.from({length: 31}, (_, i) => i + 1);
 
 
    // show firend searched result
    useEffect(()=>{
        if(searchFriendValue==null || !searchFriendValue.trim()){
            setsearchFriendResult([])
            return
        }
        let searchedresults = members.filter(member=> member.Name.toLowerCase().includes(searchFriendValue.toLowerCase().trim()))
        setsearchFriendResult(searchedresults)
    },[searchFriendValue]) 
    
// friend selection 
const friendSelection =(friend)=>{
    if(isIndividualTask){
        // this is an individual Task
        switch(Distributiontype){
            case "fixed":
                setselectedFriends([friend])
                break;
            case "rotation":
            case "fixedandRotation":
                if(selectedFriends.includes(friend)){
                    setselectedFriends(selectedFriends.filter((f)=> {f.key != friend.key}))
                    break
                }
                else{
                    setselectedFriends([...selectedFriends,friend])
                }
                break;
            default:
                return

        }

    }
    else{
        // this is a group Task .. 
        switch(Distributiontype){

        }

    }


    // if(selectedFriends.includes(friend)){
    //     setselectedFriends(selectedFriends.filter((f)=>f != friend ))
    //     return
    // }
    // setselectedFriends([...selectedFriends,friend])


}


    return (
        <KeyboardAvoidingView
        behavior='position' style={{flex:1}}
        enabled={useKeyboardAvoid}
        keyboardVerticalOffset={90}
        >
        <ScrollView endFillColor="red">
        <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss}>

        <View style={style.MainContainer}>
            <TextInput label="Task Name" mode="outlined"
            value={TaskName}
            onChangeText={text=>setTaskName(text)}
            />
            <View style={{backgroundColor:'#f5dd4b',marginHorizontal:-10,paddingHorizontal:10,marginVertical:5}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center',margin:10}}>
                <Text style={{fontSize:17}}>Choose frequency</Text>
                {/* <IconButton icon="help-circle" color="#6200EE" /> */}
               <View style={{backgroundColor:"#6200EE",borderRadius:5}}><Text style={{color:'white',fontWeight:'bold',padding:(!!FixedfrequencyType)?5:0,}}>
                    {FixedfrequencyType}</Text></View>
                </View>
                </View>
            <View style={style.frequency}>
                <Button mode={(frequencyType==="fixed")?"contained":"outlined"} 
                style={{marginRight:10,width:150}}
                onPress={()=>setfrequencyType("fixed")}
                >Fixed </Button>
                <Button mode={(frequencyType==="alternate")?"contained":"outlined"}
                  onPress={()=>{setfrequencyType("alternate")
                setFixedfrequencyType(null)}}
                  style={{width:150}}
                >Alternates</Button>
            </View>

         { (frequencyType==="fixed") &&<>
         <Divider style={{marginVertical:5}} />
         <View style={{flexDirection:'row',justifyContent:'center'}}>
             <Button
             mode="text"
             color={(FixedfrequencyType=="daily")?'#6200EE':'grey'}
             onPress={()=> setFixedfrequencyType("daily")}
             >Daily</Button>
             <Button
              mode="text"
              color={(FixedfrequencyType=="weekly")?'#6200EE':'grey'}
              onPress={()=> setFixedfrequencyType("weekly")}
             >Weekly</Button>
             <Button
              mode="text"
              onPress={()=> setFixedfrequencyType("monthly")}
              color={(FixedfrequencyType=="monthly")?'#6200EE':'grey'}
             >Monthly</Button>
             </View>
             <Divider style={{marginVertical:5}} />
             </>

         
    }
        

{/* frequency for daily  */}
                    
              { FixedfrequencyType==="daily" && <List.Accordion title="Choose time" id="1" >
                     <View style={{flexDirection:'row',justifyContent:'space-evenly',alignContent:"center"}}>
                      <View>
                          <IconButton icon="weather-sunset-up" style={{borderWidth:2,borderColor:"#6200EE",
                           backgroundColor:(daily.includes("morning"))?"#6200EE":"white"}}
                           color={(daily.includes("morning"))?"white":"#6200EE"}
                          onPress={()=>
                        {   
                            if(daily.includes("morning")){
                                   setdaily(daily.filter(item=> item != "morning"))
                            }
                            else{
                                setdaily([...daily,"morning"])
                                
                            }
                        }
                        }
                          ></IconButton>
                
                      <Text>Morning</Text>
                      </View>
                      <View>
                          <IconButton icon="weather-sunny" style={{borderWidth:2,borderColor:"#6200EE",
                           backgroundColor:(daily.includes("afternoon"))?"#6200EE":"white"}}
                           color={(daily.includes("afternoon"))?"white":"#6200EE"}
                          onPress={()=>
                        {   
                            if(daily.includes("afternoon")){
                                   setdaily(daily.filter(item=> item != "afternoon"))
                            }
                            else{
                                setdaily([...daily,"afternoon"])
                                
                            }
                        }
                        }
                          ></IconButton>
                
                      <Text>Afternoon</Text>
                      </View>
                      <View>
                          <IconButton icon="weather-sunset-down" style={{borderWidth:2,borderColor:"#6200EE",
                           backgroundColor:(daily.includes("evening"))?"#6200EE":"white"}}
                           color={(daily.includes("evening"))?"white":"#6200EE"}
                          onPress={()=>
                        {   
                            if(daily.includes("evening")){
                                   setdaily(daily.filter(item=> item != "evening"))
                            }
                            else{
                                setdaily([...daily,"evening"])
                                
                            }
                        }
                        }
                          ></IconButton>
                
                      <Text>Evening</Text>
                      </View>
                        
                     </View>
                </List.Accordion>}
                
                
{/* frequency for weekly  */}

    { FixedfrequencyType=="weekly" &&
                <List.Accordion title="Choose day(s)" id="2">
                     <View style={{flexDirection:'row',paddingHorizontal:15}}>
                         <WeeklyBtn day="sunday" weekly={weekly} setweekly = {setweekly} title="Sun" />
                         <WeeklyBtn day="monday" weekly={weekly} setweekly = {setweekly} title="M" />
                         <WeeklyBtn day="tuesday" weekly={weekly} setweekly = {setweekly} title="T" />
                         <WeeklyBtn day="wednesday" weekly={weekly} setweekly = {setweekly} title="W" />
                         <WeeklyBtn day="thrusday" weekly={weekly} setweekly = {setweekly} title="T" />
                         <WeeklyBtn day="firday" weekly={weekly} setweekly = {setweekly} title="F" />
                         <WeeklyBtn day="saturday" weekly={weekly} setweekly = {setweekly} title="S" />
                     </View>
                </List.Accordion>
        }
{/* frequency for monthly  */}

               { FixedfrequencyType==="monthly" && 
               <List.Accordion title="Choose date(s)" id="3">
                    <View style={{alignItems:'center'}}>
                <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',width:314,
            }} >
            {
              alldates.map(date=>{

                  return <WeeklyBtn day={date.toString()} weekly={monthly} setweekly={setmonthly} title={date.toString()} key={date} />
              })
            }
</View>
          </View>       
                     
                </List.Accordion>
        }

        
            <Divider style={{marginTop:5}}/>



{/* distribute the task  */}

<View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center',margin:10}}>
                <Text style={{fontSize:17,marginTop:5,color:(isIndividualTask)?"grey":"#6200EE"}} >Group Task</Text>
               
             <Switch
        trackColor={{ false: "#767577", true: "#6200EE" }}
        thumbColor={isIndividualTask ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitchisIndividualTask}
        value={isIndividualTask}
      />
        <Text style={{fontSize:17,marginTop:5,color:(isIndividualTask)?"#6200EE":"grey"}}>Individual Task</Text>
                </View>
                <Divider style={{marginVertical:5}} />
<View style={{backgroundColor:'#f5dd4b',marginHorizontal:-10,paddingHorizontal:10, paddingVertical:5}}>
    <Text style={{fontSize:20,margin:5}}>Distribute Tasks</Text>
      </View>
         <View style={{flexDirection:'row',justifyContent:'center'}}>

             <Button
             mode="text"
             color={(Distributiontype=="fixed")?'#6200EE':'grey'}
             onPress={()=> {
                if(Distributiontype !="fixed"){
                    setselectedFriends([])
                } 
                setDistributiontype("fixed")
                    
            }}
             >Fixed</Button>

             <Button
              mode="text"
              color={(Distributiontype=="rotation")?'#6200EE':'grey'}
              onPress={()=>{ 
                if(Distributiontype != "rotation"){
                    setselectedFriends([])
                }  
                setDistributiontype("rotation")}}
             >Rotation</Button>
             <Button
              mode="text"
              color={(Distributiontype=="fixedandRotation")?'#6200EE':'grey'}
              onPress={()=> {
                if(Distributiontype != "fixedandRotation"){
                    setselectedFriends([])
                }    
                setDistributiontype("fixedandRotation")}}
             >Fixed for a time</Button>
             </View>
             <Divider style={{marginVertical:5}} />
             
{/* if fixed for a time for individual show count after which turn will change */}
{
     (Distributiontype=="fixedandRotation") &&
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
        <Text>Change Turn After Every</Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <IconButton icon="plus" color='white' style={{backgroundColor:"#6200EE",marginRight:15}} size={20} 
        onPress={()=>{setcounttochangetaskafter(counttochangetaskafter+1)}} />
        <Text style={{fontSize:27}}>{counttochangetaskafter}</Text>
        <IconButton icon="minus" color='white' style={{backgroundColor:"#6200EE",marginLeft:15}} size={20}
        onPress={()=>{
            if(counttochangetaskafter<2){
                return
            }
            setcounttochangetaskafter(counttochangetaskafter-1)}}/>
        <Text>Task</Text>
        </View>
    </View>
}


{/* show friend list */}

{/* showing selected friends as chips  */}
{ (selectedFriends.length !=0) && isIndividualTask && 
   <View  style={{flexDirection:'row',flexWrap:'wrap'}}>
           { selectedFriends.map((friend)=>{
                return(  
                    <Chip mode='outlined' key={friend.key}
                     onClose={()=>{
                         setselectedFriends(selectedFriends.filter((f)=> f.key != friend.key))
                     }}
                     style={{margin:5}}
                     
                     >
                        {friend.Name.substring(0,10)}</Chip>
                )
            })}
            </View>

}
{!!Distributiontype && <TextInput
label="Search Roommate"
mode='outlined'
onFocus={()=>setuseKeyboardAvoid(true)}
onBlur={()=>setuseKeyboardAvoid(false)}
value={searchFriendValue}
onChangeText={(text)=>setsearchFriendValue(text)}
style={{marginBottom:10}}
right= {<TextInput.Icon name={(!!searchFriendValue)?"close-circle-outline":""}
onPress={()=>{setsearchFriendValue(null)}} 
forceTextInputFocus={false}/>}
/>}

    { !!searchFriendValue &&
    
        ((searchFriendResult.length !=0 )?
        searchFriendResult.map((friend)=>{ 
            return(
            <TouchableOpacity key={friend.key} onPress={()=>friendSelection(friend)}>
            <SerachedView userInfo={friend}  selected={selectedFriends.includes(friend)}/>
            </TouchableOpacity>
            )
        }):<Text  style={{textAlign:'center'}}>it seems you dont have a roommate named {searchFriendValue}</Text>)

    }

{
    // code for group task
    // show btn make another task
}      


        </View>
        </TouchableWithoutFeedback>
        </ScrollView>
        </KeyboardAvoidingView>
     
    )
}
const style = StyleSheet.create({
    MainContainer:{
        flex:1,
        padding:10,
    },
    frequency:{
        flexDirection:'row',
        paddingHorizontal:16,
        justifyContent:'center',
    },
  
})