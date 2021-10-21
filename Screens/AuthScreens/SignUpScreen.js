import React, { useRef, useState } from 'react'
import {  Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback ,View } from 'react-native'
import {  TextInput,Button,HelperText, Snackbar,ActivityIndicator ,Avatar} from 'react-native-paper';
import auth, { db, storage } from '../../firebaseConfiguration';
import { StackActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions'
import { StatusBar } from 'expo-status-bar';

export default function SignUpScreen({navigation}) {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [Name, setName] = useState('')
    const [ImageUrl, setImageUrl] = useState('')
    const [SignupBTnText, setSignupBTnText] = useState('Loading...')
    const [showLoader, setshowLoader] = useState(false)
    const [SnackbarState, setSnackbarState] = useState({visible:false,message:"I'm snackBar"})
    const PasswordRef = useRef(null)
    const EmailRef = useRef(null)
     const [EmailError, setEmailError] = useState({isError: false , ErrorMessage:""})
     const [PasswordError, setPasswordError] = useState({isError: false , ErrorMessage:""})
     const [NameError, setNameError] = useState({isError: false , ErrorMessage:""})
     const dispatch = useDispatch()
  
//  Image picker function 
let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setImageUrl(pickerResult.uri);
  }

  const GetBlob= async (uid)=>{
      let response = await fetch(ImageUrl)
      let blob = await response.blob()
      uploadImage(blob,uid)
  }
  const uploadImage= (blob,uid)=>{
        let storegeref = storage.ref().child("UserProfileImages").child(uid);
        storegeref.put(blob).then((snapshot)=>{
            //failed uploaded
            setshowLoader(false) //hiding loading spinner from sign up button
            // getting Image downloadable url
            snapshot.ref.getDownloadURL().then((url)=>{
                // Got downloadable url too
                UploadData(url,uid)
            }).catch((error)=>{
                //uploaded Image but coudln't get its url
                UploadData("ABE",uid)
            })


        }).catch((error)=>{
            // Image uploading Failed
            setshowLoader(false)
            setSnackbarState({visible:true,message:"Upload Failed "+error.message})

        })
        
      
  }
  const UploadData =(url,uid)=>{
      db.collection("userPersonalData").doc(uid).set({Name,Email,profileDp:url,roomId:null}).then(()=>{
          // data uploaded successfully
          setshowLoader(false)
          dispatch(actions.userLoggedIn(Name,Email,uid,url,null))
         
      }).catch((error)=>{
          // created account , uploaded Image (if any) , but coudln't save its data
          setshowLoader(false)
          setSnackbarState({visible:true,message:"unable to upload your data"})
      })
      // moving to checkRoom Screen and removing auth screens from stack navigation so user cant go back to auth screens after login
      navigation.dispatch(
        StackActions.replace('CheckForRoom')
      );
     
  }
    const SignUp= ()=>{
       auth.createUserWithEmailAndPassword (Email,Password).then((Credential)=>{
           let user = Credential.user
           // New User Created with Email and Password Succesfully 
            // 1 if Image is available then get its blob file and then upload it to firebase and then add user data

            // checking for  file
            if(!!ImageUrl){
                GetBlob(user.uid)
            }
            else{
                UploadData("NA",user.uid)
            }
            // Updating all user data to redux store



       }).catch((error)=>{
           // new user sign up failed
           setSnackbarState({visible:true,message:error.message})
           setshowLoader(false)
       })
        
                } 

     const ValidationOfForm=()=>{
         if(!Name){
             setNameError({isError:true,ErrorMessage:"Name is Required"})
             return
         }
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
        SignUp()
       

    }




    return (
        <>
        <SafeAreaView>
    
           <ScrollView>
        
        <KeyboardAvoidingView 
       behavior='position'
       style={{height:'100%'}}>
           <StatusBar style="dark"/> 

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style.MainContainer}>
            <View>
  {/* choose profile picture */}
  <View style={style.chooseDpContainer}>
  <TouchableOpacity onPress={openImagePickerAsync} style={style.chooseDpContainer}>
{(!ImageUrl)?(<><Avatar.Icon size={70} icon="camera-plus-outline" style={{marginEnd:10}} />
<Text>Choose Profile Picture</Text></>):
 (<><Avatar.Image size={70} source={{uri:ImageUrl}} style={{marginEnd:10}}/>
 
  <Text>Choose another Image</Text>
  <Button mode="text" icon="delete" style={{fontSize:40}}  onPress={()=>{
      setImageUrl('')
  }}>Remove</Button>
  </>
 )}
  </TouchableOpacity>
  </View>
            {/* input for Name */}
            <TextInput
                label="Full Name"
                value={Name}
                onChangeText={text => {
                    //update of email
                    setName(text)
                    //remove error
                    if(NameError.isError){
                        setNameError({isError:false,ErrorMessage:""})
                    }
               
                }}
         
                returnKeyType="next"
                onSubmitEditing={() => {
                    EmailRef.current.focus();
                 }} 
                 autoCompleteType='name'
                 error={NameError.isError}
            
            
            />
             <HelperText type="error" visible={NameError.isError}>
    {NameError.ErrorMessage}
  </HelperText>
            {/* Email Input  */}

        <TextInput
            label="Email"
            value={Email}
            ref={EmailRef}
            onChangeText={text => {
                //update of email
                setEmail((text))
                //remove error
                if(EmailError.isError){
                    setEmailError({isError:false,ErrorMessage:""})
                }
           
            }}
     
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

                ref={PasswordRef}
                autoCompleteType='password'
                secureTextEntry= {true}
            />         
            <HelperText type="error" visible={PasswordError.isError}>
    {PasswordError.ErrorMessage}
  </HelperText>
            <Button  
            mode="contained"
            style={style.SignUpButton}
            onPress={ValidationOfForm}
          
            >
            {/* show loader when trying to login after validating form */}
           {(showLoader)? (<><ActivityIndicator animating={true} color='white' /> {SignupBTnText}</>): "Sign Up"}
            </Button>
            </View>
            <View>
                <TouchableWithoutFeedback onPress={()=> navigation.goBack()}>
                 <Text style={style.loginText}>Already have an account ? log in here</Text>
                </TouchableWithoutFeedback>
                </View>
            
    </View>
   
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ScrollView>
    </SafeAreaView>
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
    </>
    
    )
}
const style  = StyleSheet.create({
    MainContainer:{
        height:"100%",
        paddingTop:20,
        paddingHorizontal:20,
        justifyContent:'flex-start',
        alignContent:'center',
        
    },
    SignUpButton:{
        marginBottom:10,
        padding:5,
    },
    loginText:{
        textAlign:'center',
        marginTop:20,
        fontWeight:'bold',
    },
    chooseDpContainer:{
            flexDirection:'row',
            marginBottom:10,
            marginTop:10,
            alignItems:'center'
            // justifyContent:'center'
    }
})