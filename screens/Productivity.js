import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { firebase } from '../firebase/config';
import { BarChart, ProgressChart, StackedBarChart } from 'react-native-chart-kit';
import {} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';


const Productivity = () => {

    // console.log(listRef.length);

    // // for managing tasks
    const [allTasks, setAllTasks] = useState([]);
    const tasksRef = firebase.firestore().collection('tasks');

    const [completedTasks, setCompletedTasks] = useState([]);
    // const completedTasksRef = firebase.firestore().collection('completedTasks');

    //get all tasks
    useEffect(() => {
        //for all tasks
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
                setAllTasks(tasks);
            }
        });

        // //for completed tasks
        // completedTasksRef.orderBy('dateCreated', 'asc').onSnapshot({
        //     error: (e) => console.log(e),
        //     next: (querySnapshot) => {
        //         const tasks = [];
        //         querySnapshot.forEach((doc) => {
        //             const {name} = doc.data()
        //             tasks.push({
        //                 id: doc.id,
        //                 name,
        //             })
        //         })
        //         setCompletedTasks(tasks);
        //     }
        // });

        // console.log('All Tasks: ' + allTasks.length);
        // console.log('Completed Tasks: ' + completedTasks.length);
    });

    // const completionPercentage = ((completedTasks.length)/(allTasks.length))*100;

    

    //chart styling 
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

      // data for chart
      const data = {
        labels: ["Swim", "Bike", "Run"], // optional
        data: [0.4, 0.6, 0.8]
      };

    return(
        <ScrollView style={styles.container}> 

            {/* progress chart card */}
            <View style={styles.subContainer}>
                <Text style={styles.headerText}>Daily</Text>
                <View style={styles.chartContainer}>
                    <ProgressChart
                        data={data}
                        width={350}
                        height={220}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    />
                </View>
                <Text style={[styles.headerText, {fontSize: 18,}]}>Summary</Text>
                <Text style={styles.bodyText}>Total Tasks: {allTasks.length}</Text>
                {/* <Text style={styles.bodyText}>Completed Tasks: {completedTasks.length}</Text> */}
                {/* <Text style={styles.bodyText}>Completion Rate: {completionPercentage}%</Text> */}
                <Text>HELLO</Text>
            </View>

            {/* progress chart card */}
            {/* <View style={styles.subContainer}>
                <Text style={styles.headerText}>Weekly</Text>
                <View style={styles.chartContainer}>
                    <ProgressChart
                        data={data}
                        width={350}
                        height={220}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    />
                </View>
                <Text style={[styles.headerText, {fontSize: 18,}]}>Summary</Text>
                <Text style={styles.bodyText}>Total Tasks: 50</Text>
                <Text style={styles.bodyText}>Completed Tasks: 50</Text>
                <Text style={styles.bodyText}>Completion Rate: 100%</Text>
            </View> */}

          {/* progress chart card */}
          {/* <View style={styles.subContainer}>
                <Text style={styles.headerText}>Monthly</Text>
                <View style={styles.chartContainer}>
                    <ProgressChart
                        data={data}
                        width={350}
                        height={220}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    />
                </View>
                <Text style={[styles.headerText, {fontSize: 18,}]}>Summary</Text>
                <Text style={styles.bodyText}>Total Tasks: 100</Text>
                <Text style={styles.bodyText}>Completed Tasks: 100</Text>
                <Text style={styles.bodyText}>Completion Rate: 100%</Text>
            </View> */}
        </ScrollView>
    )
}

export default Productivity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DCC5',
        borderRadius: 15,
    },
    subContainer: {
        backgroundColor: '#0B3948',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 15,
        width: '90%',
        
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
        color: '#CC7722',

    },
    chartContainer: {
        marginBottom: 10,
        marginHorizontal: 5,
    },
    bodyText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        padding: 5,
        color: '#CC7722',
    },


});