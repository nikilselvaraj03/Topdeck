import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';

import Contacts from './Contacts';
import CreateGroup from './CreateGroup';
import LandingScreen from './LandingScreen';
import ProfilePage from './ProfilePage';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


const home = 'Home';
const profilePage = 'ProfilePage';
const contacts = 'Requests';
const creategroup = 'CreateGroup';

const Tab = createBottomTabNavigator();



export default function Home({userToken}) {
  let navigation = useNavigation();
  const [userinfo,setUserInfo] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    let userInformation = null;
    async function fetchUserInfo(){
      userInformation = await getDoc(doc(db,'users',userToken.uid));
      if (userInformation && userInformation.exists()) {
        setUserInfo(userInformation.data());
        Toast.show('Welcome back '+userinfo.first_name, {
          duration: Toast.durations.LONG,
          backgroundColor:'#defabb',
          textColor: '#008b00',
          position:-120
        });
        console.log('useeeeer',userinfo.first_name);
    } else {
      Toast.show('Unable to retrieve your information right now, please try again later', {
        duration: Toast.durations.LONG,
        backgroundColor:'#FFEBEE',
        textColor: '#B71C1C',
        position:-120
      });
    }
    }
    fetchUserInfo()

    return unsubscribe;
  }, []);
  return (
            <Tab.Navigator initialRouteName={home} screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    if(rn === profilePage){
                        iconName = focused ? 'person-circle-outline' : 'person-outline'
                    } else if (rn === contacts) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === creategroup){
                        iconName = focused ? 'add-circle-outline' : 'add-outline'

                    }else if (rn === home){
                        iconName = focused ? 'home' : 'home-outline'

                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                }
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'black',
                marginTop:10,
                labelStyle: { paddingBottom:10, fontSize: 10}
            }}
            >
                <Tab.Screen name={home} options={{headerShown:false}} component={LandingScreen}/>
                <Tab.Screen name={creategroup} options={{headerShown:false}} component={CreateGroup}/>
                <Tab.Screen name={contacts} options={{headerShown:false}} component={Contacts}/>
                <Tab.Screen name={profilePage} options={{headerShown:false}} component={() => <ProfilePage userinfo={userinfo} />} />
            </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})