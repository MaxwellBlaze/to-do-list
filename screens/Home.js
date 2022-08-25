import React, {useState, useEffect, } from 'react';
import {StyleSheet, View, Text, Image, Button, FlatList, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Home = ({navigation}) => {

    //for managing lists, do the same for tasks in ListView screen
    const [lists, setLists] = useState(['Shopping', 'To Do', 'Chores']);
    const listsRef = firebase.firestore().collection('lists');
    const [addList, setAddList] = useState('');

    //get data from firebase
    // useEffect(() => {
    //     listsRef
    //     .orderBy('dateCreated', 'desc')
    //     .onSnapshot(
    //         querySnapshot => {
    //             const lists = []
    //             querySnapshot.firebase.forEach((doc) => {
    //                 const {heading} = doc.data()
    //                 lists.push({
    //                     id: doc.id,
    //                     heading,
    //                 })
    //             })
    //             setLists(lists);
    //         }
    //         )
    // }, []);

    //delete a list
    const deleteList = (lists) => {
        listsRef
        .doc(lists.id)
        .delete()
        .then(() => {
            alert('List deleted');
        })
        .catch(error => {
            alert(error);
        })
    };

    //add a list
    const addNewList = () => {
        if(addList && addList.length > 0){
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addList,
                dateCreated: timestamp,
            };
            listsRef
            .add(data)
            .then(() => {
                setAddList('');
                Keyboard.dismiss();
            })
            .catch((error) => {
                alert(error);
            })
        }
    }

    return(
        <View style={styles.container}>
            {/* title */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    
                </Text>
            </View>
            
            {/* Flatlist of tasklists */}
            <View style={styles.bodyContainer}>
                {/* <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}> Task List 1 </Text>
                <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}> Task List 2 </Text>
                <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}> Task List 3 </Text> */}
                <FlatList 
                    
                />

            </View>
            
            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        All Tasks
                    </Text>
                </TouchableOpacity>
                     
            </View> */}

            <View style={styles.buttonsContainer}>
                {/* To do: onPress function--> bring user to list creation page */}
                <TouchableOpacity style={[styles.button, {borderTopLeftRadius: 15, borderBottomLeftRadius: 15,}]}>
                    <Text style={styles.buttonText}>
                        + List
                    </Text>
                </TouchableOpacity>

                {/* To do: onPress function--> bring user to all tasks (ListView) page */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        All Tasks
                    </Text>
                </TouchableOpacity>

                {/* To do: onPress function--> bring user to task creation page */}
                <TouchableOpacity style={[styles.button, {borderTopRightRadius: 15, borderBottomRightRadius: 15,}]}>
                    <Text style={styles.buttonText}>
                        + Task
                    </Text>
                </TouchableOpacity>
            </View>
    
            

            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        backgroundColor: '#E5DCC5',
        borderRadius: 15,
        padding: 15,
    },
    headerContainer: {
        //flexDirection: 'row',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0B3948',
        textAlign: 'center',
    },
    bodyContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',

    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: 30,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 50,
        left: 10,
        right: 10,
    },
    button: {
        borderRadius: 5, 
        backgroundColor: '#0B3948',
        borderWidth: 1,
        borderColor: '#706a5d',
        textAlign: 'center',
        width: '30%',
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },


});