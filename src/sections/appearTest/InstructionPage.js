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
      <List.Section
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
      </List.Section>
    </Surface>
  );
}
