import React, { useState, useEffect, } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Keyboard, Modal, Alert, } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import  SwitchSelector  from "react-native-switch-selector";
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { firebase } from '../firebase/config';
import { FontAwesome } from '@expo/vector-icons';
import * as PushNotifications from './PushNotifications';
import styles from '../styles/HomeStyles';

const Home = ({navigation}) => {
    //for managing lists
    const [lists, setLists] = useState(['']);
    const listsRef = firebase.firestore().collection('lists');
    const [addList, setAddList] = useState([]);
    const [listDropDown, setListDropDown] = useState([]);

    // for managing tasks
    const [tasks, setTasks] = useState([]);
    const tasksRef = firebase.firestore().collection('tasks');
    // const [deleteTasks, setDeleteTasks] = useState([]);

    //add states for all task properties
    const [addTaskName, setAddTaskName] = useState('');
    const [addPriority, setAddPriority] = useState(1);
    const [addTimeAndDate, setAddTimeAndDate] = useState('');
    const [addTimeToComplete, setAddTimeToComplete] = useState('');
    const [minutes, setMinutes] = useState('0');
    const [addBelongsTo, setAddBelongsTo] = useState('');

    //for +List modal
    const [addListModalVisible, setAddListModalVisible] = useState(false);
    //for +Task modal
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    //for date picker modal
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false);

    //getting lists from firebase
    const getLists = async () => {
        listsRef.orderBy('dateCreated', 'asc').onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const lists = [];
                const listsDropDown = [];
                querySnapshot.forEach((doc) => {
                    const {name} = doc.data()
                    const listsDDName = doc.data().name
                    lists.push({
                        id: doc.id,
                        name,
                    })
                    listsDropDown.push(listsDDName)
                })
                setLists(lists);
                setListDropDown(listsDropDown);
                // console.log(listDropDown);
            }
        });
    };

    //getting tasks from firebase
    const getTasks = async () => {
        tasksRef.orderBy('dateCreated', 'asc').onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    const {name} = doc.data()
                    tasks.push({
                        id: doc.id,
                        name,
                    })
                })
                setTasks(tasks);
            }
        });
    };

    //get data from firebase
    useEffect(() => {
        getLists();
        getTasks();
    }, []);
    
    //function to delete a task
    const deleteTask = (task) => {
        // console.log(lists);
        tasksRef
        .doc(task.id)
        .delete()
        .then(() => {
            // alert('Task deleted');
        })
        .catch(error => {
            alert(error);
        })
    };

    //delete a list
    const deleteList = (list) => {
        //delete tasks belonging to list
        const deleteTasks = firebase.firestore().collection('tasks').where('belongsTo', '==', list.name);    
        deleteTasks.onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const batch = firebase.firestore().batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                batch.commit();
            }
        });

        //delete the list
        listsRef
        .doc(list.id)
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
                name: addList,
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
        listDropDown.push(addList);
        setAddListModalVisible(!addListModalVisible);
    };

    //add a task
    const addNewTask = () => {
        if(addTaskName && addTaskName.length > 0){
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            // need to edit this part
            const data = {
                name: addTaskName,
                priority: addPriority,
                timeAndDate: addTimeAndDate,
                timeToComplete: parseInt(addTimeToComplete),
                isCompleted: false,
                belongsTo: addBelongsTo,
                dateCreated: timestamp,
            };
            tasksRef
            .add(data)
            .then(() => {
                setAddTaskName('');
                setAddPriority(1);
                setAddTimeAndDate('');
                setAddTimeToComplete('');
                setAddBelongsTo('');
                setMinutes('');
                Keyboard.dismiss();
            })
            .catch((error) => {
                alert(error);
            })
        }else{
            alert('Fields cannot be empty!');
        };
        setAddTaskModalVisible(!addTaskModalVisible);

        //for setting push notification
        if(addTimeAndDate != ''){
            const tempDate = addTimeAndDate.toLocaleString('en-GB');
            // console.log(tempDate);
            var hour = tempDate.slice(11,14);
            // console.log(hour);
            var mins = tempDate.slice(15,17);
            // console.log(mins);
            var dayDate = tempDate.slice(0,10);
            // console.log(dayDate);       
            //index [0] - day, [1] - month, [2] - year
            let dateArray = dayDate.split('/');   
            PushNotifications.schedulePushNotification(dateArray[2], dateArray[1], dateArray[0], hour, mins, addTaskName);
        }else{
            console.log('Notification not set.');
        };  
    };

    const cancelAddTaskPressed = () => {
        setAddTaskModalVisible(!addTaskModalVisible);
        setAddTaskName('');
        setAddPriority(1);
        setAddTimeAndDate('');
        setAddTimeToComplete('');
        setAddBelongsTo('');
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
                                <TouchableOpacity 
                                    style={styles.list} 
                                    onPress={() => {navigation.navigate('ListView', 
                                        {
                                            listName: item.name,
                                        }
                                    )}}
                                >
                                    <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}>{item.name}</Text>
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
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {navigation.navigate('ListView', 
                                        {
                                            listName: 'All Tasks',
                                        }
                                    )}}
                >                
                    <Text style={styles.buttonText}>
                        All Tasks
                    </Text>
                </TouchableOpacity>
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
                                onChangeText={(name) => setAddList(name)}
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
                    <View style={[styles.centeredView, {marginTop: "10%",}]}>
                        <View style={[styles.modalView, {margin: 20,}]}>
                            <Text style={styles.headerText}>Add A Task</Text>         
                            <TextInput 
                                style={styles.textInput}
                                placeholder='Task Name'
                                placeholderTextColor={'grey'}
                                onChangeText={(name) => setAddTaskName(name)}
                                value={addTaskName}
                            />
                            <Text style={{paddingTop: 15, fontSize: 16,}}>Priority:</Text>                           
                            <SwitchSelector 
                                initial={0}
                                onPress={(value) => setAddPriority(value)}
                                selectedColor='black'
                                borderColor='black'
                                style={{borderWidth:0.3, borderRadius: 50, marginTop: 10,}}
                                backgroundColor='#E5DCC5'
                                options={[
                                    { label: "Low", value: 1, activeColor: 'green' }, 
                                    { label: "Medium", value: 2, activeColor: 'yellow' }, 
                                    { label: "High", value: 3, activeColor: 'red' }, 
                                ]}
                            />
                            <Text style={{paddingTop: 15, fontSize: 16,}}>Deadline:</Text>                                                        
                            <View>  
                                <DateTimePickerModal 
                                    mode='datetime'
                                    display='default'
                                    isVisible={openDateTimePicker}
                                    date={new Date()}
                                    onConfirm={(date) => {
                                        setOpenDateTimePicker(false);
                                        setAddTimeAndDate(date);
                                    }}
                                    onCancel={() => {
                                        setOpenDateTimePicker(false);
                                        // console.log('Date Time Picker cancel pressed');
                                    }}
                                />
                                <TouchableOpacity 
                                    style={{marginTop: 10, borderWidth: 0.3, padding: 10, borderRadius: 15, backgroundColor: '#E5DCC5', justifyContent: 'center', alignItems: 'center',}}
                                    onPress={() => setOpenDateTimePicker(true)}    
                                >
                                    <Text>Open Date Time Picker</Text>
                                 </TouchableOpacity>                                
                                 <Text style={{paddingTop: 15, fontSize: 16, color: '#CC7722'}}>
                                    {addTimeAndDate
                                        .toLocaleString([], {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>                          
                            <Text style={{paddingTop: 15, fontSize: 16,}}>Est time to complete task (mins):</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                                 <TextInput 
                                    style={styles.textInput}
                                    placeholder='Minutes'
                                    placeholderTextColor={'grey'}
                                    onChangeText={(minutes) => setMinutes(minutes)}
                                    value={minutes}
                                    defaultValue='0'
                                />                               
                            </View>
                            <TouchableOpacity 
                                    style={{marginLeft: 5, marginTop: 10, padding: 10, borderWidth: 0.3, borderRadius: 5, backgroundColor: '#E5DCC5', justifyContent: 'center',}}
                                    onPress={() => {
                                        const timeToComplete = minutes;
                                        if(timeToComplete != ''){
                                            setAddTimeToComplete(timeToComplete);
                                            // console.log('time to complete:' + timeToComplete);
                                            
                                        }else{
                                            alert('Minutes field cannot be empty!');
                                        };                                   
                                    }}    
                                >
                                    <Text>Confirm</Text>
                            </TouchableOpacity> 

                            {addTimeToComplete != '' ? 
                            <Text style={{paddingTop: 15, fontSize: 16, color: '#CC7722'}}>{addTimeToComplete + ' (mins)'}</Text>
                             : <View></View>}
                            <Text style={{paddingTop: 15, fontSize: 16, marginBottom: 5,}}>Add to a List:</Text>
                            <SelectDropdown 
                                data={listDropDown}
                                onSelect={(selectedItem) => {
                                    setAddBelongsTo(selectedItem);
                                  }}
                                buttonTextStyle={{fontSize: 15,}}
                                renderDropdownIcon={isOpened => {
                                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                }}
                                dropdownIconPosition={'right'}
                            />

                            <TouchableOpacity onPress={() =>cancelAddTaskPressed()}>
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
            </View>
    )
}

export default Home;