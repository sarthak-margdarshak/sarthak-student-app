"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Instructions() {
  const [language, setLanguage] = useState("hindi");

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex gap-2 justify-end mb-4">
        <Button
          variant={language === "english" ? "default" : "outline"}
          onClick={() => setLanguage("english")}
          className="w-24"
        >
          English
        </Button>
        <Button
          variant={language === "hindi" ? "default" : "outline"}
          onClick={() => setLanguage("hindi")}
          className="w-24"
        >
          हिंदी
        </Button>
      </div>

      {language === "english" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Stable Internet Connection</h3>
              <p className="text-gray-600">
                You should be connected to stable internet throughout the test
                for best performance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">No Cheating</h3>
              <p className="text-gray-600">
                Please refrain from cheating or using unauthorized materials
                during the test.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Time Limits</h3>
              <p className="text-gray-600">
                Be aware of the time limits for each section or question or
                mock-test.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Auto-Save</h3>
              <p className="text-gray-600">
                Your progress is automatically saved periodically, so focus on
                answering the questions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Quiet Space</h3>
              <p className="text-gray-600">
                Find a peaceful environment with minimal background noise.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">No Distractions</h3>
              <p className="text-gray-600">
                Keep your phone on DO NOT DISTURB (DND) mode. Put away other
                phones and devices to stay focused.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Auto Submit</h3>
              <p className="text-gray-600">
                Click on SUBMIT button available on top-left corner of this page
                to finish the test. If you do not submit the test before the
                completion if time, it will be auto submitted.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Answer a question</h3>
              <p className="text-gray-600">
                Click on the option you think the best meets the answer to the
                question.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Clear the answer of a question</h3>
              <p className="text-gray-600">
                If you think you have marked a question and want to abort the
                answer, click on the same option to clear your selection.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Navigate the questions</h3>
              <p className="text-gray-600">
                You can swipe left or right to navigate the questions. You can
                also use the buttons at the bottom of this page to navigate the
                questions. On the top right corner there is a grid icon, which
                can be used to go to any question.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">निर्देश</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">स्थिर इंटरनेट कनेक्शन</h3>
              <p className="text-gray-600">
                अपने सर्वोत्तम प्रदर्शन के लिए आपको पूरे परीक्षण के दौरान स्थिर
                इंटरनेट से जुड़ा रहना चाहिए।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">नकल न करें</h3>
              <p className="text-gray-600">
                कृपया परीक्षण के दौरान नकल या अनधिकृत सामग्री का उपयोग करने से
                बचें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">समय सीमा</h3>
              <p className="text-gray-600">
                प्रत्येक खंड या प्रश्न या मॉक-टेस्ट की समय सीमा के बारे में
                जानें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">स्वतः सहेजना</h3>
              <p className="text-gray-600">
                आपकी प्रगति समय-समय पर स्वचालित रूप से सहेजी जाती है, इसलिए
                प्रश्नों के उत्तर देने पर ध्यान केंद्रित करें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">शांत वातावरण</h3>
              <p className="text-gray-600">
                न्यूनतम पृष्ठभूमि शोर के साथ एक शांतिपूर्ण वातावरण खोजें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">कोई व्यवधान नहीं</h3>
              <p className="text-gray-600">
                अपना फोन डू नॉट डिस्टर्ब (DND) मोड पर रखें। ध्यान केंद्रित रहने
                के लिए अन्य फोन और उपकरणों को दूर रखें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">स्वतः जमा करें</h3>
              <p className="text-gray-600">
                परीक्षण समाप्त करने के लिए इस पृष्ठ के ऊपरी-बाएं कोने पर उपलब्ध
                सबमिट बटन पर क्लिक करें। यदि आप समय समाप्त होने से पहले परीक्षण
                जमा नहीं करते हैं, तो यह स्वचालित रूप से जमा हो जाएगा।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">प्रश्न का उत्तर दें</h3>
              <p className="text-gray-600">
                उस विकल्प पर क्लिक करें जो आपको प्रश्न का सबसे अच्छा उत्तर लगता
                है।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">प्रश्न का उत्तर साफ़ करें</h3>
              <p className="text-gray-600">
                यदि आपको लगता है कि आपने किसी प्रश्न को चिह्नित किया है और उत्तर
                को निरस्त करना चाहते हैं, तो अपना चयन साफ़ करने के लिए उसी
                विकल्प पर क्लिक करें।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">प्रश्नों में नेविगेट करें</h3>
              <p className="text-gray-600">
                आप प्रश्नों को नेविगेट करने के लिए बाएं या दाएं स्वाइप कर सकते हैं। आप
                इस पृष्ठ के नीचे दिए गए बटनों का उपयोग भी प्रश्नों को नेविगेट करने के
                लिए कर सकते हैं। ऊपरी दाएं कोने में एक ग्रिड आइकन है, जिसका उपयोग
                किसी भी प्रश्न पर जाने के लिए किया जा सकता है।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
