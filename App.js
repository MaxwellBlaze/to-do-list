import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Productivity from './screens/Productivity';
import CompletedTasks from './screens/CompletedTasks';
import ListView from './screens/ListView';

//create a navi stack for the
//required screens
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false,}}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="ListView" component={ListView} />
    </HomeStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: true,
            tabBarLabelPosition: 'below-icon',
            tabBarStyle: {
                borderWidth: 0,
                borderColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: '#101419',
                paddingBottom: 0,
                
            },
        }}
      >
        <Tab.Screen 
          name="homeStack" 
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                  <Image 
                      source={require('./assets/icons/home.png')}
                      resizeMode='contain'
                      style={{
                          width:30,
                          height: 30,
                          tintColor: focused ? '#CC7722' : 'grey',
                          
                      }}
                  />
              </View>

            ),
            title: 'Lists',
            headerStyle: {
              backgroundColor: '#CC7722',
              borderRadius: 15,
            },
            headerTintColor: '#0B3948',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
              paddingBottom: 10,
            },
          }} 
          component={HomeStackScreen} />

        <Tab.Screen 
          name="CompletedTasks" 
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                  <Image 
                      source={require('./assets/icons/check.png')}
                      resizeMode='contain'
                      style={{
                          width:30,
                          height: 30,
                          tintColor: focused ? '#CC7722' : 'grey',
                          
                      }}
                  />
              </View>

            ),
            title: 'Completed Tasks',
            headerStyle: {
              backgroundColor: '#CC7722',
              borderRadius: 15,
            },
            headerTintColor: '#0B3948',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
              paddingBottom: 10,
            },
          }} 
          component={CompletedTasks} 
        />

        <Tab.Screen 
          name="Productivity" 
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                  <Image 
                      source={require('./assets/icons/productivity.png')}
                      resizeMode='contain'
                      style={{
                          width:30,
                          height: 30,
                          tintColor: focused ? '#CC7722' : 'grey',
                          
                      }}
                  />
              </View>

            ),
            title: 'Productivity',
            headerStyle: {
              backgroundColor: '#CC7722',
              borderRadius: 15,
            },
            headerTintColor: '#0B3948',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
              paddingBottom: 10,
            },
          }} 
          component={Productivity} 
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

