import React, { useState } from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity
}
    from "react-native";
import { Card, Badge } from 'react-native-elements';
import moment from 'moment';
const ProjectProgressItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <Text style={{color:'black',fontSize:16}}>{props.category}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        height: 70,
        padding: 20,
        flexDirection: 'row',
        margin: 1,
        borderColor:'#d3d3d3',
        borderWidth:3,
        borderRadius:3,
        alignItems:'center'
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%'
    },
    col_2: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        paddingRight: 10,
        flexDirection: 'row'
    }
});

export default ProjectProgressItem;
