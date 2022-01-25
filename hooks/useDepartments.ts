import {useEffect, useState} from "react";
import {client} from "../api/client";
import {Department} from "../models/models";
import {GET_DEPARTMENTS} from "../api/operations/queries/departments";
import {globalErrorVar} from "../api/localClient";

const useDepartments = (): Array<Department> => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    client.query({query: GET_DEPARTMENTS,
      fetchPolicy: 'network-only',
    }).then((data) => {
      setDepartments(data.data.departments
          .slice().sort((a: Department, b: Department) => a.id - b.id));
      }).catch((e: any) => globalErrorVar(e.message));
  }, []);

  return departments;
};

export default useDepartments;
