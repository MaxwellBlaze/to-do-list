import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { firebase } from '../firebase/config';
import { BarChart, ProgressChart, StackedBarChart } from 'react-native-chart-kit';
import {} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';


const Productivity = () => {

    // // for managing tasks
    const [allTasks, setAllTasks] = useState(0);
    const tasksRef = firebase.firestore().collection('tasks');

    const [completedTasks, setCompletedTasks] = useState(0);
    const completedTasksRef = firebase.firestore().collection('completedTasks');
    const [completionPercentage, setCompletionPercentage] = useState(0);

    //get all tasks
    useEffect(() => {

        tasksRef.onSnapshot(snap =>{
            size = snap.size;
            setAllTasks(size);
        });
        completedTasksRef.onSnapshot(snap =>{
            size = snap.size;
            setCompletedTasks(size);
        });
        setCompletionPercentage(completedTasks/(allTasks));
    });

    //chart styling 
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

      // data for chart
      const data = {
        labels: ["Done"], // optional
        data: [completionPercentage]
      };

    return(
        <ScrollView style={styles.container}> 

            {/* progress chart card */}
            <View style={styles.subContainer}>
                <Text style={styles.headerText}>Tracker</Text>
                <View style={styles.chartContainer}>
                    {completionPercentage == 0? null : <ProgressChart
                        data={data}
                        width={330}
                        height={220}
                        strokeWidth={16}
                        radius={48}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    />}
                    
                </View>
                <Text style={[styles.headerText, {fontSize: 18,}]}>Summary</Text>
                <Text style={styles.bodyText}>Total Tasks: {allTasks}</Text>
                <Text style={styles.bodyText}>Completed Tasks: {completedTasks}</Text>
                <Text style={styles.bodyText}>Completion Rate: {(completionPercentage*100).toPrecision(2)}%</Text>
            </View>
        </ScrollView>
    )
};

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