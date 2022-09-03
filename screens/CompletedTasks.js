import React, {useState, useEffect,} from 'react';
import { View, Text, FlatList } from 'react-native';
import { firebase } from '../firebase/config';
import styles from '../styles/ListViewStyles';

const CompletedTasks = () => {
    const completedTasksRef = firebase.firestore().collection('tasks').where('isCompleted', '==', true);
    const [tasks, setTasks] = useState([]);
    
    //get data from firebase
    useEffect(() => {
        //for tasks
        completedTasksRef
        .orderBy('dateCompleted', 'desc')
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
    });

    return(
        <View style={styles.container}>
            {/* Flatlist of tasklists */}
            <View style={styles.bodyContainer}>
                <FlatList
                    data={tasks}
                    numColumns={1}
                    renderItem={({item}) => (
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
                            </View>                       
                    )}
                />
            </View>
        </View>
    )
}

export default CompletedTasks;