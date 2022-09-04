import React, { useState, useEffect, } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { firebase } from '../firebase/config';
import { ProgressChart } from 'react-native-chart-kit';
import styles from '../styles/ProductivityStyles';

const Productivity = () => {

    // // for managing tasks
    const [allTasks, setAllTasks] = useState(0);
    const tasksRef = firebase.firestore().collection('tasks');
    const [completedTasks, setCompletedTasks] = useState(0);
    const completedTasksRef = firebase.firestore().collection('tasks').where('isCompleted', '==', true);
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
        <View style={styles.container}> 

            {/* progress chart card */}
            <View style={styles.subContainer}>
                <Text style={styles.headerText}>Completed Tasks</Text>
                <View style={styles.chartContainer}>
                    {completionPercentage == 0 || completionPercentage == NaN? <ProgressChart
                        data={{
                            // labels: ["Done"], // optional
                            data: [0]
                          }}
                        width={330}
                        height={220}
                        strokeWidth={16}
                        radius={48}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    /> : 
                    <ProgressChart
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
                {completionPercentage == NaN || completionPercentage == 0? 
                <Text style={styles.bodyText}>Completion Rate: 0%</Text> :
                <Text style={styles.bodyText}>Completion Rate: {(completionPercentage*100).toPrecision(3)}%</Text>
                }
                
            </View>
        </View>
    )
};

export default Productivity;