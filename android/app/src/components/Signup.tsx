import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
export default function Signup({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm,setConfirm]=useState('');
    const [email,setEmail]=useState('');
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
    function verify(){
    if(password!==confirm){
     alertMaker('Invalid Form','Password does not match');
    }
    else if(password.length==0||email.length==0||username.length==0){
     alertMaker('Invalid Form', 'One of the Fields is empty');
    }
    else{
    sign();
    }
    }

    async function sign(){
     axios.post('http://192.168.50.78:3000/createUser', {
            username:username,
            password:password,
            email:email
          })
          .then(function (response) {
            if(response['data'].sucess){
               alertMaker('Success','You can proceed to login');
            }
            else{
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
                placeholder='Username'
                onChangeText={(text) => setUsername(text)}
                value={username}
            />
             <Text style={{color:'rgb(10,10,10)'}}>Email</Text>
                         <TextInput
                            style={styles.input}
                             placeholder='Email'
                             onChangeText={(text) => setEmail(text)}
                             value={email}
                         />
             <Text style={{color:'rgb(10,10,10)'}}>Password </Text>
             <TextInput
                style={styles.input}
                 secureTextEntry={true}
                 placeholder='Password'
                 onChangeText={(text) => setPassword(text)}
                 value={password}
             />
              <Text style={{color:'rgb(10,10,10)'}}>Confirm Password </Text>
                          <TextInput
                             style={styles.input}
                              secureTextEntry={true}
                              placeholder='ConfirmPassword'
                              onChangeText={(text) => setConfirm(text)}
                              value={confirm}
                          />

             <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => verify()}
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