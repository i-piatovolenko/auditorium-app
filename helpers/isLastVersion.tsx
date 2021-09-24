import {Platform} from "react-native";
import Constants from 'expo-constants';
import {client} from "../api/client";
import {LATEST_ANDROID_VERSION} from "../api/operations/queries/latestAndroidversion";
import {LATEST_IOS_VERSION} from "../api/operations/queries/latestIOSversion";

export const isLastVersion = async () => {
  const currentPlatform = Platform.OS;
  const currentVersionAndroid = Constants.__unsafeNoWarnManifest.android.versionCode;
  const currentVersionIOS = Constants.__unsafeNoWarnManifest.ios.buildNumber;
  const latestVersionAndroid = await client.query({
    query: LATEST_ANDROID_VERSION
  });
  const latestVersionIOS = await client.query({
    query: LATEST_IOS_VERSION
  });
  if (currentPlatform === 'ios') {
    return [String(currentVersionIOS) === String(latestVersionIOS.data.constant.value), currentVersionIOS, latestVersionIOS.data.constant.value]
  } else if (currentPlatform === 'android') {
    return [String(currentVersionAndroid) === String(latestVersionAndroid.data.constant.value), currentVersionAndroid, latestVersionAndroid.data.constant.value]
  }
};