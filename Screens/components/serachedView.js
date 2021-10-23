import React, { useState } from 'react'
import { View,Text, Image } from 'react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'

export default function SerachedView({userInfo,selected}) {

    return (
        
        <View 
        style={{flexDirection:'row',
        paddingHorizontal:20,
        paddingVertical:10,marginBottom:11,
        backgroundColor:'rgba(96,0,236,0.8)',
        height:60,
        borderRadius:7,
    alignItems:'center'}}
        >
            <Image source={{uri:userInfo.profileDp}} style={{width:40,height:40,borderRadius:20,marginRight:20}} />
            <Text style={{fontSize:21,color:'white'}}>{userInfo.Name.substring(0,12)}</Text>
            
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                { selected && <IconButton icon="check" color='white' animated={true}/>} 
            </View>
        </View>
    
    )
}
