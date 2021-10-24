import React, { isValidElement, useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, KeyboardAvoidingView,  ScrollView, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Button, IconButton, TextInput,List, Divider, FAB, Chip, HelperText } from 'react-native-paper'
import WeeklyBtn from './components/WeeklyBtn'
import {db} from '../firebaseConfiguration'
import { useSelector } from 'react-redux'
import SerachedView from './components/serachedView'
import firebase from 'firebase'


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
   // All task present
const [allTaskinfirebase, setallTaskinfirebase] = useState([])
// for group task to form a single group except fixed type
   const [SingleGroup, setSingleGroup] = useState([])
   // colors generetaed by random color function for chips
   const [chipscolor, setchipscolor] = useState([])


  const toggleSwitchisIndividualTask = () => {
    // Alert.alert("change Task Type ?","you current made group will be errased ",
    // [{text:"Okay",onPress:()=>{
    //        setisIndividualTask(previousState => !previousState);
    //        setselectedFriends([])
    // }},{text:"cancel",style:'cancel'}])  
    
           setisIndividualTask(previousState => !previousState);
           setselectedFriends([])
    }

  // get all members of room

   useEffect(()=>{
        db.collection("Rooms").doc(userData.roomId.toLowerCase()).onSnapshot((snapshot)=>{
            if(!snapshot.exists){console.log("Room Id is invalid");}
            else{
                let uids= snapshot.data().members
                setallTaskinfirebase(snapshot.data().task)
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
        }
        else{
            if(searchFriendValue.toLowerCase().localeCompare("all")==0){
                setsearchFriendResult(members)
            }   
            else{
                    let searchedresults = members.filter(member=> member.Name.toLowerCase().includes(searchFriendValue.toLowerCase().trim()))
                     setsearchFriendResult(searchedresults)
                    }
            }
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
                if(SingleGroup.includes(friend)){
                    setselectedFriends(selectedFriends.filter((f)=>f.key != friend.key))

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
            case "fixed":
                if(selectedFriends.includes(friend)){
                    setselectedFriends(selectedFriends.filter((f)=>f.key != friend.key))
                    break
                }
                else{
                    setselectedFriends([...selectedFriends,friend])
                    break;
                }
                case "rotation":
                case "fixedandRotation":
                    if(SingleGroup.includes(friend)){
                        setSingleGroup(SingleGroup.filter((f)=>f.key != friend.key))
                        break
                    }
                    else{
                        setSingleGroup([...SingleGroup,friend])
                        break;
                    }
                default:
                    return

        }

    }

}
function createNewGroup(){
    if(SingleGroup.length ==0 ){
        return
    }
    // if(selectedFriends.length ===0)
    let newcolor = getRandomColor();
    setchipscolor([...chipscolor,newcolor])

    setselectedFriends([...selectedFriends,SingleGroup])
    setSingleGroup([])
}
// clicked on done add single group to selected group
function addSingleGroupToselectedGroup(){
    if(SingleGroup.length ===0 ){
        return
    }
    else{
        let newcolor = getRandomColor();
        setchipscolor([...chipscolor,newcolor])
        setselectedFriends([...selectedFriends,SingleGroup])
        setSingleGroup([])
        setsearchFriendValue(null)
    }
}
// generate random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#80';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    if(chipscolor.includes(color)){
       color = getRandomColor()
    }
    return color;
  }

// checking for task Name not valid if already exist
const [isvalidTaskName, setisvalidTaskName] = useState(false)
const [helperTextTaskName, sethelperTextTaskName] = useState({visible:false,message:"checking...",color:"orange"})

useEffect(()=>{
    if(!TaskName || !TaskName.trim()){
        sethelperTextTaskName({visible:false,message:"",color:'black'})
    }
    else{
    sethelperTextTaskName({visible:true,message:"checking ...",color:"orange"})
    setisvalidTaskName(true)
    let available =true;
    // if(allTaskinfirebase)
    // db.collection("Rooms").doc(userData.roomId.trim().toLowerCase()).get().then((data)=>{
    //     let allTask = data.data().task
    //     setallTaskinfirebase

        
        allTaskinfirebase.map((task)=>{
            if (task.toLowerCase().trim().localeCompare(TaskName.toLowerCase().trim())==0){
                available=false
                
            }
        })
        if(available){
            sethelperTextTaskName({visible:true,message:"Task Name is Available",color:'green'})
            setisvalidTaskName(true)
        }
        else{
            sethelperTextTaskName({visible:true,message:"Task Name already exists",color:'red'})
            setisvalidTaskName(false)
            
        }
 
   
    // }).catch((e)=>{
    //     console.log(e.message);
    //     setisvalidTaskName(false)
    // })
}
},[TaskName])


