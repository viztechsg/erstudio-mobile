const navigationOption = ({ navigation }) => ({

    headerBackTitle: ' ',
    headerBackTitleVisible: true,
    headerStyle: {
        backgroundColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            height: 1,
        },
        shadowRadius: 5,
    },
    headerTintColor: 'black',
    headerTitleStyle: {
        fontSize: 18,
        fontWeight: '500',
    },
});

export default navigationOption;