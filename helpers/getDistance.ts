export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string) => {
  let radLat1 = Math.PI * lat1 / 180
  let radLat2 = Math.PI * lat2 / 180
  let theta = lon1 - lon2
  let radTheta = Math.PI * theta / 180
  let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") {
    dist = dist * 1.609344
  }
  if (unit == "N") {
    dist = dist * 0.8684
  }
  return dist
};