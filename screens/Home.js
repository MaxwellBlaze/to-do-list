import React, {useState, useEffect, } from 'react';
import {StyleSheet, View, Text, Image, Button, FlatList, TouchableOpacity, TextInput, Keyboard, Modal, Alert} from 'react-native';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Home = ({navigation}) => {

    //for managing lists, do the same for tasks in ListView screen
    const [lists, setLists] = useState([]);
    const listsRef = firebase.firestore().collection('lists');
    const [addList, setAddList] = useState('');

    //for + List modal
    const [modalVisible, setModalVisible] = useState(false);

    //get data from firebase
    useEffect(() => {
        // listsRef
        // .orderBy('dateCreated', 'desc')
        // .onSnapshot(
        //     querySnapshot => {
        //         const lists = []
        //         querySnapshot.firebase.forEach((doc) => {
        //             const {heading} = doc.data()
        //             lists.push({
        //                 id: doc.id,
        //                 heading,
        //             })
        //         })
        //         setLists(lists);
        //     }
        // )
        listsRef.orderBy('dateCreated', 'desc').onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const lists = [];
                querySnapshot.forEach((doc) => {
                    const {heading} = doc.data()
                    lists.push({
                        id: doc.id,
                        heading,
                    })
                })
                setLists(lists);
            }
        })

    }, []);

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
        };
        setModalVisible(!modalVisible);
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

                <FlatList 
                    data={lists}
                    numColumns={1}
                    renderItem={({item}) => (
                        <View>
                            <TouchableOpacity style={styles.list}>
                                <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}>{item.heading.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
                <TouchableOpacity 
                    style={[styles.button, {borderTopLeftRadius: 15, borderBottomLeftRadius: 15,}]}
                    onPress={() => setModalVisible(true)}
                >
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
    
            {/* add list modal */}
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Text style={styles.headerText}>Add A List</Text>
                            <TextInput 
                                style={styles.textInput}
                                placeholder='List Name'
                                placeholderTextColor={'black'}
                                onChangeText={(heading) => setAddList(heading)}
                                value={addList}
                            />

                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <View style={[styles.button, {marginTop: 30, backgroundColor: 'maroon', }]}>
                                    <Text style={[styles.buttonText, {fontSize: 16,}]}>Cancel</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => addNewList()}>
                                <View style={[styles.button, {marginTop: 30,}]}>
                                    <Text style={[styles.buttonText, {fontSize: 16,}]}>Create</Text>
                                </View>
                            </TouchableOpacity> 
                            
                        </View>
                    </View>
                </Modal>
            </View>

            {/* <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            /> */}

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
    centeredView: {
        // flex: 1,
        
        justifyContent: "center",
        alignItems: "center",
        marginTop: '50%',
        
        
      },
      modalView: {
        // flexDirection: 'column',
        // height: 400,
        // width: 250,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
      },
      textInput: {
        // marginHorizontal: 30,
        marginTop: 20,
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#706a5d',
      },
      list: {
        borderWidth: 0.3, 
        margin:10,
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'white',

      },


});