import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Container, Header, Body, Content } from 'native-base';
import { store } from './src/store/store';
import { Provider, useDispatch } from 'react-redux';
import { logout } from './src/actions/authAction';
//Navigation
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
//Screenns
import HomeScreen from './src/screens/Home/HomeScreen';
import LeadListScreen from './src/screens/Lead/LeadListScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import ResetPasswordScreen from './src/screens/ResetPassword/ResetPasswordScreen';
import LeadCreateScreen from './src/screens/Lead/LeadCreateScreen';
import HomeScreen2 from './src/screens/Home/HomScreen2';
import SalesListScreen from './src/screens/Sales/SalesListScreen'
//Custome Header
import homeOption from './src/general/Header/HomeHeader';
import { leadsEditOption, leadsOption, leadsViewOption } from './src/general/Header/LeadsHeader';
import { salesOption, salesViewOption, salesViewDocumentOption } from './src/general/Header/SalesHeader';
import LeadEditScreen from './src/screens/Lead/LeadEditScreen';
import LeadRemarkScreen from './src/screens/Lead/LeadRemarkScreen';
import LeadViewScreen from './src/screens/Lead/LeadViewScreen';
import SalesCreateScreen from './src/screens/Sales/SalesCreateScreen';
import SalesViewScreen from './src/screens/Sales/SalesViewScreen';
import SalesViewDocument from './src/screens/Sales/SalesViewDocument';
import SalesSignDocument from './src/screens/Sales/SalesSignDocument';
import SalesEditScreen from './src/screens/Sales/SalesEditScreen';
import ProjectListScreen from './src/screens/Project/ProjectListScreen';
import { projectOption, projectViewOption, projectProgressPhotosOption, projectProgressSinglePhotoOption, photoDetailOption, progressEditOption, progressInspectionListOption, progressInspectionEditOption, progressDefectListOption, progressDefectEditOption, projectDefectViewOption } from './src/general/Header/ProjectHeader';
import ProjectViewScreen from './src/screens/Project/ProjectViewScreen';
import ProjectProgressScreen from './src/screens/Project/Progress/ProjectProgressScreen';
import ProjectProgressPhotoScreen from './src/screens/Project/Progress/ProjectProgressPhotoScreen';
import ProgressSinglePhotoScreen from './src/screens/Project/Progress/ProgressSinglePhotoScreen';
import PhotoDetailScreen from './src/screens/Project/Progress/PhotoDetailScreen';
import ProgressCreateScreen from './src/screens/Project/Progress/ProgressCreateScreen';
import ProgressEditScreen from './src/screens/Project/Progress/ProgressEditScreen';
import InspectionListScreen from './src/screens/Project/Inspection/InspectionListScreen';
import InspectionCreateScreen from './src/screens/Project/Inspection/InspectionCreateScreen';
import InspectionEditScreen from './src/screens/Project/Inspection/InspectionEditScreen';
import DefectListScreen from './src/screens/Project/Defect/DefectListScreen';
import DefectCreationScreen from './src/screens/Project/Defect/DefectCreationScreen';
import DefectEditScreen from './src/screens/Project/Defect/DefectEditScreen';
import DefectViewScreen from './src/screens/Project/Defect/DefectViewScreen';

const authNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    ResetPassword: {
      screen: ResetPasswordScreen,
      navigationOptions: {
        title: ''
      }
    }
  },
  {
    initialRouteName: 'Login',
  }
);

const DashboardStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen2,
      navigationOptions: homeOption
    }
  }
);

const MarketingStack = createStackNavigator(
  {
    List: {
      screen: LeadListScreen,
      navigationOptions: leadsOption,
      params : {filterStatus : '', needAttention: ''}
    },
    LeadCreation: {
      screen: LeadCreateScreen,
      navigationOptions: {
        title: '',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowOpacity: 0.25,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 5,
        },
      }
    },
    LeadEdit: {
      screen: LeadEditScreen,
      navigationOptions: leadsEditOption
    },
    LeadRemark: {
      screen: LeadRemarkScreen,
      navigationOptions: {
        title: '',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowOpacity: 0.25,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 5,
        },
      }
    },
    LeadView: {
      screen: LeadViewScreen,
      navigationOptions: leadsViewOption
    },
  }
);

