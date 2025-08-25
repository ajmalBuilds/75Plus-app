import { Redirect, Href } from "expo-router";
const PATH = "/(tabs)" as Href;

export default function Index() {
  return <Redirect href={PATH} />;
}