import {useEffect, useState} from "react";
import {client} from "../api/client";
import {Degree} from "../models/models";
import {GET_DEGREES} from "../api/operations/queries/degrees";

const useDegrees = (updateList: boolean = false): Array<Degree> => {
  const [degrees, setDegrees] = useState<Degree[]>([]);

  useEffect(() => {
    client.query({query: GET_DEGREES, variables: {
      where: {
      }
      },
      fetchPolicy: 'network-only'
    }).then((data) => {
      setDegrees(data.data.degrees
          .slice().sort((a: Degree, b: Degree) => a.id - b.id));
      });
  }, [updateList]);

  return degrees;
};

export default useDegrees;