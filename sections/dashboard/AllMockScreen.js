import { useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Button, Divider, List, Text } from "react-native-paper";
import { databases } from "../../auth/AppwriteContext";
import { APPWRITE_DATABASE, APPWRITE_DATABASE_MOCK_TEST_PRICE_TAG, APPWRITE_DATABASE_STANDARDS } from "@env"
import { Query } from "appwrite";
import { useAuthContext } from "../../auth/useAuthContext";
import { SnackbarContext } from "../../hooks/useSnackbar";
import LoadingScreen from "../../components/LoadingScreen";
import { router } from "expo-router";

export default function AllMockScreen() {

  const [loading, setLoading] = useState(false);
  const [standardList, setStandardList] = useState([]);

  const { user } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext)

  const loadData = async () => {
    setLoading(true);
    try {
      var ans = [];
      const x = await databases.listDocuments(
        APPWRITE_DATABASE,
        APPWRITE_DATABASE_MOCK_TEST_PRICE_TAG,
        [
          Query.isNull('subjectId'),
          Query.isNull('chapterId'),
          Query.isNull('conceptId'),
          Query.limit(100),
        ]
      )
      for (let i in x.documents) {
        const y = (await databases.getDocument(
          APPWRITE_DATABASE,
          APPWRITE_DATABASE_STANDARDS,
          x.documents[i].standardId
        ));
        ans.push({
          title: y.name,
          count: y.count,
          sellPrice: x.documents[i].sell_price,
          mrp: x.documents[i].mrp,
          standardId: x.documents[i].standardId,
          subjectCount: y.subjectIds.length,
        })
      }
      setStandardList(ans)
    } catch (error) {
      showSnackbar(error.message)
    }
    setLoading(false);
  }

  const listItem = standardList.map((value) =>
    <View key={value.standardId} style={{marginTop: 5}}>
      <List.Accordion
        description={'Contains ' + value.count + ' mock tests in ' + value.subjectCount + ' subjects'}
        title={value.title}
        titleNumberOfLines={1}
        titleStyle={{
          fontSize: 25
        }}
        onPress={() => { }}
        style={{ borderRadius: 20, paddingLeft: 10 }}>
        <View style={{
          marginLeft: 30
        }}>
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: 'center'
          }}>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 40 }} >{"₹" + value.sellPrice}</Text>
              <Text style={{ textDecorationLine: 'line-through', fontSize: 15 }} >{"₹" + value.mrp}</Text>
            </View>
            <Button mode='elevated' onPress={() => router.push('/mockTests/'+value.standardId)}>Explore</Button>
            {/* TODO: Disable if already bought */}
            <Button mode='contained' onPress={() => { }}>Buy</Button>
          </View>
        </View>
      </List.Accordion>
      <Divider style={{ marginTop: 5 }} />
    </View>
  )

  useEffect(() => {
    loadData();
  }, [user])

  return (
    loading ? <LoadingScreen /> :
      <ScrollView
        style={{
          margin: 10
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
      >
        <List.Section title="All Mock Test &#x2022; Class wise">{listItem}</List.Section>
      </ScrollView>
  )
}