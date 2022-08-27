import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, Text, Image, Button, FlatList, TouchableOpacity, TextInput, Keyboard, Modal, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import  SwitchSelector  from "react-native-switch-selector";
// import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Home = ({navigation}) => {

    //for managing lists
    const [lists, setLists] = useState([]);
    const listsRef = firebase.firestore().collection('lists');
    const [addList, setAddList] = useState([]);

    // for managing tasks
    const [tasks, setTasks] = useState([]);
    const tasksRef = firebase.firestore().collection('tasks');
    //add states for all properties
    const [addTaskName, setAddTaskName] = useState('');
    const [addPriority, setAddPriority] = useState('');
    const [addTimeAndDate, setAddTimeAndDate] = useState(new Date());
    const [addTimeToComplete, setAddTimeToComplete] = useState(new Date());
    // const [addIsCompleted, setAddIsCompleted] = useState('');
    const [addBelongsTo, setAddBelongsTo] = useState('');

    //for +List modal
    const [addListModalVisible, setAddListModalVisible] = useState(false);

    //for +Task modal
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

    //for date picker modal
    const [open, setOpen] = useState(false)

    //get data from firebase
    useEffect(() => {
        //for lists
        listsRef.orderBy('dateCreated', 'asc').onSnapshot({
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
        });

        //for tasks
        tasksRef.orderBy('dateCreated', 'asc').onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    const {heading} = doc.data()
                    tasks.push({
                        id: doc.id,
                        heading,
                    })
                })
                setTasks(tasks);
            }
        });

    }, []);
    
    //delete a list
    const deleteList = (lists) => {
        // console.log(lists);
        listsRef
        .doc(lists.id)
        .delete()
        .then(() => {
            // alert('List deleted');
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
        }else{
            alert('List name cannot be empty!');
        };
        setAddListModalVisible(!addListModalVisible);
    };

    //delete a task
    const deleteTask = (tasks) => {
        // console.log(lists);
        tasksRef
        .doc(tasks.id)
        .delete()
        .then(() => {
            // alert('List deleted');
        })
        .catch(error => {
            alert(error);
        })
    };

    //add a task
    const addNewTask = () => {
        if(addTaskName && addTaskName.length > 0){
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            // need to edit this part
            const data = {
                heading: addTaskName,
                priority: addPriority,
                timeAndDate: addTimeAndDate,
                timeToComplete: addTimeToComplete,
                isCompleted: false,
                belongsTo: addBelongsTo,
                dateCreated: timestamp,
            };
            tasksRef
            .add(data)
            .then(() => {
                setAddTaskName('');
                setAddPriority('');
                setAddTimeAndDate('');
                setAddTimeToComplete('');
                setAddBelongsTo('');
                Keyboard.dismiss();
            })
            .catch((error) => {
                alert(error);
            })
        }else{
            alert('Fields cannot be empty!');
        };
        setAddTaskModalVisible(!addTaskModalVisible);
    };

    const rightSwipeActions = (item) => {
        // console.log(item);
        return (
            <View
            style={{
                backgroundColor: '#E5DCC5',
                justifyContent: 'center',
                alignItems: 'flex-end',
                padding: 10,
            }}
            >
                <FontAwesome 
                    name='trash-o'
                    color='red'
                    size={30}
                    onPress={ () => deleteList(item) }
                />
            </View>
        );
    };

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
                        
                        <Swipeable
                            renderRightActions={() => rightSwipeActions(item)}
                        >
                            <View>
                                <TouchableOpacity style={styles.list}>
                                    <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}>{item.heading}</Text>
                                </TouchableOpacity>

                            </View>
                        </Swipeable> 
                    )}
                />

            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[styles.button, {borderTopLeftRadius: 15, borderBottomLeftRadius: 15,}]}
                    onPress={() => setAddListModalVisible(true)}
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
                <TouchableOpacity 
                    style={[styles.button, {borderTopRightRadius: 15, borderBottomRightRadius: 15,}]}
                    onPress={() => setAddTaskModalVisible(true)}
                    >
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
                    visible={addListModalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setAddListModalVisible(!addListModalVisible);
                    }}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Text style={styles.headerText}>Add A List</Text>
                            <TextInput 
                                style={styles.textInput}
                                placeholder='List Name'
                                placeholderTextColor={'grey'}
                                onChangeText={(heading) => setAddList(heading)}
                                value={addList}
                            />

                            <TouchableOpacity onPress={() => setAddListModalVisible(!addListModalVisible)}>
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

            {/* add task modal */}
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={addTaskModalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setAddTaskModalVisible(!addTaskModalVisible);
                    }}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Text style={styles.headerText}>Add A Task</Text>

                            <TextInput 
                                style={styles.textInput}
                                placeholder='Task Name'
                                placeholderTextColor={'grey'}
                                onChangeText={(heading) => setAddTaskName(heading)}
                                value={addTaskName}
                            />

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Set priority:</Text>
                            
                            <SwitchSelector 
                                initial={0}
                                // change console.log to setAddPriority
                                onPress={(value) => setAddPriority(value)}
                                selectedColor='black'
                                borderColor='black'
                                style={{borderWidth:0.3, borderRadius: 50, marginTop: 10,}}
                                backgroundColor='#E5DCC5'
                                options={[
                                    { label: "Low", value: "low", activeColor: 'green' }, 
                                    { label: "Medium", value: "med", activeColor: 'yellow' }, 
                                    { label: "High", value: "high", activeColor: 'red' }, 
                                ]}
                            />

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Set a deadline:</Text>
                            
                            
                            <View>  
                                <DateTimePickerModal 
                                    mode='datetime'
                                    display='default'
                                    isVisible={open}
                                    date={addTimeAndDate}
                                    // onConfirm={(date) => {
                                    //     setOpen(false)
                                    //     setAddTimeAndDate(date)
                                    // }}
                                    onConfirm={()=>{console.log('on confirm')}}
                                    // onCancel={() => {
                                    //     setOpen(false)
                                    // }}
                                    onCancel={()=>{setOpen(false); console.log('on cancel')}}
                                />

                                <TouchableOpacity 
                                    style={{marginTop: 10, borderWidth: 0.3, padding: 10, borderRadius: 15, backgroundColor: '#E5DCC5'}}
                                    onPress={() => setOpen(true)}    
                                >
                                    <Text>Set Deadline</Text>
                                 </TouchableOpacity>
                            </View>
                            

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Set estimated time to complete task:</Text>

                            <View>  
                                <DateTimePickerModal 
                                    mode='time'
                                    display='default'
                                    isVisible={open}
                                    date={addTimeToComplete}
                                    // onConfirm={(date) => {
                                    //     setOpen(false)
                                    //     setAddTimeAndDate(date)
                                    // }}
                                    onConfirm={()=>{console.log('on confirm')}}
                                    // onCancel={() => {
                                    //     setOpen(false)
                                    // }}
                                    onCancel={()=>{setOpen(false); console.log('on cancel')}}
                                />

                                <TouchableOpacity 
                                    style={{marginTop: 10, borderWidth: 0.3, padding: 10, borderRadius: 15, backgroundColor: '#E5DCC5'}}
                                    onPress={() => setOpen(true)}    
                                >
                                    <Text>Est. Time to Complete</Text>
                                 </TouchableOpacity>
                            </View>

                            <Text style={{paddingTop: 15, fontSize: 16,}}>*belongsTo* List Picker Here</Text>


                            <TouchableOpacity onPress={() => setAddTaskModalVisible(!addTaskModalVisible)}>
                                <View style={[styles.button, {marginTop: 30, backgroundColor: 'maroon', }]}>
                                    <Text style={[styles.buttonText, {fontSize: 16,}]}>Cancel</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => addNewTask()}>
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
        marginTop: '30%',
        
        
      },
      modalView: {
        // flexDirection: 'column',
        // height: 400,
        // width: 250,
        borderWidth: 0.3,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
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