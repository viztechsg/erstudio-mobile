import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    wrapper:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 20,
    },
    imgContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    logoImg: {
        width: 200, 
        height: 200, 
        marginTop: -100
    },
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
        alignItems: "center",
        justifyContent: "space-between"
    },
    labelLogin: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15
    },
    loginText: {
        color: '#707070', 
        fontSize: 24, 
        letterSpacing: 5
    },
    inputSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        marginBottom: 10
    },
    rememberSection: {
        flexDirection: 'row',
        //justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#fff',
        height: 50,
        marginBottom: 10
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    buttonSection: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#fff',
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        shadowColor: 'black',
        shadowRadius: 100,
        shadowOpacity: 100,
        borderWidth: 1,
        borderColor: '#7070'
    },
    textButton: {
        color: '#707070',
        fontWeight: '600',
        fontSize: 20,

    }
});