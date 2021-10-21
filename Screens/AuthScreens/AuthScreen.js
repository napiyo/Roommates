import { StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useRef, useState ,useEffect} from 'react'
import {  Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback ,View } from 'react-native'
import {  TextInput,Button,HelperText, Snackbar,ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import auth, { db } from '../../firebaseConfiguration';
import SignUpScreen from './SignUpScreen';
import * as actions from '../../Redux/actions'
import { StatusBar } from 'expo-status-bar'




export function LoginScreen({navigation}){

    const [AppLoaded, setAppLoaded] = useState(false)
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [showLoader, setshowLoader] = useState(false)
    const [SnackbarState, setSnackbarState] = useState({visible:false,message:"I'm snackBar"})
    const PasswordRef = useRef(null)
     const [EmailError, setEmailError] = useState({isError: false , ErrorMessage:""})
     const [PasswordError, setPasswordError] = useState({isError: false , ErrorMessage:""})
   const dispatch = useDispatch()
     
   
//    // geting information of user and return an object 
//    function getUserInformation(uid){
   

//    }
   
//    checking for already user is logged in or not ?

     useEffect(() => {
         // ISSUE
         // when user login it  listen too. and it redirect to home page too. so home page entry animation animates twice
         
        auth.onAuthStateChanged((user)=>{
            
            if(user){
                // user is already signed in
                //update redux store
                // get user data first 
                const uid = user.uid;
                // firebase userdata ref
                var docRef = db.collection("userPersonalData").doc(uid);
                    docRef.get().then((doc)=>{
        // successfully got user data
                  let userInfo=  doc.data()
                  
                  dispatch(actions.userLoggedIn(userInfo.Name,userInfo.Email,uid,userInfo.profileDp,userInfo.roomId))
                  if(userInfo.roomId==null){
                  
                      // navigate to checkRoom
                      navigation.dispatch(
                       StackActions.replace('CheckForRoom')
                     );
                  }
                  else{
                       // navigate to Home // already in a room
              
                       navigation.dispatch(
                        StackActions.replace('Home')
                      );
                  }
                //  navigation.navigate('HomeScreen');
                }).catch((e)=>{
                   // failed to get data
                   setSnackbarState({visible:true,message:"Couldn't get your data --"+e.message})
                //  Alert.alert("something  Went wrong", "restart your app, beacuse we could not get your data from server")
                 Alert.alert("something Went wrong ", e.message)
                
    })
    setshowLoader(false)
 
            }
            else{
                setAppLoaded(true)
            }
            
        })
     }, [])
   
   
   
   
     const Login=()=>{
        auth.signInWithEmailAndPassword(Email, Password).then((credential)=>{

///Already have onAuthchange function so when user login it will be code navigation will be handle by onAuthchange no need to write here too
// this was issue , this was causing home screen entry twice , onAuth and this Login both navigated

    //         const user= credential.user;
    //               //update redux store
    //             // get user data first 
    //             const uid = user.uid;
    //             // firebase userdata ref
    //             var docRef = db.collection("userPersonalData").doc(uid);
    //                 docRef.get().then((doc)=>{
    //     // successfully got user data
    //               let userInfo=  doc.data()
                      
    //               dispatch(actions.userLoggedIn(userInfo.Name,userInfo.Email,uid,userInfo.profileDp,userInfo.roomId))
    //               // navigate to home
    //               if(userInfo.roomId==null){
                      
    //                 // navigate to checkRoom
    //                 navigation.dispatch(
    //                  StackActions.replace('CheckForRoom')
    //                );
    //             }
    //             else{
    //                  // navigate to Home // already in a room
    //                  navigation.dispatch(
    //                   StackActions.replace('Home')
    //                 );
    //             }
    //             //  navigation.navigate('HomeScreen');
    //             }).catch((e)=>{
    //                // failed to get data
    //                setSnackbarState({visible:true,message:"Couldn't get your data --"+e.message})
    //              Alert.alert("something  Went wrong", "restart your app, beacuse we could not get your data from server")
    // })

    //         setshowLoader(false)
           
         
        }).catch((e)=>{
            setSnackbarState({visible:true,message:e.message})
            setshowLoader(false)
        })
          
    }
    const ValidationOfForm=()=>{
        if(!Email){
            setEmailError({isError:true,ErrorMessage:"Email is Required"})
          
            return
        }
        if(!!Email && !Email.includes('@')){
                 setEmailError({isError:true,ErrorMessage:"must include @"})
                 return
        }
        if(!Password){
            setPasswordError({isError:true,ErrorMessage:"Password is required"})
            return
        }
        if(!!Password && Password.length<6){
            setPasswordError({isError:true,ErrorMessage:"Password must be at least 6 character long"})
            return
        }
        Keyboard.dismiss()
        setshowLoader(true)
        Login()
       

    }
   
    if(AppLoaded == false){
        return <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            <StatusBar style="dark"/> 
                <ActivityIndicator animating={true} color='purple' />
                <Text style={{marginTop:10}}>Create by Narendra</Text>
        </View> }
   else{
    return (
        <View>
        <StatusBar style="dark"/> 
        
        
        
        <KeyboardAvoidingView 
         behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}
            >
                
       
            <View style={style.MainContainer}>
                <View>
            

{/* Email Input  */}

            <TextInput
                label="Email"
                value={Email}
                onChangeText={text => {
                    //update of email
                    setEmail((text))
                    //remove error
                    if(EmailError.isError){
                        setEmailError({isError:false,ErrorMessage:""})
                    }
               
                }}
                style={style.InputItems}
                returnKeyType="next"
                onSubmitEditing={() => {
                    PasswordRef.current.focus();
                 }} 
                 autoCompleteType='email'
                 error={EmailError.isError}
            
                />
                
                <HelperText type="error" visible={EmailError.isError}>
        {EmailError.ErrorMessage}
      </HelperText>

 {/* Password input  */}

                <TextInput 
                    placeholder ="Enter your password"
                    label="Password"
                    value={Password}
                    onChangeText={text => {
                        setPassword(text)
                        if(PasswordError.isError)
                        {setPasswordError({isError:false,ErrorMessage:""})}
                    }}
                    style={style.InputItems}
                    ref={PasswordRef}
                    autoCompleteType='password'
                    secureTextEntry= {true}
                />         
                <HelperText type="error" visible={PasswordError.isError}>
        {PasswordError.ErrorMessage}
      </HelperText>
                <Button  
                mode="contained"
                style={style.LoginButton}
                onPress={ValidationOfForm}
                >
                {/* show loader when trying to login after validating form */}
               {(showLoader)? <ActivityIndicator animating={true} color='white' />: "Log in"}
                </Button>
                </View>
                <View>
                    <TouchableWithoutFeedback onPress={()=> navigation.navigate("SignUpScreen")}>
                     <Text style={style.signupText}>Don't have an Account ? Sign Up here</Text>
                    </TouchableWithoutFeedback>
                    </View>
                  
        </View>
       
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* snackbar */}
        <Snackbar
        visible={SnackbarState.visible}
        onDismiss={()=>setSnackbarState({visible:false,message:""})}
        action={{
          label: 'Ok',
          onPress: () => {
            setSnackbarState({visible:false,message:"I'm changed"})
          },
        }}>
        {SnackbarState.message}
        
      </Snackbar>
     
        </View>
        
    )
   }

}







export default function AuthScreens() {
    const StackAuth = createNativeStackNavigator()
    return (
        
        
        <StackAuth.Navigator  initialRouteName="LoginScreen">
            <StackAuth.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}}/>
           
            <StackAuth.Screen name ="SignUpScreen" component={SignUpScreen} options={{title:"Welcome"}} />
          
            
        </StackAuth.Navigator>
       
        
    )
}
const style  = StyleSheet.create({
    MainContainer:{
        height:"100%",
        paddingTop:"20%",
        paddingHorizontal:20,
        justifyContent:'flex-start',
        alignContent:'center',
    },
    InputItems:{
        // marginBottom:10,
    },
    LoginButton:{
        marginBottom:10,
        padding:5,
    },
    signupText:{
        textAlign:'center',
        marginTop:20,
        fontWeight:'bold',
    }



})

