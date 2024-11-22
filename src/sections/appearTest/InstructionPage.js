import { List, Surface } from "react-native-paper";

export default function InstructionPage() {
  return (
    <Surface
      elevation={1}
      style={{
        margin: 10,
        marginTop: 20,
        borderRadius: 10,
      }}
    >
      {/* <List.Section
        title="INSTRUCTIONS"
        titleStyle={{ fontFamily: "Laila-Regular" }}
      >
        <List.Item
          title="Stable Internet Connection"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="You should be connected to stable internet throughout the test for best performance of yours"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="No Cheating"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Please refrain from cheating or using unauthorized materials during the test."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Time Limits"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Be aware of the time limits for each section or question or mock-test."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Auto-Save"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Your progress is automatically saved periodically, so focus on answering the questions."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Quiet Space"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Find a peaceful environment with minimal background noise."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="No Distractions"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Keep your phone on DO NOT DISTURB (DND) mode. Put away other phones and devices to stay focused."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Auto Submit"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Click on SUBMIT button available on top-left corner of this page to finish the test. If you do not submit the test before the completion if time, it will be auto submitted."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Answer a question"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="Click on the option you think the best meet the answer to the question."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Clear the answer of a question"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="If you think, you have marked a question and want to abort the answer, click on the same option to abort the answers marked by you."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Navigate the questions"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="At bottom of this page, there will be 3 buttons, which can be used to navigate the questions. On the top right corner ther is 9 dots icon, which can be used to go to any question."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Navigate to next question"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="At bottom of this page, NEXT button can take you to the next question, it will also save the answers marked by you on current question."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Navigate to previous question"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="At bottom of this page, PREVIOUS button can take you to tha previous question,  it will also save the answers marked by you on current question."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="Mark a question to review"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="At bottom of this page, MARK & NEXT button can take you to tha next question,  it will also save the answers as in review marked by you on current question. While submit all marked for review answers will be submittewd for evaluation."
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />
      </List.Section> */}

      <List.Section
        title="निर्देश"
        titleStyle={{ fontFamily: "Laila-Regular" }}
      >
        <List.Item
          title="स्थिर इंटरनेट कनेक्शन"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="अपने सर्वोत्तम प्रदर्शन के लिए आपको पूरे परीक्षण के दौरान स्थिर इंटरनेट से जुड़ा रहना चाहिए।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="कोई धोखा नहीं"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="कृपया परीक्षण के दौरान धोखाधड़ी करने या अनधिकृत सामग्री का उपयोग करने से बचें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="समय सीमा"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="प्रत्येक अनुभाग या प्रश्न या मॉक-टेस्ट के लिए समय सीमा से अवगत रहें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="स्वतः सहेजें"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="आपकी प्रगति समय-समय पर स्वचालित रूप से सहेज ली जाती है, इसलिए प्रश्नों के उत्तर देने पर ध्यान केंद्रित करें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="शांत स्थान"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="न्यूनतम पृष्ठभूमि शोर वाला शांतिपूर्ण वातावरण ढूंढें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="कोई ध्यान भटकाना नहीं"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="अपने फ़ोन को DO NOT DISTURB (DND) मोड पर रखें। ध्यान केंद्रित करने के लिए अन्य फ़ोन और डिवाइस को दूर रखें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="ऑटो सबमिट"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="टेस्ट पूरा करने के लिए इस पेज के ऊपरी-बाएँ कोने पर उपलब्ध SUBMIT बटन पर क्लिक करें। यदि आप समय से पहले टेस्ट सबमिट नहीं करते हैं, तो यह अपने आप सबमिट हो जाएगा।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="प्रश्न का उत्तर दें"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="उस विकल्प पर क्लिक करें जो आपको लगता है कि प्रश्न के उत्तर के लिए सबसे उपयुक्त है।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="किसी प्रश्न का उत्तर साफ़ करें"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="यदि आपको लगता है कि आपने कोई प्रश्न चिह्नित किया है और उत्तर को निरस्त करना चाहते हैं, तो आपके द्वारा चिह्नित उत्तरों को निरस्त करने के लिए उसी विकल्प पर क्लिक करें।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="प्रश्नों पर नेविगेट करें"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="इस पेज के नीचे 3 बटन होंगे, जिनका इस्तेमाल सवालों पर जाने के लिए किया जा सकता है। ऊपरी दाएँ कोने पर 9 डॉट्स आइकन है, जिसका इस्तेमाल किसी भी सवाल पर जाने के लिए किया जा सकता है।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="अगले प्रश्न पर जाएँ"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="इस पृष्ठ के नीचे NEXT बटन आपको अगले प्रश्न पर ले जाएगा, यह वर्तमान प्रश्न पर आपके द्वारा चिह्नित उत्तरों को भी सहेज लेगा।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="पिछले प्रश्न पर जाएँ"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="इस पृष्ठ के नीचे, पिछला बटन आपको पिछले प्रश्न पर ले जाएगा, यह वर्तमान प्रश्न पर आपके द्वारा चिह्नित उत्तरों को भी सहेज लेगा।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />

        <List.Item
          title="समीक्षा के लिए प्रश्न चिह्नित करें"
          titleStyle={{ fontFamily: "Laila-Regular" }}
          descriptionStyle={{ fontFamily: "Laila-Regular" }}
          description="इस पृष्ठ के नीचे, मार्क और नेक्स्ट बटन आपको अगले प्रश्न पर ले जा सकता है, यह आपके द्वारा वर्तमान प्रश्न पर चिह्नित किए गए उत्तरों को समीक्षा के रूप में भी सहेज लेगा। सबमिट करते समय समीक्षा के लिए चिह्नित सभी उत्तर मूल्यांकन के लिए सबमिट किए जाएँगे।"
          descriptionNumberOfLines={5}
          left={() => <List.Icon icon="menu-right" />}
        />
      </List.Section>
    </Surface>
  );
}
