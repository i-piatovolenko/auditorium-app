import React, {useState} from 'react';
import {fullName, getTimeHHMM, isNotFree, isOwnClassroom, isPendingForMe} from "../helpers/helpers";
import {StyleSheet, Text, View} from "react-native";
import {Banner, Button, Paragraph, ProgressBar, Surface} from "react-native-paper";
import {ClassroomType, Mode, OccupiedState, User, UserTypeColors, UserTypes, UserTypesUa} from "../models/models";
import colors from "../constants/Colors";
import UserInfo from "./UserInfo";
import {useLocal} from "../hooks/useLocal";
import useTimeLeft from "../hooks/useTimeLeft";
import {MAKE_DECISION_ON_PENDING_CLASSROOM} from "../api/operations/mutations/makeDecisionOnPendingClassroom";
import WaitDialog from "./WaitDialog";
import {client} from "../api/client";
import {acceptedClassroomVar, globalErrorVar, skippedClassroomVar} from "../api/localClient";
import UserInfoCard from "./UserInfoCard";

type PropTypes = {
  classroom: ClassroomType;
  user: User;
  navigation: any;
}

const OccupantInfo: React.FC<PropTypes> = ({classroom, user, navigation}) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {me}} = useLocal('me');
  const {occupied} = classroom;
  const userFullName = isNotFree(classroom?.occupied) ? fullName(occupied.user) : '';
  const occupiedTotalTime = classroom.occupied.state === OccupiedState.OCCUPIED ? 180 :
    classroom.occupied.state === OccupiedState.RESERVED ? 15 : 2;
  const [timeLeft, timeLeftInPer] = useTimeLeft(classroom?.occupied, occupiedTotalTime);
  const [visibleBanner, setVisibleBanner] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeDecision = async (decision: boolean) => {
    setLoading(true);
    skippedClassroomVar(!decision);
    acceptedClassroomVar(decision);
    try {
      await client.mutate({
        mutation: MAKE_DECISION_ON_PENDING_CLASSROOM,
        variables: {
          input: {
            classroomName: classroom.name,
            reserveClassroom: decision,
          }
        }
      });
    } catch (e: any) {
      globalErrorVar(e.message);
    } finally {
      setLoading(false);
      navigation.navigate('ClassroomsList');
    }
  }
  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return <>
    {occupied.state === OccupiedState.PENDING && occupied?.user?.id === me.id && (
      <View style={styles.buttons}>
        <Button mode='contained' style={{marginBottom: 8}} color='#f91354' loading={loading}
                disabled={loading}
                onPress={() => makeDecision(false)}>
          <Text>Пропустити аудиторію</Text>
        </Button>
        <Button mode='contained' onPress={() => makeDecision(true)} loading={loading}
                disabled={loading}>
          <Text>Підтвердити аудиторію</Text>
        </Button>
      </View>
    )}
    {!isNotFree(classroom.occupied)
      ? <Text style={styles.freeText}>Вільно</Text>
      :
      // !isPendingForMe(classroom.occupied, user, mode) &&
      (
        <UserInfoCard
          user={user}
          visible={visible}
          userFullName={userFullName}
          occupied={classroom.occupied}
          showModal={showModal}
          hideModal={hideModal}
          timeLeft={timeLeft}
          timeLeftInPer={timeLeftInPer}
          classroomName={classroom.name}
        />
      )}
    {(occupied.state === OccupiedState.RESERVED
      || occupied.state === OccupiedState.PENDING)
    && (occupied.user?.id === me.id || occupied?.keyHolder?.id === me.id)
    && occupied?.keyHolder && (
      <UserInfoCard
        user={user}
        visible={visible}
        userFullName={fullName(occupied.keyHolder)}
        occupied={classroom.occupied}
        showModal={showModal}
        hideModal={hideModal}
        timeLeft={timeLeft}
        timeLeftInPer={timeLeftInPer}
        isKeyHolder
        classroomName={classroom.name}
      />
    )}
    {occupied.state === OccupiedState.RESERVED &&
    occupied.user?.id === user.id && (
      <>
        {timeLeftInPer > 0 && <View style={styles.spaceBottom30}>
            <Banner visible={visibleBanner} actions={[{
              label: 'Зрозуміло',
              onPress: () => setVisibleBanner(false)
            }]}
                    style={styles.spaceBottom30}
            >
              {occupied.keyHolder === null ?
                'Заберіть ключі від аудиторії в учбовій частині. Максимальний час знаходження в аудиторії - 3 години.'
                : 'Заберіть ключ з аудиторії та натисніть "Ключ отримано"'
              }
            </Banner>
            <Paragraph>
                Чаc, щоб забрати ключ: {timeLeft}
            </Paragraph>
            <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                         style={styles.progressBar}
            />
        </View>}
      </>
    )}
    {classroom.occupied.state === OccupiedState.PENDING &&
    classroom.occupied.user.id === user.id && mode === Mode.INLINE && (
      <>
        {timeLeftInPer > 0 && <View style={styles.infoBanner}>
            <Banner visible={visibleBanner} actions={[{
              label: 'Зрозуміло',
              onPress: () => setVisibleBanner(false)
            }]}
                    style={styles.spaceBottom30}
            >

              {
                `Доступні пропуски аудиторій: ${user.queueInfo.currentSession?.skips ? user.queueInfo.currentSession?.skips : 0}. Якщо аудиторія не буде підтверджена на протязі визначеного часу, вона буде пропущена автоматично. Якщо показник допустимих пропусків дорівнює нулю і Ви не підтверджуєте та не відхиляєте аудиторію, вона автоматично пропускається і Ви вибуваєте з черги.`
              }
            </Banner>
            <Paragraph>
                Часу до автоматичного пропуску: {timeLeft}
            </Paragraph>
            <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                         style={styles.progressBar}
            />
        </View>}
      </>
    )}
    <WaitDialog visible={loading}/>
  </>
}

const styles = StyleSheet.create({
  freeText: {
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 32,
    color: '#bbb'
  },
  progressBar: {
    height: 24,
    borderRadius: 6,
  },
  spaceBottom30: {
    marginBottom: 30,
    backgroundColor: '#ffffff'
  },
  infoBanner: {
    marginVertical: 30,
    backgroundColor: '#ffffff'
  },
  buttons: {
    paddingBottom: 16
  }
});

export default OccupantInfo;
