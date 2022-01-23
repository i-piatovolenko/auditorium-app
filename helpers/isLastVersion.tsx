import {Platform} from "react-native";
import Constants from 'expo-constants';
import {client} from "../api/client";
import {LATEST_ANDROID_VERSION} from "../api/operations/queries/latestAndroidversion";
import {LATEST_IOS_VERSION} from "../api/operations/queries/latestIOSversion";
import {Platforms} from "../models/models";
import semver from "semver/preload";

export const isLastVersion = async () => {
  const currentPlatform = Platform.OS;
  if (currentPlatform === Platforms.WEB) return [true, 0, 0];
  const currentVersionAndroid = Constants.__unsafeNoWarnManifest.android.versionCode;
  const currentVersionIOS = Constants.__unsafeNoWarnManifest.ios.buildNumber;
  const latestVersionAndroid = await client.query({
    query: LATEST_ANDROID_VERSION
  });
  const latestVersionIOS = await client.query({
    query: LATEST_IOS_VERSION
  });

  if (currentPlatform === Platforms.IOS) {
    return [
      semver.satisfies(currentVersionIOS, `>=${latestVersionIOS.data.constant.value}`),
      currentVersionIOS,
      latestVersionIOS.data.constant.value
    ];
  } else if (currentPlatform === Platforms.ANDROID) {
    return [
      currentVersionAndroid >= latestVersionAndroid.data.constant.value,
      currentVersionAndroid,
      latestVersionAndroid.data.constant.value];
  }
};