const [submitbtnloading, setsubmitbtnloading] = useState(false)

  // create task // final
  function SubmitTask(){
      setsubmitbtnloading(true);
      if(SingleGroup.length !=0){
          Alert.alert("unsaved group","you have not submited last group please click on done under search roommate",
          [{text:"Clear Last Group",onPress:()=>{
              // clear singleGroup
              setSingleGroup([])
          }},
          {text:"cancel",style:"cancel"}
        ])
        setsubmitbtnloading(false)
        return
      }
    //   submit task to firebase
    //   apply validation 

        if(!TaskName || selectedFriends.length==0 || !frequencyType || 
            (frequencyType=="fixed" && (daily.length ==0 && weekly.length==0 && monthly.length==0 ))
            || !Distributiontype 
            )
            { setsubmitbtnloading(false)
                Alert.alert("you missed something","all fields are required")
                return;
            }




    if(isvalidTaskName){

        let TaskData={
            Name:TaskName,
            // selectedFriends,
            frequencyType,
            FixedfrequencyType,
            daily,
            weekly,
            monthly,
            Distributiontype,
            isIndividualTask,
            counttochangetaskafter
        };
// if task is group and distribution is not fixed i.e multiple groups store them seperately and store 
// group name in selectedfriends fields 

        if(!isIndividualTask && Distributiontype != "fixed"){
                    let tempobj={};
                    let grps =[];
                    for(let i=0;i<selectedFriends.length;i++){
                        let k = i+1;
                        let groupName = "group"+k.toString();
                        grps.push(groupName);
                        tempobj={...tempobj,[groupName]:selectedFriends[i]
                        }
                    }
                    TaskData={...TaskData,...tempobj,selectedFriends:grps}
        }
        else{
            TaskData={...TaskData, selectedFriends:selectedFriends}
        }

        db.collection("Tasks").doc(userData.roomId.toLowerCase().trim()+"_"+TaskName.toLowerCase().trim()).set(
              TaskData
        ).then(()=>{
            db.collection("Rooms").doc(userData.roomId.toLowerCase().trim()).update({
                task: firebase.firestore.FieldValue.arrayUnion(TaskName.toLowerCase().trim())     
            }).then(()=>{

              
                // clear all fields
                setTaskName(null);
                setselectedFriends([]);
                setfrequencyType(null);
                setFixedfrequencyType(null);
                setdaily([]);
                setweekly([]);
                setmonthly([]);
                setDistributiontype(null);
                setisIndividualTask(false);
                setcounttochangetaskafter(1);
                setsearchFriendResult([]);
                setsearchFriendValue(null)

                setsubmitbtnloading(false)
                Alert.alert("Task Added","your task has been successfully added to your room");
                
            })  
            
        }).catch((e)=>{
            Alert.alert("Failed",e.message)
            setsubmitbtnloading(false)
          })
        
          }
  }

    return (
        <KeyboardAvoidingView
        behavior='position' style={{flex:1}}
        enabled={useKeyboardAvoid}
        keyboardVerticalOffset={20}
        >
        <ScrollView endFillColor="red">
        <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss}>

        <View style={style.MainContainer}>
            <TextInput label="Task Name" mode="outlined"
            value={TaskName}
            onChangeText={text=>setTaskName(text)}
            error={ !!TaskName && !isvalidTaskName}
            />
{/* helper text for task Name  */}
            <HelperText visible={helperTextTaskName.visible} style={{color:helperTextTaskName.color}}>{helperTextTaskName.message}</HelperText>

{/* choose frequency section  */}
<View style={{
    borderWidth:2,
    borderRadius:5,
    borderColor:'#41CBC7',
    backgroundColor:'#f5f5f5',
    shadowColor: '#41CBC7',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 5,  
    elevation: 5
}}>
            <View style={{backgroundColor:'#6200EE',
            // marginHorizontal:-10,
            // paddingHorizontal:10,
            marginBottom:10,
            borderTopEndRadius:5,
            borderTopStartRadius:5,
            }}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center',margin:10}}>
                <Text style={{fontSize:17,color:'white'}}>Choose frequency</Text>
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


</View>
{/* distribute the task  */}

<View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center',marginBottom:10,marginTop:25,
                                                borderWidth:1,
                                                borderColor:'#41CBC7',paddingHorizontal:10,paddingVertical:15,
                                                backgroundColor:'#41CBC7',
                                                borderRadius:5,
                                                shadowColor: '#41CBC7',
                                                shadowOffset: { width: 2, height: 3 },
                                                shadowOpacity: 0.8,
                                                shadowRadius: 5,  
                                                elevation: 5
                                                }}>
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
                
{/* distribution section  */}
                <View style={{
                    borderWidth:2,borderRadius:5,marginTop:6,borderColor:'#41CBC7', 
                    // shadowColor: '#41CBC7',
                    // shadowOffset: { width: 5, height: 6 },
                    // shadowOpacity: 0.8,
                    // shadowRadius: 5,  
                    // elevation: 5,
                }}>
