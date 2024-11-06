import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { Skeleton } from "react-native-skeletons";

export default function ProductMediumComponentLoading({ count }) {
  const theme = useTheme();

  const [arr, setArr] = useState([]);

  useEffect(() => {
    var tmp = [];
    for (let i = 0; i < count; i++) {
      tmp.push(i);
    }
    setArr(tmp);
  }, [count]);

  return (
    <>
      {arr.map((value) => (
        <View style={{ padding: 10 }} key={value}>
          <Skeleton
            height={200}
            count={1}
            color={theme.colors.inverseOnSurface}
            style={{ marginBottom: 10 }}
          />
          <View style={{ padding: 10 }}>
            <Skeleton
              width={150}
              color={theme.colors.inverseOnSurface}
              style={{ marginBottom: 10 }}
            />
            <Skeleton
              color={theme.colors.inverseOnSurface}
              style={{ marginBottom: 10 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <View style={{ alignContent: "flex-start" }}>
              <View style={{ flexDirection: "row" }}>
                <Skeleton
                  width={250}
                  color={theme.colors.inverseOnSurface}
                  style={{ marginBottom: 10 }}
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Skeleton
                  width={250}
                  color={theme.colors.inverseOnSurface}
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Skeleton
                  width={100}
                  height={25}
                  color={theme.colors.inverseOnSurface}
                  style={{ marginBottom: 10 }}
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Skeleton
                  width={50}
                  color={theme.colors.inverseOnSurface}
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}
