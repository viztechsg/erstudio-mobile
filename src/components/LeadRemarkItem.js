import React from "react";
import {
    Text,
    View,
    StyleSheet
}
    from "react-native";
const LeadRemarkItem = ({ item }) => {

    return (
        <View style={styles.wrapper}>
            <View style={{ flexDirection: 'row', flex: 1,flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <View style={{width: '33%'}}>
                    <Text style={{ color: 'black', fontSize: 20, marginTop:-7 }}>
                        {item.client}
                    </Text>
                </View>
                <View style={{width: '33%', alignItems:'center'}}>
                    <Text style={{ color: 'black', fontSize: 12 }}>
                        Lead: {item.salesman}
                    </Text>
                </View>
                <View style={{width: '33%', alignItems:'flex-end'}}>
                    <Text style={{ color: 'grey', fontSize: 10 }}>
                        5 mins ago
                    </Text>
                </View>
            </View>
            <View style={{flex:1, width:'80%', marginTop:-30}}>
                <Text style={{color:'grey', fontSize:14}}>
                    {item.title}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        height: 100,
        padding: 10,
        //flexDirection: 'row',
        margin: 2,
        borderRadius:5
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%'
    },
    col_2: {
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10
    }
});

export default LeadRemarkItem;
