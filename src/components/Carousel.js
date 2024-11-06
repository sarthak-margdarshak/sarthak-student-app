import { useState } from "react";
import { Dimensions, FlatList, Image, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Carousel({ imagesList }) {
  const windowWidth = Dimensions.get("window").width;
  const theme = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);

  const renderDotIndicators = () => {
    return imagesList?.map((dot, index) => {
      return (
        <View
          key={index}
          style={{
            backgroundColor:
              activeIndex === index
                ? theme.colors.primary
                : theme.colors.surfaceDisabled,
            height: 8,
            width: 8,
            borderRadius: 4,
            marginHorizontal: 6,
          }}
        />
      );
    });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / windowWidth;
    setActiveIndex(Math.round(index));
  };

  return (
    <>
      <FlatList
        data={imagesList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        onScroll={handleScroll}
        renderItem={(img) => (
          <View key={img.index}>
            <Image
              width={windowWidth}
              height={(windowWidth * 3) / 4}
              source={{ uri: img.item }}
              alt="background"
            />
          </View>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        {renderDotIndicators()}
      </View>
    </>
  );
}
