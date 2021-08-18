import React, {useEffect, useState} from 'react';
import {Dimensions, ImageBackground, StyleSheet, View, Text, ScrollView} from "react-native";
import {ActivityIndicator, Appbar} from "react-native-paper";
import {ClassroomType} from "../../models/models";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useQuery} from "@apollo/client";
import ClassroomsBrowser from "../../components/ClassroomsBrowser/ClassroomsBrowser";
import {GET_CLASSROOMS_NO_SCHEDULE} from "../../api/operations/queries/classrooms";
import {FOLLOW_CLASSROOMS} from "../../api/operations/subscriptions/classrooms";
import {GET_USER_BY_ID} from "../../api/operations/queries/users";
import {FOLLOW_USER} from "../../api/operations/subscriptions/user";
import {getItem} from "../../api/asyncStorage";
import Log from "../../components/Log";
import {hasOwnClassroom} from "../../helpers/helpers";

const Stack = createStackNavigator<RootStackParamList>();
const screenHeight = Dimensions.get('window').height;

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getItem('user').then(data => setCurrentUserId(data.id));
  },[]);
  if (!currentUserId) return null;
  // @ts-ignore
  return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='ClassroomsList'>
    <Stack.Screen
      name='ClassroomsList'
      component={ClassroomsList}
      initialParams={{currentUserId}}
    />
    <Stack.Screen
      name='ClassroomInfo'
      component={ClassroomInfo}
    />
  </Stack.Navigator>
}

type QueryClassroomsData = {
  classrooms: ClassroomType[];
}

const ClassroomsList: React.FC = ({route}: any) => {
  const navigation = useNavigation();
  const {
    data,
    loading,
    error,
    subscribeToMore
  } = useQuery<QueryClassroomsData>(GET_CLASSROOMS_NO_SCHEDULE);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    subscribeToMore: subscribeToMoreUser
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: route.params.currentUserId
      }
    }
  })

  useEffect(() => {
    const unsubscribeClassrooms = subscribeToMore({
      document: FOLLOW_CLASSROOMS
    });
    const unsubscribeUser = subscribeToMoreUser({
      document: FOLLOW_USER,
      variables: {
        userId: route.params.currentUserId
      }
    });
    return () => {
      unsubscribeClassrooms();
      unsubscribeUser();
    };
  }, []);

  // const applyGeneralFilter = (instruments: InstrumentType[], withWing: boolean,
  //                             operaStudioOnly: boolean, special: SpecialT) => {
  //
  //   const filteredClassroomsByInstruments = instruments.length ?
  //     getClassroomsFilteredByInstruments(classrooms, instruments) : classrooms;
  //
  //   const filteredIds = filteredClassroomsByInstruments
  //     .filter(filterDisabledForQueue)
  //     .filter(classroom => withWing ? true : !classroom.isWing)
  //     .filter(classroom => operaStudioOnly ? classroom.isOperaStudio : true)
  //     .filter(classroom => {
  //       switch (special) {
  //         case "with":
  //           return true;
  //         case "only":
  //           return classroom.special;
  //         case "without":
  //           return !classroom.special;
  //       }
  //     })
  //     .map(classroom => classroom.id);
  //
  //   if (isMinimalSetup) {
  //     minimalClassroomIdsVar(filteredIds);
  //   } else {
  //     desirableClassroomIdsVar(filteredIds);
  //   }
  // };

  const filterOwm = ({id}: ClassroomType) => {
    return id === hasOwnClassroom(userData.user.occupiedClassrooms);
  };

  return (
    <ImageBackground source={require('../../assets/images/bg.jpg')}
                     style={{width: '100%', height: '100%'}}>
      <Appbar style={styles.top}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                       color='#fff'
        />
      </Appbar>

      <View style={styles.wrapper}>
        {!loading && !error && !userLoading && !userError && (
          <ScrollView>
            {/*<Log data={JSON.stringify(data.classrooms.filter(filterOwm))}/>*/}
            <ClassroomsBrowser classrooms={data.classrooms.filter(filterOwm)} title='Моя аудиторія'/>
            <ClassroomsBrowser classrooms={data.classrooms} title='Інші аудиторії'/>
          </ScrollView>
          )}
        {loading && <ActivityIndicator animating color='#fff' size={64}/>}
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create(
  {
    top: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      paddingTop: 26,
      height: 80,
      backgroundColor: 'transparent',
      zIndex: 1
    },
    grid: {
      marginBottom: 80,
      marginLeft: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    },
    getInLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      left: 20,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLineSingle: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      position: 'absolute',
      zIndex: 1,
      right: 20,
      bottom: 15,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    wrapper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingTop: 80,
// paddingBottom: 70,
    },
    queueSwitcher: {
      flexDirection: 'row',
      width: '76%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    gridDivider: {
      color: '#fff',
      marginBottom: 10,
      marginLeft: 3,
      marginRight: 3,
      paddingLeft: 17,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff77',
      paddingBottom: 10
    }
  }
);