import {useEffect, useState} from "react";
import {client} from "../api/client";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ISODateString} from "../helpers/helpers";
import {ClassroomType} from "../models/models";
import {gql, useQuery} from "@apollo/client";

const useClassrooms = (): Array<ClassroomType> => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const {data: gridUpdate} = useQuery(gql`
    query gridUpdate {
      gridUpdate @client
    }
  `);

  useEffect(() => {
      setInterval( () =>
      client
        .query({
          query: GET_CLASSROOMS,
          variables: {date: ISODateString(new Date())},
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
        })
      , 5000);
    }
    , [gridUpdate]);

  return classrooms;
};

export default useClassrooms;