import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, Image, Button} from 'react-native';

const ListView = ({navigation}) => {
    return(
        <View>
            <Text>ListView</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    )
}

export default ListView;

const styles = StyleSheet.create({
    container: {

    },


});