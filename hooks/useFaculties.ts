import {useEffect, useState} from "react";
import {client} from "../api/client";
import {Faculty} from "../models/models";
import {GET_FACULTIES} from "../api/operations/queries/faculties";

const useFaculties = (updateList: boolean = false): Array<Faculty> => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    client.query({query: GET_FACULTIES, variables: {
      where: {
      }
      },
      fetchPolicy: 'network-only'
    }).then((data) => {
      setFaculties(data.data.faculties
          .slice().sort((a: Faculty, b: Faculty) => a.id - b.id));
      });
  }, [updateList]);

  return faculties;
};

export default useFaculties;