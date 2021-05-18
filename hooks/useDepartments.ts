import {useEffect, useState} from "react";
import {client} from "../api/client";
import {Department} from "../models/models";
import {GET_DEPARTMENTS} from "../api/operations/queries/departments";

const useDepartments = (updateList: boolean): Array<Department> => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    client.query({query: GET_DEPARTMENTS, variables: {
      where: {
      }
      },
      fetchPolicy: 'network-only'
    }).then((data) => {
      setDepartments(data.data.departments
          .slice().sort((a: Department, b: Department) => a.id - b.id));
      });
  }, [updateList]);

  return departments;
};

export default useDepartments;