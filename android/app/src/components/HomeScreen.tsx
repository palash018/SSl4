import React ,{useState}from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Button, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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
        console.log('granted', granted);
        if (granted === 'granted') {
          console.log('You can use Geolocation');
          return true;
        } else {
          console.log('You cannot use Geolocation');
          return false;
        }
      } catch (err) {
        return false;
      }
    };

export default function LandingPage({ navigation }) {


   const [location,setLocation]=useState(false);
      const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
          console.log('res is:', res);
          if (res) {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position);
                setLocation(position);
              },
              error => {
                // See error code charts below.
                console.log(error.code, error.message);
                setLocation(false);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
        console.log(location);
      };








  return (
    <View style={styles.container}>
      <Text style={{color:"rgb(10,10,10)"}}> </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.buttonText}
          title="Login"
          >
          Login
        </Button>
        </View>
        <View style={styles.buttonContainer}>
        <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Signup')}
                  style={styles.buttonText}
                  title="Signup"
                  >
                  Signup
                </Button>
      </View>
      <View style={styles.buttonContainer}>
              <Button
                        mode="contained"
                        onPress={() =>getLocation()}
                        style={styles.buttonText}
                        title="location"
                        >
                        location
                      </Button>


            </View>
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
                     marginVertical:30
                   },
                    input:{
                      height:50,
                      width:'80%',
                      borderWidth :2,
                      borderRadius :10,
                      paddingHorizontal :20,
                      marginBottom :'5%'
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
