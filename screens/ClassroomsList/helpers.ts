import {ClassroomType, InstrumentType} from "../../models/models";

type InstrumentTypeOrderT = {
  [index: string]: number;
};

const instrumentTypeOrder: InstrumentTypeOrderT = {
  GrandPiano: 0,
  UpRightPiano: 1
};

export function getClassroomsFilteredByInstruments(classrooms: ClassroomType[],
                                                   userInstrumentFilterInput: InstrumentType[]) {
  const instrumentsFilterSorted = sortUserFilterInstruments(userInstrumentFilterInput);

  return classrooms.filter((classroom) => {
    const instrumentsFilter = [...instrumentsFilterSorted];
    let classroomInstruments = [...classroom.instruments];

    if (instrumentsFilter.length > classroomInstruments.length) {
      return false;
    }

    // first checking all the required grand pianos
    while (instrumentsFilter[instrumentsFilter.length - 1]?.type === 'GrandPiano') {
      const classroomGrandPianoInd = getMinimumSatisfactoryInstrumentIndex(
        classroomInstruments,
        'GrandPiano',
        instrumentsFilter[instrumentsFilter.length - 1].rate
      );
      if (classroomGrandPianoInd === -1) {
        return false;
      }

      instrumentsFilter.pop();
      classroomInstruments.splice(classroomGrandPianoInd, 1);
    }

    // checking all the other instruments
    while (instrumentsFilter.length) {
      const classroomInstrumentInd = getMinimumSatisfactoryInstrumentIndex(
        classroomInstruments, null, instrumentsFilter[instrumentsFilter.length - 1].rate
      );
      if (classroomInstrumentInd === -1) {
        return false;
      }

      instrumentsFilter.pop();
      classroomInstruments.splice(classroomInstrumentInd, 1);
    }

    return true;
  })
}

function sortUserFilterInstruments(instruments: InstrumentType[]) {
  return instruments.sort((instA, instB) => {

    if (instrumentTypeOrder[instA.type] === instrumentTypeOrder[instB.type]) {
      return instA.rate - instB.rate;
    }

    return instrumentTypeOrder[instB.type] - instrumentTypeOrder[instA.type]
  })
}

function getMinimumSatisfactoryInstrumentIndex(instruments: InstrumentType[],
                                               instrumentType: string | null, minimumRate: number) {
  let bestIndex = -1;

  instruments.forEach((instrument, i) => {
    if (instrumentType && instrument.type !== instrumentType) return;

    if (instrument.rate < minimumRate) return;

    if (bestIndex === -1 || instrument.rate - minimumRate < instruments[bestIndex].rate - minimumRate) {
      bestIndex = i;
    }
  });
  return bestIndex;
}