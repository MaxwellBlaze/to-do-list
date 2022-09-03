import { StyleSheet } from "react-native";

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

export default styles;