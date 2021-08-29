import React, {useState} from 'react';
import {fullName, getTimeHHMM, isNotFree, isOwnClassroom, isPendingForMe} from "../helpers/helpers";
import {StyleSheet, Text, View} from "react-native";
import {Banner, Button, Paragraph, ProgressBar, Surface} from "react-native-paper";
import {ClassroomType, Mode, OccupiedState, User, UserTypeColors, UserTypes, UserTypesUa} from "../models/models";
import colors from "../constants/Colors";
import UserInfo from "./UserInfo";
import {useLocal} from "../hooks/useLocal";
import useTimeLeft from "../hooks/useTimeLeft";
import {client} from "../api/client";
import {MAKE_DECISION_ON_PENDING_CLASSROOM} from "../api/operations/mutations/makeDecisionOnPendingClassroom";

type PropTypes = {
  classroom: ClassroomType;
  user: User;
}

const OccupantInfo: React.FC<PropTypes> = ({classroom, user}) => {
  const {data: {mode}} = useLocal('mode');
  const userFullName = isNotFree(classroom?.occupied) ? fullName(classroom.occupied?.user) : '';
  const occupiedTotalTime = classroom.occupied.state === OccupiedState.OCCUPIED ? 180 :
    classroom.occupied.state === OccupiedState.RESERVED ? 15 : 2;
  const [timeLeft, timeLeftInPer] = useTimeLeft(classroom?.occupied, occupiedTotalTime);
  const [visibleBanner, setVisibleBanner] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeDecision = async (decision: boolean) => {
    setLoading(true);
    try {
      await client.mutate({
        mutation: MAKE_DECISION_ON_PENDING_CLASSROOM,
        variables: {
          input: {
            classroomName: classroom.name,
            continueWaitingForDesiredClassrooms: decision
          }
        }
      });
      setLoading(false);
    } catch (e) {
      alert(JSON.stringify(e));
      setLoading(false);
    }
  }

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return <>{!isNotFree(classroom.occupied)
    ? <Text style={styles.freeText}>Вільно</Text>
    : !isPendingForMe(classroom.occupied, user, mode) && (
    <Surface style={[{elevation: visible ? 0 : 4}, styles.occupationInfo]}
             onTouchEnd={showModal}
    >
      <Text style={styles.occupantName}>{userFullName}</Text>
      <Text style={[{
        backgroundColor: UserTypeColors[classroom.occupied.user.type as UserTypes]
      },
        styles.occupantType
      ]}
      >
        {UserTypesUa[classroom.occupied.user.type as UserTypes]}
      </Text>
      {isOwnClassroom(classroom.occupied, user) ? (
        timeLeftInPer > 0 && <View style={{marginTop: 30}}>
            <Paragraph>
                Часу на заняття залишилось: {timeLeft}
            </Paragraph>
            <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                         style={styles.progressBar}
            />
        </View>
      ) : (
        <Text style={styles.occupiedUntil}>Зайнято до {getTimeHHMM(new Date(classroom.occupied.until))}</Text>
      )}
      <UserInfo userId={classroom.occupied.user.id} hideModal={hideModal} visible={visible}/>
    </Surface>
  )}
    {classroom.occupied.state === OccupiedState.RESERVED &&
    classroom.occupied.user.id === user.id && (
      <>
        {timeLeftInPer > 0 && <View style={styles.spaceBottom30}>
            <Banner visible={visibleBanner} actions={[{
              label: 'Зрозуміло',
              onPress: () => setVisibleBanner(false)
            }]}
                    style={styles.spaceBottom30}
            >Заберіть ключі від аудиторії в учбовій частині. Максимальний час знаходження в аудиторії - 3 години.
            </Banner>
            <Paragraph>
                Час на прийняття рішення: {timeLeft}
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
        {timeLeftInPer > 0 && <View style={styles.spaceBottom30}>
            <Banner visible={visibleBanner} actions={[{
              label: 'Зрозуміло',
              onPress: () => setVisibleBanner(false)
            }]}
                    style={styles.spaceBottom30}
            >
              {
                `Ви можете відхилити аудиторію ${user.queueInfo.currentSession?.skips} раз${user.queueInfo.currentSession?.skips === 2 || user.queueInfo.currentSession?.skips === 3 || user.queueInfo.currentSession?.skips === 4 ? 'и.' : '.'
                } Якщо аудиторія не буде підтверджена на протязі визначеного часу, вона буде відхилена автоматично. Якщо показник допустимих відхилень дорівнює нулю і Ви не підтверджуєте та не відхиляєте аудиторію, вона автоматично відхиляється і Ви вибуваєте з черги.`
              }
            </Banner>
            <Paragraph>
                Часу на прийняття рішення залишилось: {timeLeft}
            </Paragraph>
            <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                         style={styles.progressBar}
            />
        </View>}
        <View>
          <Button mode='contained' style={{marginBottom: 8}} color='#f91354' loading={loading}
                  disabled={loading}
                  onPress={() => makeDecision(false)}>
            Відхилити аудиторію
          </Button>
          <Button mode='contained' onPress={() => makeDecision(true)} loading={loading}
                  disabled={loading}>
            Підтвердити аудиторію
          </Button>
        </View>
      </>
    )}
  </>
}

const styles = StyleSheet.create({
  occupationInfo: {
    borderRadius: 8,
    padding: 16
  },
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
  spaceBottom30: {
    marginBottom: 30,
    backgroundColor: '#ffffff'
  }
});

export default OccupantInfo;