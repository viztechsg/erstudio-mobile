import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, CheckBox, Button, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import generalStyle from '../../general/Styles/generalStyle'
import styles from './styles';
import { Card, Badge } from 'react-native-elements';
import { leads } from '../../dummy/data/leadsData';
import LeadItem from '../../components/LeadItem';
import Swipeout from "react-native-swipeout";
import SwipeoutButton from '../../components/SwipeoutButton';
const HomeScreen = ({ props, navigation }) => {

  const [follow, setFollow] = useState(true);

  const followOrReturn = () => {
    setFollow(!follow);
  };

  const leadDeletePress = () =>
    Alert.alert(
      "Delete Lead",
      "Are you sure want to delete this lead?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: true }
    );

  let swipeoutBtns = [
    {
      component: <SwipeoutButton onDeletePress={() => leadDeletePress()} onEditPress={() => navigation.navigate('LeadEdit')} />,
    }
  ];
  
  return (
    <View style={generalStyle.bodyContainer}>
      <View>
        <Text style={{ fontSize: 20 }}>Welcome back, David</Text>
      </View>
      <View style={styles.headerContainer}>

        <Card containerStyle={[follow ? styles.followCardBorder : styles.defaultCardBorder, styles.headerCard]}>
          <TouchableOpacity onPress={() => followOrReturn()}>
            <View style={{ height: 90 }}>
              <Text style={follow ? styles.followCard : styles.defaultCard}>
                12
              </Text>
              <Text style={follow ? styles.textFollowCard : styles.textDefaultCard}>
                Leads to follow up
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
        <Card containerStyle={[!follow ? styles.returnCardBorder : styles.defaultCardBorder, styles.headerCard]}>
          <TouchableOpacity onPress={() => followOrReturn()}>
            <View style={{ height: 90 }}>
              <Text style={!follow ? styles.returnCard : styles.defaultCard}>
                20
              </Text>
              <Text style={!follow ? styles.textReturnCard : styles.textDefaultCard}>
                Returning Leads
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

      </View>
      <View style={styles.leadHeader}>
        <View style={{ alignItems: 'flex-start', width: '50%' }}>
          <Text style={{ letterSpacing: 5, color: 'white', }}>
            YOUR LEADS
            </Text>
        </View>
        <View style={{ alignItems: 'flex-end', width: '50%', paddingRight: 10 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('List') }}>
            <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
              View All <Icon name='right' />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 22, margin: -20, flex: 1 }}>
        <FlatList
          data={leads}
          renderItem={({ item }) => {
            return (
              <Swipeout
                right={swipeoutBtns}
                autoClose
              >
                <LeadItem status={follow} item={item} onViewPress={() => navigation.navigate('LeadView')} />
              </Swipeout>
            )
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