<View style={{backgroundColor:'#6200EE',paddingVertical:3,borderTopLeftRadius:4,borderTopRightRadius:4,
}}>
    <Text style={{fontSize:18,margin:5,color:'white'}}>Distribute Tasks</Text>
      </View>
         <View style={{flexDirection:'row',justifyContent:'center'}}>
             <Button
             mode="text"
             color={(Distributiontype=="fixed")?'#6200EE':'grey'}
             onPress={()=> {
                if(Distributiontype !="fixed"){
                    setselectedFriends([])
                    setSingleGroup([])
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
                    setSingleGroup([])
                }  
                setDistributiontype("rotation")}}
             >Rotation</Button>
             <Button
              mode="text"
              color={(Distributiontype=="fixedandRotation")?'#6200EE':'grey'}
              onPress={()=> {
                if(Distributiontype != "fixedandRotation"){
                    setselectedFriends([])
                    setSingleGroup([])
                }    
                setDistributiontype("fixedandRotation")}}
             >Fixed for a time</Button>
             </View>
             <Divider style={{marginVertical:5}} />
             </View>
             
{/* if fixed for a time for individual show count after which turn will change */}
{
     (Distributiontype=="fixedandRotation") &&
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
        
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <IconButton icon="plus" color='white' style={{backgroundColor:"#6200EE",marginRight:15}} size={20} 
        onPress={()=>{setcounttochangetaskafter(counttochangetaskafter+1)}} />
        <Text>Change Turn After Every</Text>
        <Text style={{fontSize:27,marginHorizontal:6}}>{counttochangetaskafter}</Text><Text>Task</Text>
        <IconButton icon="minus" color='white' style={{backgroundColor:"#6200EE",marginLeft:15}} size={20}
        onPress={()=>{
            if(counttochangetaskafter<2){
                return
            }
            setcounttochangetaskafter(counttochangetaskafter-1)}}/>
        
        </View>
    </View>
}

<Divider />
{/* show friend list */}

{/* showing selected friends as chips  */}

{/* for individual task  */}
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
{/* for  fixed group task  */}

{
(!isIndividualTask  && selectedFriends.length !=0)  && (Distributiontype=="fixed") &&
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
{/* for group task except fixed  */}

{
    (selectedFriends.length  !=0  && !isIndividualTask && Distributiontype != "fixed") &&
    // show finilized group 
    selectedFriends.map((group)=>{
        const key = selectedFriends.indexOf(group)+1
        return <View key={key} style={{flexDirection:'row',flexWrap:'wrap'}}>
              <Chip mode='flat'
             style={{margin:5}}
             onClose={()=>{
                 setselectedFriends(selectedFriends.splice(key-1,1))
             }}
             
             >Group {key}</Chip>
            {
            group.map((friend)=>{
                    return <Chip mode='outlined' key={friend.key}
                    // onClose={()=>{
                    //         setselectedFriends(set)
                    // }}
                    style={{margin:5,backgroundColor:chipscolor[key-1]}}
                    
                    >
                       {friend.Name.substring(0,10)}</Chip>

                
            })}
            </View>
    })
}

  { 
   // show current group making
   (SingleGroup.length  !=0  && !isIndividualTask && Distributiontype != "fixed") &&

   <View  style={{flexDirection:'row',flexWrap:'wrap'}}>
   { SingleGroup.map((friend)=>{
        return(  
            <Chip mode='outlined' key={friend.key}
            //  onClose={()=>{
            //      setselectedFriends(selectedFriends.filter((f)=> f.key != friend.key))
            //  }}
             style={{margin:5}}
             
             >
                {friend.Name.substring(0,10)}</Chip>
        )
    })}
    </View>
   
}







{/* search text inpput  */}

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


{/* create new group btn  */}
{
    (!isIndividualTask) && (Distributiontype != "fixed") && (SingleGroup.length !=0 || selectedFriends.length !=0) &&
    <View style={{marginTop:-8,flexDirection:'row',justifyContent:'flex-end'}}>
            <Button mode="text" onPress={createNewGroup}>new Group</Button>
            {
                (SingleGroup.length !=0) &&
            <Button mode="text" onPress={addSingleGroupToselectedGroup}>Done</Button>
            }
        </View>
}

{/* showing friend results  */}

    { !!searchFriendValue &&
    
        ((searchFriendResult.length !=0 )?
        searchFriendResult.map((friend)=>{ 
            return(
            <TouchableOpacity key={friend.key} onPress={()=>friendSelection(friend)}>
            <SerachedView userInfo={friend} 
             selected={(isIndividualTask)?(selectedFriends.includes(friend)):
             ((Distributiontype == "fixed")?(selectedFriends.includes(friend)):
             (SingleGroup.includes(friend))

             )
             }/>
            </TouchableOpacity>
            )
        }):<Text  style={{textAlign:'center'}}>it seems you dont have a roommate named {searchFriendValue}</Text>)

    }

   {/* // submit button  */}


    <Button mode='contained'
    style={{marginBottom:200,marginTop:30,paddingVertical:7}}
    disabled={selectedFriends.length==0 || !isvalidTaskName}
    onPress={SubmitTask}
    loading={submitbtnloading}
    >Create Task</Button>




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