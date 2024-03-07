import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { SnackbarContext } from "../../../hooks/useSnackbar";
import AuthGuard from "../../../auth/AuthGuard";
import NavigationEffect from "../../../components/NavigationEffect";
import { Query } from "appwrite";
import { APPWRITE_DATABASE, APPWRITE_DATABASE_MOCK_TEST_PRICE_TAG, APPWRITE_DATABASE_SUBJECTS, APPWRITE_DATABASE_STANDARDS } from "@env"
import { databases } from "../../../auth/AppwriteContext";
import LoadingScreen from "../../../components/LoadingScreen";

export default function StandardPage() {
  const { standardId } = useLocalSearchParams();
  const { user } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext);

  const [loading, setLoading] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [standardName, setStandardName] = useState('Loading...')

  const loadData = async () => {
    setLoading(true);
    try {
      var ans = [];
      const x = await databases.listDocuments(
        APPWRITE_DATABASE,
        APPWRITE_DATABASE_MOCK_TEST_PRICE_TAG,
        [
          Query.equal('standardId', standardId),
          Query.isNotNull('subjectId'),
          Query.isNull('chapterId'),
          Query.isNull('conceptId'),
          Query.limit(100),
        ]
      )
      for (let i in x.documents) {
        const y = (await databases.getDocument(
          APPWRITE_DATABASE,
          APPWRITE_DATABASE_SUBJECTS,
          x.documents[i].subjectId
        ));
        ans.push({
          title: y.name,
          count: y.count,
          sellPrice: x.documents[i].sell_price,
          mrp: x.documents[i].mrp,
          subjectId: x.documents[i].subjectId,
          chapterCount: y.chapterIds.length,
        })
      }
      setSubjectList(ans)
      const tmp = await databases.getDocument(
        APPWRITE_DATABASE,
        APPWRITE_DATABASE_STANDARDS,
        standardId
      )
      setStandardName(tmp.name)
    } catch (error) {
      showSnackbar(error.message)
    }
    setLoading(false);
  }

  const listItem = subjectList.map((value) =>
    <View key={value.subjectId} style={{marginTop: 5}}>
      <List.Accordion
        description={'Contains ' + value.count + ' mock tests in ' + value.chapterCount + ' chapters'}
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
            <Button mode='elevated' onPress={() => router.push('/mockTests/'+standardId+'/'+value.subjectId)}>Explore</Button>
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
  }, [standardId, user])

  return (
    <AuthGuard>
      <NavigationEffect>
        <Appbar.Header
          elevated={true}
        >
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={standardName} titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>
        {
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
            <List.Section title="All Mock Test &#x2022; Subject wise">{listItem}</List.Section>
          </ScrollView>
        }
      </NavigationEffect>
    </AuthGuard>
  )
}