const SalesStack = createStackNavigator(
  {
    Sales: {
      screen: SalesListScreen,
      navigationOptions: salesOption
    },
    SalesCreation: {
      screen: SalesCreateScreen,
      navigationOptions: {
        title: '',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowOpacity: 0.25,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 5,
        },
      }
    },
    SalesView: {
      screen: SalesViewScreen,
      navigationOptions: salesViewOption
    },
    SalesViewDocument: {
      screen: SalesViewDocument,
      navigationOptions: salesViewDocumentOption
    },
    SalesSignDocument: {
      screen: SalesSignDocument,
      navigationOptions: {
        title: '',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowOpacity: 0.25,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 5,
        },
      }
    },
    SalesEdit: {
      screen: SalesEditScreen,
      navigationOptions: {
        title: '',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowOpacity: 0.25,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 5,
        },
      }
    },
  }
);

const ProjectStack = createStackNavigator(
  {
    Project: {
      screen: ProjectListScreen,
      navigationOptions: projectOption
    },
    ProjectView: {
      screen: ProjectViewScreen,
      navigationOptions: projectViewOption
    },
    ProjectProgress: {
      screen: ProjectProgressScreen,
      navigationOptions: projectViewOption
    },
    ProgressCreate: {
      screen: ProgressCreateScreen,
      navigationOptions: projectViewOption
    },
    ProgressEdit: {
      screen: ProgressEditScreen,
      navigationOptions: progressEditOption
    },
    ProjectProgressPhoto: {
      screen: ProjectProgressPhotoScreen,
      navigationOptions: projectProgressPhotosOption
    },
    ProgressSinglePhoto:{
      screen: ProgressSinglePhotoScreen,
      navigationOptions: projectProgressSinglePhotoOption
    },
    PhotoDetail:{
      screen: PhotoDetailScreen,
      navigationOptions: photoDetailOption
    },
    ProgressInspectionList: {
      screen: InspectionListScreen,
      navigationOptions: progressInspectionListOption
    },
    ProgressInspectionCreate: {
      screen: InspectionCreateScreen,
      navigationOptions: projectViewOption
    },
    ProgressInspectionEdit: {
      screen: InspectionEditScreen,
      navigationOptions: progressInspectionEditOption
    },
    ProgressDefectList: {
      screen: DefectListScreen,
      navigationOptions: progressDefectListOption
    },
    ProgressDefectCreate: {
      screen: DefectCreationScreen,
      navigationOptions: projectViewOption
    },
    ProgressDefectEdit: {
      screen: DefectEditScreen,
      navigationOptions: progressDefectEditOption
    },
    ProgressDefectView: {
      screen: DefectViewScreen,
      navigationOptions: projectDefectViewOption
    }
  }
);



const customDrawerNavigation = (props) => {

  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    props.navigation.navigate('Login');
  }
  return (
    <Container style={{ backgroundColor: 'black' }}>
      <Header style={{ backgroundColor: 'black' }}>
        <Body>
          <View style={{ height: 35, paddingTop: 10, paddingLeft: 20 }}>
            <Text style={{ letterSpacing: 5, color: 'white', fontSize: 20, alignContent: 'flex-start', justifyContent: 'center' }}>MENU</Text>
          </View>
        </Body>
      </Header>
      <Content style={{ paddingLeft: 20 }}>
        <DrawerItems {...props} />
        <TouchableOpacity onPress={onLogout}>
          <View style={{ padding: 18 }}>
            <Text style={{ color: 'white', fontWeight: "bold", fontSize: 18 }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </Content>
    </Container>)
}


const appNavigator = createDrawerNavigator(
  {
    Home: {
      screen: DashboardStack,
      contentOptions: {
        color: 'white',
      }
    },
    Leads: {
      screen: MarketingStack,
      contentOptions: {
        color: 'white',
      }
    },
    Sales: {
      screen: SalesStack,
      contentOptions: {
        color: 'white',
      }
    },
    Project: {
      screen: ProjectStack,
      contentOptions: {
        color: 'white',
      }
    },
    // Logout: authNavigator,
  },
  {
    initialRouteName: 'Home',
    contentComponent: customDrawerNavigation,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerPosition: 'left',
    drawerBackgroundColor: 'black',
    contentOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      labelStyle: {
        fontSize: 18,
        color: 'white',
      },
    },
  }
);

const mainNavigator = createSwitchNavigator(
  {
    App: appNavigator,
    Auth: authNavigator
  },
  {
    initialRouteName: 'Auth',
  }
);


const AppContainer = createAppContainer(mainNavigator);

export default App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);