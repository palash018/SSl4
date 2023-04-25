import React,{useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./android/app/src/components/HomeScreen.tsx"
import Login from "./android/app/src/components/Login.tsx"
import Signup from "./android/app/src/components/Signup.tsx"
import Dashboard from "./android/app/src/components/Dashboard.tsx";
import Join from "./android/app/src/components/Join.tsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack=createNativeStackNavigator();

export default  function App() {
    const [token, setToken] = useState(null);
      useEffect(() => {

        const getToken = async () => {
          try{
          const storedToken = await AsyncStorage.getItem('token');
          setToken(storedToken);
          console.log(token);
          }
          catch{
          console.log('whoops');
          }
        };

        getToken();
      }, []);
    return (

           <NavigationContainer>
             <Stack.Navigator>
               { !token && (
                 <Stack.Screen
                   name="home"
                   component={HomeScreen}
                   options={{title:'Welcome'}}
                 />
               ) }
               <Stack.Screen name="Dashboard" component={Dashboard}/>
               <Stack.Screen name="Login" component={Login}/>
               <Stack.Screen name="Signup" component={Signup}/>
             </Stack.Navigator>
           </NavigationContainer>

    );

}
