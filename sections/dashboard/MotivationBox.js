import { Card, Icon, Text } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { useEffect, useState } from "react";
import axios from 'axios';
import { NINJAS_API } from '@env';
import { View } from "react-native";
import greetingTime from "greeting-time";

const categries_english = ['courage', 'dreams', 'education', 'failure', 'great', 'hope', 'imagination', 'inspirational', 'intelligence', 'knowledge', 'learning', 'morning', 'success'];
const categries_hindi = ['positive', 'motivational', 'success'];

const options_english = {
  method: 'GET',
  url: 'https://api.api-ninjas.com/v1/quotes?category=' + categries_english[parseInt(Math.random() * 100) % categries_english.length],
  headers: {
    'X-Api-Key': NINJAS_API,
  }
};

const options_hindi = {
  method: 'GET',
  url: 'https://hindi-quotes.vercel.app/random/' + categries_hindi[parseInt(Math.random() * 100) % categries_hindi.length],
  headers: {}
};

export default function MotivationBox() {

  const { user } = useAuthContext();
  const [quote, setQuote] = useState("Dream no small dreams for they have no power to move the hearts of men.")

  useEffect(() => {
    const fetch_english = async () => {
      try {
        const response = await axios.request(options_hindi);
        if (response.data[0]?.quote) {
          setQuote(response.data[0]?.quote);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
    const fetch_hindi = async () => {
      try {
        const response = await axios.request(options_hindi);
        if (response.data?.quote) {
          setQuote(response.data?.quote);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
    fetch_hindi();
    // fetch_english();
  }, [user])

  return (
    <Card>
      <Card.Title title={'Hi ' + user?.name} subtitle={greetingTime(new Date())} left={() => <Icon size={50} source='comment-quote' />} />
      <Card.Content>
        <Icon source='format-quote-open' />
        <Text style={{ marginStart: 8 }} variant="bodyMedium">{quote}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Icon source='format-quote-close' />
        </View>
      </Card.Content>
    </Card>
  )
}