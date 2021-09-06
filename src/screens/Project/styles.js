import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
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

    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    headerCard: {
        margin: 3,
        marginTop: 20,
        width: '48%',
        borderRadius: 20,
        borderWidth: 2
    },
    leadHeader: {
        backgroundColor: 'black',
        height: 60,
        marginTop: 20,
        margin: -20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    followCard: {
        fontSize: 40, color: '#FFD633'

    },
    defaultCard: {
        fontSize: 40, color: '#D1D1D1'
    },
    returnCard: {
        fontSize: 40, color: '#FF6A6A'

    },
    textFollowCard: {
        color: '#FFD633'
    },
    textDefaultCard: {
        color: '#D1D1D1'
    },
    textReturnCard: {
        color: '#FF6A6A'
    },
    followCardBorder: {
        borderColor: '#FFD633'
    },
    defaultCardBorder: {
        borderColor: '#D1D1D1'
    },
    returnCardBorder: {
        borderColor: '#FF6A6A'
    },
    badgeFollowBg: {
        backgroundColor: '#FFD633'
    },
    badgeReturnBg: {
        backgroundColor: '#FF6A6A'
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        height: 85,
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    wrapper2: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: 'space-around',
        marginHorizontal: -2,
        flexWrap: 'wrap'
    },
    item: {
        width: '38%',
        padding: 2,
    },
    heading: {
        fontSize: 16,
        color: "#707070",
        fontWeight: 'bold'
    },
    labelText: {
        fontSize: 14,
        color: "#D2D2D2",
        fontWeight: 'bold',
        marginTop: 5
    },
    card: {
        width: '48%',
        backgroundColor: '#202020',
        color: 'white',
        borderRadius: 5,
        height: 160,
        padding: 15,
        justifyContent:'center',
        alignItems:'center'

    },
    cardContent:{
        borderBottomWidth: 2, 
        borderBottomColor: 'grey', 
        paddingBottom: 5
    },
    column_2: {
        width: '50%'
    },
    roundedContainer: {
        overflow: "hidden",
        borderRadius: 50,
        alignItems: 'center'
    },
    innerWhiteText: { 
        fontSize: 30, 
        color: 'white' 
    }
});