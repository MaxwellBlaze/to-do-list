import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DCC5',
        borderRadius: 15,
    },
    headerContainer: {
        justifyContent: 'center',
        marginTop: '10%',
        marginBottom: 10,
        paddingVertical: '3%',
        borderBottomWidth: 1,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#0B3948',
        textAlign: 'center',
    },
    bodyContainer: {
        justifyContent: 'center',
        height: '80%',

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
        bottom: 10,
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
        justifyContent: 'center',
        alignItems: "center",
        // marginTop: '10%',
        height: '90%',
      },
      modalView: {
        borderWidth: 0.3,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
      },
      textInput: {
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

export default styles;