import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
  Modal,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import Create from "./Create.tsx";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
export default function Dashboard({ navigation }) {
  const [rooms, setRooms] = useState({});
  const [newRoomName, setNewRoomName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [location, setLocation] = useState(false);
  const [prev, setPrev] = useState([]);
  const [data, setData] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  function alertMaker(heading, body) {
    Alert.alert(heading, body, [
      {
        text: 'Cancel',

        style: 'cancel'
      },
      { text: 'OK' }
    ]);
  }
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  function mergeArrays(a, b) {
    const mergedArray = [...a];
    for (let i = 0; i < b.length; i++) {
      let found = false;
      for (let j = 0; j < a.length; j++) {
        if (b[i].room_id === a[j].room_id) {
          found = true;
          break;
        }
      }
      if (!found) {
        mergedArray.push(b[i]);
      }
    }
    return mergedArray;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  const update = async () => {
    const val = await AsyncStorage.getItem('member');
    const arr = JSON.parse(val);
    const v = [];
    const token = await AsyncStorage.getItem('token');
    const position = await getCurrentLocation();
    console.log(position);
    const newLat = position.coords["latitude"];
    const newLong = position.coords["longitude"];


    if (arr) {

      await arr.forEach(async function (obj) {
        const obj1 = obj;
        const d = getDistanceFromLatLonInKm(newLat, newLong, obj.lat, obj.long);

        if (d <= obj.circle && !obj.previous) {
          await axios.post('http://192.168.29.121:3000/updateEvent', { event: 'came', room_id: obj.room_id }, {
            headers: {
              authorization: "Bearer " + token
            }
          }).then(function (response) {

            if (response['data'].sucess) {
              obj1.previous = true;

              const d = new Date();

              obj1.event = d.getTime() + (5.5 * 60 * 60 * 1000);


              alertMaker('Success', 'Room Joined');
            }
            else {

              alertMaker('Failure', response['data'].message);
            }

          })
            .catch(function (error) {

            });


        }
        else if (d > obj.circle && obj.previous) {
          await axios.post('http://192.168.29.121:3000/updateEvent', { event: 'left', room_id: obj.room_id }, {
            headers: {
              authorization: "Bearer " + token
            }
          }).then(function (response) {

            if (response['data'].sucess) {
              obj1.previous = false;


              alertMaker('Success', 'Left');
            }
            else {

              alertMaker('Failure', response['data'].message);
            }

          })
            .catch(function (error) {

            });

        }

        v.push(obj1);
        console.log(obj1);
      });
      console.log(v);

    }



    // await AsyncStorage.setItem('member', JSON.stringify(v));



  }
  const handleAddRoom = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.post('http://192.168.29.121:3000/joinRoom', { room_id: newRoomName }, {
      headers: {
        authorization: "Bearer " + token
      }
    }).then(function (response) {

      if (response['data'].sucess) {
        fetchData();
        setLoader(false),
          alertMaker('Success', 'Room Joined');
      }
      else {
        setLoader(false),
          alertMaker('Failure', response['data'].message);
      }

    })
      .catch(function (error) {

      });

  }

  const fetchData = async () => {
    setLoader(true);

    const arrayString = await AsyncStorage.getItem('member');
    const arr = JSON.parse(arrayString);

    const token = await AsyncStorage.getItem('token');
    axios.get('http://192.168.29.121:3000/roomlist', {
      headers: {
        authorization: "Bearer " + token
      }
    }).then(function (response) {

      if (response['data'].sucess) {

        response['data'].data.member.forEach(obj => {
          if (!obj.hasOwnProperty('previous')) {
            obj.previous = false;
          }
        });
        const r = response['data'].data.member;
        let va = [];
        if (arr) {
          val = mergeArrays(r, arr);
        }
        else {
          val = r;
        }
        AsyncStorage.setItem('member', JSON.stringify(val));
        setPrev(val);

        setRooms(response['data'].data);

        setLoader(false);
      }
      else {
        setLoader(false)
      }

    })
      .catch(function (error) {

      });

  };
  const bringData = async (room_id) => {


    const token = await AsyncStorage.getItem('token');
    axios.get('http://192.168.29.121:3000/roomdata', {
      params: {
        room_id: room_id
      },
      headers: {
        authorization: "Bearer " + token
      }
    }).then(function (response) {

      if (response['data'].sucess) {
        setData(response['data'].data);
      }
      else {
        alertMaker('Failure', 'some problem occured');
      }

    })
      .catch(function (error) {

      });
    setModalVisible1(true);

  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === 'granted') {

        return true;
      } else {

        return false;
      }
    } catch (err) {

      return false;
    }
  };

  const getLocation = async () => {
    const result = requestLocationPermission();
    result.then(res => {

      if (res) {
        Geolocation.getCurrentPosition(
          position => {

            setLocation(position);

          },
          error => {
            // See error code charts below.

            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });

  };

  function clear() {
    AsyncStorage.removeItem('token').then(navigation.navigate('Login'));
  }


  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Create setModalVisible={setModalVisible} getLocation={getLocation} location={location} getRoom={fetchData} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible1}
        onRequestClose={() => {
          setModalVisible1(!modalVisible1);
        }}>

        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>username</Text>
            <Text style={styles.tableHeader}>time</Text>
            <Text style={styles.tableHeader}>event</Text>

          </View>
          <ScrollView>
            {loader ? <ActivityIndicator size="large" /> :

              <>
                {data ? data.map((room) => (
                  <View style={styles.tableRow} key={room.id}>

                    <Text style={styles.tableCell}>{room.username}</Text>

                    <Text style={styles.tableCell}>
                      {room.time}
                    </Text>
                    <Text style={styles.tableCell}>
                      {room.event}
                    </Text>
                  </View>
                ))
                  : null}
              </>}
          </ScrollView>

        </View>

      </Modal>
      <Button title="Logout" style={styles.button} onPress={clear} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newRoomName}
          keyboardType='numeric'
          onChangeText={(text) => setNewRoomName(text)}
        />
        <Button title="Add Room" style={styles.button} onPress={handleAddRoom} />
        <Button title="Create Room" style={styles.button} onPress={() => setModalVisible(true)} />
        <Button title="update" style={styles.button} onPress={update} />

      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Room id</Text>
          <Text style={styles.tableHeader}>room name</Text>
          <Text style={styles.tableHeader}>last update</Text>
        </View>
        <ScrollView>
          {loader ? <ActivityIndicator size="large" /> :

            <>
              {rooms.owner ? rooms.owner.map((room) => (
                <View style={styles.tableRow} key={room.room_id}>
                  <TouchableOpacity onPress={() => bringData(room.room_id)}>
                    <Text style={styles.tableCell}>{room.room_id}</Text>
                  </TouchableOpacity>
                  <Text style={styles.tableCell}>
                    {room.room_name}
                  </Text>
                  <Text style={styles.tableCell}>
                    -
                  </Text>
                </View>
              ))
                : null}
            </>}
          {loader ? <ActivityIndicator size="large" /> :

            <>
              {prev ? prev.map((room) => (
                <View style={styles.tableRow} key={room.room_id}>
                  <Text style={styles.tableCell}>{room.room_id}</Text>
                  <Text style={styles.tableCell}>
                    {room.room_name}
                  </Text>
                  <Text style={styles.tableCell}>
                    {room.event}
                  </Text>
                </View>
              ))
                : null}
            </>}
        </ScrollView>

      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    color: 'black'
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: 'gray',
    color: 'black'
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    color: 'black'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    color: 'black'
  },
});
