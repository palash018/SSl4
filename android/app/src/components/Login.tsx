import React, {useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
     function alertMaker(heading,body){
        Alert.alert(heading,body, [
                   {
                     text: 'Cancel',
                     onPress: () => console.log('Cancel Pressed'),
                     style: 'cancel',
                   },
                   {text: 'OK', onPress: () => console.log('OK Pressed')},
                 ]);
        }
    const requestOptions={
    method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username:username,password:password}),
    }
    async function process() {
    console.log('function ran');
   axios.post('http://192.168.29.121:3000/login', {
       username:username,
       password:password
     })
     .then(function (response) {
       if(response['data'].sucess){
       alertMaker('Success','Succesfully logged in');
       AsyncStorage.setItem('token',response['data'].token).then(()=>navigation.navigate('Dashboard'));
       }
       else{
       console.log(response['data']);
       alertMaker('Failure',response['data'].message);
       }

     })
     .catch(function (error) {
       console.log(error);
     });
    }


    return (
        <View style={styles.container}>

            <Text style={{color:'rgb(10,10,10)'}}>Username </Text>
            <TextInput
                style={styles.input}
                placeholder='Username or Email'
                onChangeText={(text) => setUsername(text)}
                value={username}
            />
             <Text style={{color:'rgb(10,10,10)'}}>Password </Text>
             <TextInput
                style={styles.input}
                 secureTextEntry={true}
                 placeholder='Password'
                 onChangeText={(text) => setPassword(text)}
                 value={password}
             />
             <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>process()}
                   style={[styles.buttonContainer,{backgroundColor: '#2980b9'}]}
             >
                  <Text style={styles.buttonText}>Login</Text>
             </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
                 container: {
                   flex: 1,
                   alignItems: 'center',
                   justifyContent: 'center',
                   backgroundColor:'#fff'
                 },
                 title:{
                   fontSize:24,
                   marginVertical:30,
                   color:'rgb(10,10,10)'
                 },
                  input:{
                    height:50,
                    width:'80%',
                    borderWidth :2,
                    borderRadius :10,
                    paddingHorizontal :20,
                    marginBottom :'5%',
                    color:'rgb(10,10,10)'
                  },
                  buttonContainer:{
                     marginTop:'3%',
                     width:'60%',
                    height :50,
                    borderRadius:20,
                     backgroundColor: '#2980b9'
                  },
                  buttonText:{
                    fontSize :18,
                    fontWeight :'bold',
                    color:'#fff' ,
                    textAlign :'center',
                    lineHeight :47
                  }
               });