import React, { useState, useEffect, } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Keyboard, Modal, Alert, } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Swipeable } from 'react-native-gesture-handler';
import  SwitchSelector  from "react-native-switch-selector";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { firebase } from '../firebase/config';
import { FontAwesome } from '@expo/vector-icons';
import * as PushNotifications from './PushNotifications';
import styles from '../styles/ListViewStyles';

const ListView = ({route}) => {
    const listName = route.params.listName;

    // for checkbox
    const [isChecked, setChecked] = useState(false);

    //for managing lists
    const [allTasks, setAllTasks] =useState([]);

    // for managing tasks
    const [tasks, setTasks] = useState([]);
    const tasksRef = firebase.firestore().collection('tasks');
    const completedTasksRef = firebase.firestore().collection('completedTasks');
    const [selectedTask, setSelectedTask] = useState({});

    // if coming from All Tasks button,
    // set to allTasks, else set to tasks
    var useData = [];

    //add states for all task properties
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState(1);
    const [timeAndDate, setTimeAndDate] = useState('');
    const [timeToComplete, setTimeToComplete] = useState('');
    const [minutes, setMinutes] = useState('0');
    const [belongsTo, setBelongsTo] = useState(listName);

    //for +Task modal
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

    //for Edit Task modal
    const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);

    //for date picker modal
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false);

    //get data from firebase
    useEffect(() => {
        //for tasks
        tasksRef
        .where('belongsTo', '==', listName)
        .orderBy('timeAndDate', 'asc')
        .orderBy('priority', 'desc')
        .orderBy('timeToComplete', 'desc')
        .onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    tasks.push({
                        id: doc.id,
                        name: doc.data().name,
                        priority: doc.data().priority,
                        timeAndDate: doc.data().timeAndDate,
                        timeToComplete: parseInt(doc.data().timeToComplete),
                        isCompleted: doc.data().isCompleted,
                        belongsTo: doc.data().belongsTo,
                        dateCreated: doc.data().dateCreated,
                    })
                })
                setTasks(tasks);
                // console.log(tasks)
            }
        });

        //for tasks
        tasksRef
        .orderBy('timeAndDate', 'asc')
        .orderBy('priority', 'desc')
        .orderBy('timeToComplete', 'desc')
        .onSnapshot({
            error: (e) => console.log(e),
            next: (querySnapshot) => {
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    tasks.push({
                        id: doc.id,
                        name: doc.data().name,
                        priority: doc.data().priority,
                        timeAndDate: doc.data().timeAndDate,
                        timeToComplete: parseInt(doc.data().timeToComplete),
                        isCompleted: doc.data().isCompleted,
                        belongsTo: doc.data().belongsTo,
                        dateCreated: doc.data().dateCreated,
                    })
                })
                setAllTasks(tasks);
                // console.log(allTasks);
            }
        });


    }, []);

    //if user pressed All Tasks button
    //on home screen, render all tasks
    if(listName == 'All Tasks'){
        useData = allTasks;
    }else{
        useData = tasks;
    };

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
        if(taskName && taskName.length > 0){
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            // need to edit this part
            const data = {
                name: taskName,
                priority: priority,
                timeAndDate: timeAndDate,
                timeToComplete: parseInt(timeToComplete),
                isCompleted: false,
                belongsTo: belongsTo,
                dateCreated: timestamp,
            };
            tasksRef
            .add(data)
            .then(() => {
                setTaskName('');
                setPriority(1);
                setTimeAndDate('');
                setTimeToComplete('');
                setBelongsTo(listName);
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
        const tempDate = timeAndDate.toLocaleString('en-GB');
        // console.log(tempDate);
        var hour = tempDate.slice(11,14);
        // console.log(hour);
        var mins = tempDate.slice(15,17);
        // console.log(mins);
        var dayDate = tempDate.slice(0,10);
        // console.log(dayDate);       
        //index [0] - day, [1] - month, [2] - year
        let dateArray = dayDate.split('/');   
        PushNotifications.schedulePushNotification(dateArray[2], dateArray[1], dateArray[0], hour, mins, taskName);
    };

    const updateTask = (task) => {
        if(editTaskModalVisible){
            tasksRef
            .doc(task.id)
            .update({
                name: taskName,
                priority: priority,
                timeAndDate: timeAndDate,
                timeToComplete: parseInt(timeToComplete),
                isCompleted: task.isCompleted,
                belongsTo: task.belongsTo,
                dateCreated: task.dateCreated,
            }).then(() => {
                //console.log('task updated');
                setTaskName('');
                setPriority(1);
                setTimeAndDate('');
                setTimeToComplete('');
                setMinutes('');
                Keyboard.dismiss();
            }).catch((error) => {
                alert(error);
            })
        }
        setEditTaskModalVisible(!editTaskModalVisible);
        setSelectedTask({});
    };

    const cancelButtonPressed = () => {
        setAddTaskModalVisible(false);
        setEditTaskModalVisible(false);
        setTaskName('');
        setPriority(1);
        setTimeAndDate('');
        setTimeToComplete('0');
        setBelongsTo(listName);
        setSelectedTask({});
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
                    onPress={ () => setEditTaskModalVisible(true) }
                />
            </View>
        );
    };

    const checkboxIsChecked = (item) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        tasksRef
        .doc(item.id)
        .update({
            isCompleted: true,
            dateCompleted: timestamp,
        })
        .then(() => {
            // console.log('set isCompleted');
        })
        .catch((error) => {
            console.log(error);
        });

        completedTasksRef
        .add(item)
        .then(() => {
            // console.log('added to completed tasks');
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // const smartSortButtonPressed = () => {
    //     tasksRef
    //     .where('belongsTo', '==', listName)
    //     .orderBy('priority', 'desc')
    //     .orderBy('timeAndDate', 'desc')
    //     .orderBy('timeToComplete', 'desc')
    // };

    return(
        <View style={styles.container}>
            {/* title */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {listName}
                </Text>
            </View>

            {/* Flatlist of tasklists */}
            <View style={styles.bodyContainer}>
                <FlatList
                    data={useData}
                    numColumns={1}
                    renderItem={({item}) => (
                        
                        <Swipeable
                            renderRightActions={() => rightSwipeActions(item)}
                            renderLeftActions={() => leftSwipeActions(item)}
                            onSwipeableOpen={(left) => setSelectedTask(item)}
                        >
                            <View style={[styles.task, {flexDirection: 'row',}]}>
                                <View style={{flexDirection: 'column', borderRightWidth: 0.5, padding: 5, flex:1,}}>
                                    {/* task name */}
                                    <Text style={{textAlign: 'center', padding: 1, fontSize: 18, fontWeight: 'bold', borderBottomWidth: 1,}}>
                                        {item.name}
                                    </Text>

                                    {/* priority */}
                                    {item.priority == 2 ? 
                                    <View style={{borderTopWidth: 0.5, borderBottomWidth: 0.5, backgroundColor: 'yellow'}}>
                                        <Text style={{textAlign: 'center', padding: 5, fontSize: 15, color: 'yellow'}}>
                                            {/* {'Priority: ' + item.priority} */}
                                        </Text> 
                                    </View> : item.priority == 3 ? 
                                    <View style={{borderTopWidth: 0.5, borderBottomWidth: 0.5, backgroundColor: 'red'}}>
                                        <Text style={{textAlign: 'center', padding: 5, fontSize: 15, color: 'red'}}>
                                            {/* {'Priority: ' + item.priority} */}
                                        </Text> 
                                    </View> : 
                                    <View style={{borderTopWidth: 0.5, borderBottomWidth: 0.5, backgroundColor: 'green'}}>
                                        <Text style={{textAlign: 'center', padding: 5, fontSize: 15, color: 'green'}}>
                                            {/* {'Priority: ' + item.priority} */}
                                        </Text> 
                                    </View> }


                                    {/* est. time to complete */}
                                    {!isNaN(item.timeToComplete) ? 
                                    <View style={{borderTopWidth: 0,}}>
                                        <Text style={{textAlign: 'center', padding: 5, fontSize: 15,}}>
                                            {'Est. Time to Complete: ' + item.timeToComplete + '(mins)'}
                                        </Text> 
                                    </View> : <View></View>}

                                    

                                    {/* deadline */}
                                    {item.timeAndDate != '' ? 
                                    <View style={{borderTopWidth: 0.5,}}>
                                        <Text style={{textAlign: 'center', padding: 5, fontSize: 15,}}>
                                            {'Deadline: ' + item.timeAndDate.toDate()}
                                        </Text> 
                                    </View> : <View></View>}
                                </View>
                                <Checkbox
                                    style={{alignSelf: 'center', margin: 10,}}
                                    //change to item.isCompleted
                                    value={item.isCompleted}
                                    //change to onChecked function, to be implemented
                                    onValueChange={() => checkboxIsChecked(item)}
                                    color={isChecked ? 'green' : undefined}
                                />                               

                            </View>
                            
                            
                        </Swipeable> 
                    )}
                />
            </View>   

            <View style={styles.buttonsContainer}>
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
                                onChangeText={(name) => setTaskName(name)}
                                value={taskName}
                            />

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Priority:</Text>
                            
                            <SwitchSelector 
                                initial={0}
                                onPress={(value) => setPriority(value)}
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
                                        setTimeAndDate(date);
                                        // console.log('Date Time Picker confirm pressed');
                                        // console.log('datetime set:' + date.toString());
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
                                    {timeAndDate
                                        .toLocaleString([], {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                            

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Est. time to complete task (mins):</Text>
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
                                        const ttc = minutes;
                                        if(ttc != ''){
                                            setTimeToComplete(ttc);
                                            // console.log('time to complete:' + timeToComplete);
                                            
                                        }else{
                                            alert('Minutes fields cannot be empty!');
                                        };                                   
                                    }}    
                                >
                                    <Text>Confirm</Text>
                            </TouchableOpacity>
                            
                            {timeToComplete != '' ? 
                            <Text style={{paddingTop: 15, fontSize: 16, color: '#CC7722'}}>{timeToComplete + ' (mins)'}</Text>
                             : <View></View>}

                            <TouchableOpacity onPress={() =>cancelButtonPressed()}>
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

            {/* edit task modal */}
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editTaskModalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setEditTaskModalVisible(false);
                    }}
                >

                    <View style={[styles.centeredView, {marginTop: "10%",}]}>
                        <View style={[styles.modalView, {margin: 20,}]}>

                            <Text style={[styles.headerText, {color: '#0B3948'}]}>Edit Task</Text>
                                
                            <TextInput 
                                style={styles.textInput}
                                placeholder='Task Name'
                                placeholderTextColor={'grey'}
                                onChangeText={(name) => setTaskName(name)}
                                value={taskName}
                            />

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Priority:</Text>
                            
                            <SwitchSelector 
                                initial={0}
                                onPress={(value) => setPriority(value)}
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
                                        setTimeAndDate(date);
                                        // console.log('Date Time Picker confirm pressed');
                                        // console.log('datetime set:' + date.toString());
                                    }}
                                    
                                    onCancel={() => {
                                        setOpenDateTimePicker(false);
                                        // console.log('Date Time Picker cancel pressed');
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
                                    {timeAndDate
                                        .toLocaleString([], {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                            

                            <Text style={{paddingTop: 15, fontSize: 16,}}>Est. time to complete task (mins):</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                                 <TextInput 
                                    style={styles.textInput}
                                    placeholder='0'
                                    placeholderTextColor={'grey'}
                                    onChangeText={(minutes) => setMinutes(minutes)}
                                    value={minutes}
                                    defaultValue={selectedTask.timeToComplete}
                                />
                                
                            </View>

                            <TouchableOpacity 
                                    style={{marginLeft: 5, marginTop: 10, padding: 10, borderWidth: 0.3, borderRadius: 5, backgroundColor: '#E5DCC5', justifyContent: 'center',}}
                                    onPress={() => {
                                        const ttc = minutes;
                                        if(ttc != ''){
                                            setTimeToComplete(ttc);
                                            // console.log('time to complete:' + timeToComplete);
                                            
                                        }else{
                                            alert('Minutes fields cannot be empty!');
                                        };                                   
                                    }}    
                                >
                                    <Text>Confirm</Text>
                            </TouchableOpacity>
                            
                            {timeToComplete != '' ? 
                            <Text style={{paddingTop: 15, fontSize: 16, color: '#CC7722'}}>{timeToComplete + ' (mins)'}</Text>
                             : <View></View>}

                            <TouchableOpacity onPress={() =>cancelButtonPressed()}>
                                <View style={[styles.button, {marginTop: 30, backgroundColor: 'maroon', }]}>
                                    <Text style={[styles.buttonText, {fontSize: 16,}]}>Cancel</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => updateTask(selectedTask)}>
                                <View style={[styles.button, {marginTop: 30}]}>
                                    <Text style={[styles.buttonText, {fontSize: 16, paddingHorizontal: 10,}]}>Edit</Text>
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