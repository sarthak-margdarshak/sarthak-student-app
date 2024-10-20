/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

import { RefreshControl, ScrollView } from "react-native";
import MotivationBox from "../mockSeries/MotivationBox";
import AllProductComponent from "../mockSeries/AllProductComponent";
import ClasswiseComponent from "../mockSeries/ClasswiseComponent";
import SubjectWiseComponent from "../mockSeries/SubjectWiseComponent";
import ChapterWiseComponent from "../mockSeries/ChapterWiseComponent";

export default function MockTestSeriesFragment() {
  return (
    <ScrollView
      style={{
        margin: 10,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }
    >
      <MotivationBox />

      <AllProductComponent />

      <ClasswiseComponent />

      <SubjectWiseComponent />

      <ChapterWiseComponent />
    </ScrollView>
  );
}
