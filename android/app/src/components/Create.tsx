import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity,ActivityIndicator,Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Create  ({setModalVisible,location,getLocation,getRoom})  {
  const [room_name, setRoom_name] = useState('');
  const [lat,setLat]=useState("");
  const [long,setLong]=useState("");
  const [circle,setCircle]=useState('');
  const [loader,setLoader]=useState(false);

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
 async function create(){
    setLoader(true);
    const token =await AsyncStorage.getItem('token');
    await axios.post('http://192.168.29.121:3000/createRoom', {
       room_name:room_name,
       lat:lat,
       long:long,
       circle:circle
     },{headers:{
      authorization:"Bearer "+token
     }}).then(function (response) {
            console.log(response);
               if(response['data'].sucess){
               setLoader(false),
               alertMaker('Success','Room created');
               }
               else{
               setLoader(false),
               alertMaker('Failure',response['data'].message);
               }

             })
             .catch(function (error) {
               console.log(error);
             });
    await getRoom();
 }
async function fill() {
  await getLocation();
  const newLat = location.coords["latitude"].toString();
  const newLong=location.coords["longitude"].toString();
  console.log("new",newLat);
  setLat(newLat);
  setLong(newLong);
}








  return (

      <View style={styles.container}>

          {loader?<ActivityIndicator size="large" />:
          <>
          <Text style={styles.title}>Create Room</Text>
                  <Text  style={{color:'rgb(10,10,10)'}} >Room name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Room Name"
                    value={room_name}
                    onChangeText={(text)=>setRoom_name(text)}
                  />
                  <Text  style={{color:'rgb(10,10,10)'}} >latitude</Text>
                  <TextInput
                            style={styles.input}

                            placeholder="lat"
                            value={lat}
                            onChangeText={(text)=>setLat(text)}
                  />
                  <Text  style={{color:'rgb(10,10,10)'}} >Longitude</Text>
                  <TextInput
                                    style={styles.input}

                                    placeholder="long"
                                    value={long}
                                    onChangeText={(text)=>setLong(text)}
                          />
                  <Text  style={{color:'rgb(10,10,10)'}} >Circle</Text>
                  <TextInput
                                    style={styles.input}
                                   keyboardType='numeric'
                                    placeholder="Circle"
                                    value={circle}
                                    onChangeText={(text)=>setCircle(text)}
                          />
                  <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={fill}>
                              <Text style={styles.buttonText}>Fill location</Text>
                            </TouchableOpacity>
                          </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={create}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                   <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                   <Text style={styles.buttonText}>Go back</Text>
                    </TouchableOpacity>
                    </View>
                    </>
          }

      </View>


  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
//   modal:{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 1000,
//    },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color:'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
