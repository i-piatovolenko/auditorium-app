import {ClassroomType} from "../models/models";

export default function sortAB(a: ClassroomType, b: ClassroomType) {
  return parseInt(a.name) - parseInt(b.name);
}