import {ClassroomType} from "../models/models";

export default function sortAB(a: ClassroomType, b: ClassroomType) {
  return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'})
}