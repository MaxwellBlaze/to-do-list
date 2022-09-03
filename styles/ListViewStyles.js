import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DCC5',
        borderRadius: 15,
        marginTop: 10,
    },
    headerContainer: {
        justifyContent: 'center',
        backgroundColor: '#0B3948',
        marginBottom: 10,
        paddingVertical: '3%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
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
        justifyContent: 'center',
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
        justifyContent: "center",
        alignItems: "center",
        marginTop: '50%',
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
      task: {
        borderWidth: 0.3, 
        margin:5,
        borderRadius: 10,
        backgroundColor: 'white',
      },
});

export default styles;