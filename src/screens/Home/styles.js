import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
        height: 70,
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop:-10
    },
    wrapper2: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'space-around',
        marginHorizontal: -2,
        flexWrap: 'wrap',
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
        padding: 15

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
        fontSize: 45, 
        color: 'white' 
    }

});