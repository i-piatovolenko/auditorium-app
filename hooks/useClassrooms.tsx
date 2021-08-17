import {useEffect, useState} from "react";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ISODateString} from "../helpers/helpers";
import {ClassroomType} from "../models/models";
import {useQuery} from "@apollo/client";
import {FOLLOW_CLASSROOMS} from "../api/operations/subscriptions/classrooms";

const useClassrooms = (props?: any): [Array<ClassroomType>, any] => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const {data, loading, error, subscribeToMore} = useQuery(GET_CLASSROOMS, {
    variables: {
      date: ISODateString(props?.date ? props.date : new Date()),
    }
  })
  const followClassrooms = () => subscribeToMore({
    document: FOLLOW_CLASSROOMS
  });

  useEffect(() => {
    !loading && !error && setClassrooms(
      data.classrooms
        .slice()
        .sort(
          (a: ClassroomType, b: ClassroomType) =>
            parseInt(a.name) - parseInt(b.name)
        )
    );
  }, [data, loading, error]);

  return [classrooms, followClassrooms];
};

export default useClassrooms;