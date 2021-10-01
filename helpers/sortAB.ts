import {ClassroomType, Platforms} from "../models/models";
import {Platform} from "react-native";

export default function sortAB(a: ClassroomType, b: ClassroomType) {
  // if (Platform.OS === Platforms.ANDROID) return parseInt(a.name) - parseInt(b.name);
  // return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
  if (isNaN((parseInt(b.name)))) return -1;
  if (isNaN((parseInt(a.name)))) return 1;
  return parseInt(a.name) - parseInt(b.name);
}