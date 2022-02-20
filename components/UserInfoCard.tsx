import React, {FC} from 'react';
import {Button, Paragraph, ProgressBar, Surface} from "react-native-paper";
import {StyleSheet, Text, View} from "react-native";
import {OccupiedInfo, OccupiedState, User, UserTypeColors, UserTypes, UserTypesUa} from "../models/models";
import {getTimeHHMM, isOwnClassroom} from "../helpers/helpers";
import colors from "../constants/Colors";
import UserInfo from "./UserInfo";
import {useLocal} from "../hooks/useLocal";
import {GIVE_OUT_CLASSROOM_KEY} from "../api/operations/mutations/giveOutClassroomKey";
import {client} from "../api/client";
import {globalErrorVar} from "../api/localClient";
import {useNavigation} from "@react-navigation/native";

type UserInfoCardPropTypes = {
  visible: boolean;
  showModal: () => void;
  hideModal: () => void;
  userFullName: string;
  occupied: OccupiedInfo;
  timeLeft: any;
  timeLeftInPer: any;
  user: User;
  isKeyHolder?: boolean;
  classroomName: string;
};

const UserInfoCard: FC<UserInfoCardPropTypes> = (props) => {
  const {
    visible,
    showModal,
    hideModal,
    userFullName,
    occupied,
    timeLeft,
    timeLeftInPer,
    user,
    isKeyHolder,
    classroomName
  } = props;
  const occupiedUser = occupied.state === OccupiedState.RESERVED ? occupied.user : occupied.keyHolder
    ? occupied.keyHolder : occupied.user;
  const {data: {me}} = useLocal('me');
  const navigate = useNavigation();

  const giveOutKey = async () => {
    try {
      const result = await client.mutate({
        mutation: GIVE_OUT_CLASSROOM_KEY,
        variables: {
          input: {
            classroomName
          }
        }
      });
      navigate.goBack();
    } catch (e) {
      globalErrorVar(e.message);
    }
  }

  return (
    <>
      <Surface style={[{elevation: visible ? 0 : 4}, styles.occupationInfo]}
               onTouchEnd={showModal}
      >
        <Text style={styles.occupantName}>{userFullName} {isKeyHolder ? '(власник ключа)' : ''}</Text>
        <Text style={[{
          backgroundColor: UserTypeColors[occupied.user.type as UserTypes]
        },
          styles.occupantType
        ]}
        >
          {UserTypesUa[occupied.user.type as UserTypes]}
        </Text>
        {isOwnClassroom(occupied, user) ? (
          timeLeftInPer > 0 && <View style={{marginTop: 30}}>
              <Paragraph>
                  Часу на заняття залишилось: {timeLeft}
              </Paragraph>
              <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                           style={styles.progressBar}
              />
          </View>
        ) : (
          <Text style={styles.occupiedUntil}>Зайнято до {getTimeHHMM(new Date(occupied.until))}</Text>
        )}
        <UserInfo userId={occupiedUser.id} hideModal={hideModal} visible={visible}/>
      </Surface>
      {isKeyHolder && occupied.keyHolder && (occupied.state === OccupiedState.RESERVED
        || occupied.state === OccupiedState.PENDING) && occupied.user.id === me.id && (
        <Button mode='contained' style={{marginTop: 10}} onPress={giveOutKey}>
          Ключ отримано
        </Button>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  occupationInfo: {
    borderRadius: 8,
    margin: 8,
    padding: 16
  },
  occupantName: {
    textAlign: 'center',
    fontSize: 16,
  },
  occupantType: {
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 8,
    borderRadius: 4,
  },
  occupiedUntil: {
    textAlign: 'center',
    marginTop: 8
  },
  progressBar: {
    height: 24,
    borderRadius: 6,
  },
});

export default UserInfoCard;
