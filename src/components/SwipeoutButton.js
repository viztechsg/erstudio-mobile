import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Picker,
    TouchableOpacity
}
    from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
const SwipeoutButton = props => {

    return (
        <View style={styles.wrapper}>
            <View style={styles.item}>
                <TouchableOpacity onPress={() => {props.onEditPress()} }>
                    <Icon name="edit" size={20} color='#FFD633' style={styles.icon} />
                </TouchableOpacity>
                
            </View>

            <View style={styles.item}>
                <TouchableOpacity onPress={() => { props.onDeletePress() }}>
                    <Icon name="delete" size={20} color='red' style={styles.icon} />
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%',
        borderColor: '#f3f3f3',
        borderWidth: 1
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '50%'
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SwipeoutButton;
