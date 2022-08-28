import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, Text, Image, Button, FlatList, TouchableOpacity, TextInput, Keyboard, Modal, Alert, Picker } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import  SwitchSelector  from "react-native-switch-selector";
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ListView = ({route, navigation}) => {
    // console.log(route);
    const listName = route.params.listName;

    //for managing lists
    const [lists, setLists] = useState(['']);
    const listsRef = firebase.firestore().collection('lists');
    const [listDropDown, setListDropDown] = useState([]);
    //add a state for selected list
    const [selectedList, setSelectedList] = useState();

    // for managing tasks
    const [tasks, setTasks] = useState([]);
    const tasksRef = firebase.firestore().collection('tasks');
    // const currentTaskList = firebase.firestore().query(tasksRef, where('belongsTo', '==', listName));
    // const currentTaskList = tasksRef.whereEqualTo('belongsTo', listName);

    //add states for all task properties
    const [addTaskName, setAddTaskName] = useState('');
    const [addPriority, setAddPriority] = useState('low');
    const [addTimeAndDate, setAddTimeAndDate] = useState('');
    const [addTimeToComplete, setAddTimeToComplete] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [addBelongsTo, setAddBelongsTo] = useState(listName);

    //states for editing tasks
    const [editTaskName, setEEditTaskName] = useState('');
    const [editPriority, setEditPriority] = useState('low');
    const [editTimeAndDate, setEditTimeAndDate] = useState('');
    const [editTimeToComplete, setEditTimeToComplete] = useState('');
    const [editHours, setEditHours] = useState('');
    const [editMinutes, setEditMinutes] = useState('');
    const [editBelongsTo, setEditBelongsTo] = useState(listName);

    //for +Task modal
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

    //for date picker modal
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);

    //get data from firebase
    useEffect(() => {
        //for lists
        listsRef.orderBy('dateCreated', 'asc').onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const lists = [];
                querySnapshot.forEach((doc) => {
                    const {name} = doc.data()
                    lists.push({
                        id: doc.id,
                        name,
                    })
                })
                setLists(lists);
            }
        });

        if(lists.length > 0) {
            const list = [];
            lists.forEach((doc) => {
                const name = doc.name;
                list.push(name);
            })
            setListDropDown(list);
        };

        //for tasks
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

    }, []);

    //delete a task
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

    //add a task
    const addNewTask = () => {
        if(addTaskName && addTaskName.length > 0){
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            // need to edit this part
            const data = {
                name: addTaskName,
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
                setAddPriority('low');
                setAddTimeAndDate('');
                setAddTimeToComplete('');
                setAddBelongsTo('');
                setHours('');
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
    };

    const cancelAddTaskPressed = () => {
        setAddTaskModalVisible(!addTaskModalVisible);
        setAddTaskName('');
        setAddPriority('');
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
                    onPress={ () => deleteTask(item) }
                />
            </View>
        );
    };

    const leftSwipeActions = (item) => {
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
                    name='edit'
                    color='#0B3948'
                    size={30}
                    // change to open edit task modal
                    onPress={ () => deleteTask(item) }
                />
            </View>
        );
    };

    return(
        <View style={styles.container}>
            {/* title */}
            {/* <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {listName}
                </Text>
            </View> */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {listName}
                </Text>
            </View>

            {/* Flatlist of tasklists */}
            <View style={styles.bodyContainer}>
                <FlatList 
                    data={tasks}
                    numColumns={1}
                    renderItem={({item}) => (
                        
                        <Swipeable
                            renderRightActions={() => rightSwipeActions(item)}
                            renderLeftActions={() => leftSwipeActions(item)}
                        >
                            <View style={styles.task}>
                                <Text style={{textAlign: 'center', paddingTop: 5, fontSize: 18,}}>{item.name}</Text>
                            </View>
                        </Swipeable> 
                    )}
                />
            </View>   

            <View style={styles.buttonsContainer}>
                {/* To do: onPress function--> bring user to all tasks (ListView) page */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setAddTaskModalVisible(true)}
                >
                    <Text style={styles.buttonText}>
                        + Task
                    </Text>
                </TouchableOpacity>
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

                            <Text style={[styles.headerText, {color: '#0B3948'}]}>Add A Task</Text>
                                
                            <TextInput 
                                style={styles.textInput}
                                placeholder='Task Name'
                                placeholderTextColor={'grey'}
                                onChangeText={(name) => setAddTaskName(name)}
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
                                    isVisible={openDateTimePicker}
                                    date={new Date()}
                                    onConfirm={(date) => {
                                        setOpenDateTimePicker(false);
                                        setAddTimeAndDate(date);
                                        console.log('Date Time Picker confirm pressed');
                                        console.log('datetime set:' + date.toString());
                                    }}
                                    
                                    onCancel={() => {
                                        setOpenDateTimePicker(false);
                                        console.log('Date Time Picker cancel pressed');
                                    }}
                                    // onConfirm={()=>{console.log('on confirm')}}
                                    // onCancel={()=>{setOpenDateTimePicker(false); console.log('on cancel')}}
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
                            

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Set estimated time to complete task:</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                                <TextInput 
                                    style={[styles.textInput, {marginRight: 10,}]}
                                    placeholder='Hours'
                                    placeholderTextColor={'grey'}
                                    onChangeText={(hours) => setHours(hours)}
                                    value={hours}
                                />
                                 <TextInput 
                                    style={styles.textInput}
                                    placeholder='Minutes'
                                    placeholderTextColor={'grey'}
                                    onChangeText={(minutes) => setMinutes(minutes)}
                                    value={minutes}
                                />
                                
                            </View>

                            <TouchableOpacity 
                                    style={{marginLeft: 5, marginTop: 10, padding: 10, borderWidth: 0.3, borderRadius: 5, backgroundColor: '#E5DCC5', justifyContent: 'center',}}
                                    onPress={() => {
                                        const timeToComplete = hours + ':' + minutes;
                                        if(timeToComplete != ''){
                                            setAddTimeToComplete(timeToComplete);
                                            console.log('time to complete:' + timeToComplete);
                                            
                                        }else{
                                            alert('Hours and minutes fields cannot be empty!');
                                        };                                   
                                    }}    
                                >
                                    <Text>Confirm</Text>
                            </TouchableOpacity>
                            
                            <Text style={{paddingTop: 15, fontSize: 16, color: '#CC7722'}}>{addTimeToComplete + ' (hh:mm)'}</Text>

                            {/* <Text style={{paddingTop: 15, fontSize: 16, marginBottom: 5,}}>Add to a List:</Text>
                            <SelectDropdown 
                                data={listDropDown}
                                onSelect={(selectedItem, index) => {
                                    setAddBelongsTo(selectedItem);
                                    console.log(selectedItem, index);
                                  }}
                                buttonTextStyle={{fontSize: 15,}}
                                renderDropdownIcon={isOpened => {
                                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                }}
                                dropdownIconPosition={'right'}

                            /> */}


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

export default ListView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        backgroundColor: '#E5DCC5',
        borderRadius: 15,
        marginTop: 10,
        // padding: 15,
    },
    headerContainer: {
        //flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#0B3948',
        // marginTop: 10,
        marginBottom: 10,
        paddingVertical: '3%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // borderTopWidth: 0.3,
        borderBottomWidth: 1,
        // borderLeftWidth: 0.3,
        // borderRightWidth: 0.3,
        // borderWidth: 0.3,#CC7722
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
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
        justifyContent: 'center',
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
      task: {
        borderWidth: 0.3, 
        margin:10,
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'white',

      },


});