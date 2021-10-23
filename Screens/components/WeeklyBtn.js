import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function WeeklyBtn({day,weekly,setweekly,title}) {
    return (
        <TouchableOpacity onPress={()=>
            {
                if(weekly.includes(day)){
                    setweekly(weekly.filter(item=>item != day))
                }
                else{
                    setweekly([...weekly,day])
                }
            }
            }><View
              style={{borderWidth:2,borderRadius:'50%',padding:5,paddingHorizontal:10,borderColor:"#6200EE",marginRight:10,marginBottom:10,
              backgroundColor:(weekly.includes(day))?"#6200EE":"white"}}>
                 <Text style={{fontSize:15,
                color:(weekly.includes(day))?"white":"#6200EE"}}>{title}</Text></View></TouchableOpacity>
    )
}
