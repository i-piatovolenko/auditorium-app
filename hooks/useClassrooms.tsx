import {useEffect, useState} from "react";
import {client} from "../api/client";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ISODateString} from "../helpers/helpers";
import {ClassroomType} from "../models/models";
import {gql, useQuery} from "@apollo/client";

const useClassrooms = (props?: any): Array<ClassroomType> => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const { data } = useQuery(gql`
    query gridUpdate {
      gridUpdate @client
    }
  `);

  useEffect(() => {
    client
      .query({
        query: GET_CLASSROOMS,
        variables: { date: ISODateString(props?.date ? props.date : new Date()) },
        fetchPolicy: 'network-only',
      })
      .then((data) => {
        setClassrooms(
          data.data.classrooms
            .slice()
            .sort(
              (a: ClassroomType, b: ClassroomType) =>
                parseInt(a.name) - parseInt(b.name)
            )
        );
      });
  }, [data.gridUpdate]);

  return classrooms;
};

export default useClassrooms;