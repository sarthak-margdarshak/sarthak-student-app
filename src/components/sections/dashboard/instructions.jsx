"use client";

import {
  Wifi,
  ShieldAlert,
  Clock,
  Save,
  VolumeX,
  PhoneOff,
  Send,
  MousePointerClick,
  RotateCcw,
  MoveHorizontal,
  InfoIcon
} from "lucide-react";


export default function Instructions({ lang = "en" }) {
  const instructionsList = [
    {
      icon: Wifi,
      en: {
        title: "Stable Internet Connection",
        desc: "You should be connected to stable internet throughout the test for best performance.",
      },
      hi: {
        title: "स्थिर इंटरनेट कनेक्शन",
        desc: "अपने सर्वोत्तम प्रदर्शन के लिए आपको पूरे परीक्षण के दौरान स्थिर इंटरनेट से जुड़ा रहना चाहिए।"
      }
    },
    {
      icon: ShieldAlert,
      en: {
        title: "No Cheating",
        desc: "Please refrain from cheating or using unauthorized materials during the test.",
      },
      hi: {
        title: "नकल न करें",
        desc: "कृपया परीक्षण के दौरान नकल या अनधिकृत सामग्री का उपयोग करने से बचें।"
      }
    },
    {
      icon: Clock,
      en: {
        title: "Time Limits",
        desc: "Be aware of the time limits for each section or question or mock-test.",
      },
      hi: {
        title: "समय सीमा",
        desc: "प्रत्येक खंड या प्रश्न या मॉक-टेस्ट की समय सीमा के बारे में जानें।"
      }
    },
    {
      icon: Save,
      en: {
        title: "Auto-Save",
        desc: "Your progress is automatically saved periodically, so focus on answering the questions.",
      },
      hi: {
        title: "स्वतः सहेजना",
        desc: "आपकी प्रगति समय-समय पर स्वचालित रूप से सहेजी जाती है, इसलिए प्रश्नों के उत्तर देने पर ध्यान केंद्रित करें।"
      }
    },
    {
      icon: VolumeX,
      en: {
        title: "Quiet Space",
        desc: "Find a peaceful environment with minimal background noise.",
      },
      hi: {
        title: "शांत वातावरण",
        desc: "न्यूनतम पृष्ठभूमि शोर के साथ एक शांतिपूर्ण वातावरण खोजें।"
      }
    },
    {
      icon: PhoneOff,
      en: {
        title: "No Distractions",
        desc: "Keep your phone on DO NOT DISTURB (DND) mode. Put away other phones and devices to stay focused.",
      },
      hi: {
        title: "कोई व्यवधान नहीं",
        desc: "अपना फोन डू नॉट डिस्टर्ब (DND) मोड पर रखें। ध्यान केंद्रित रहने के लिए अन्य फोन और उपकरणों को दूर रखें।"
      }
    },
    {
      icon: Send,
      en: {
        title: "Auto Submit",
        desc: "Click on SUBMIT button available on top-left corner of this page to finish the test. If you do not submit before time ends, it will be auto submitted.",
      },
      hi: {
        title: "स्वतः जमा करें",
        desc: "परीक्षण समाप्त करने के लिए इस पृष्ठ के ऊपरी-बाएं कोने पर उपलब्ध सबमिट बटन पर क्लिक करें। यदि आप समय समाप्त होने से पहले परीक्षण जमा नहीं करते हैं, तो यह स्वचालित रूप से जमा हो जाएगा।"
      }
    },
    {
      icon: MousePointerClick,
      en: {
        title: "Answer a question",
        desc: "Click on the option you think the best meets the answer to the question.",
      },
      hi: {
        title: "प्रश्न का उत्तर दें",
        desc: "उस विकल्प पर क्लिक करें जो आपको प्रश्न का सबसे अच्छा उत्तर लगता है।"
      }
    },
    {
      icon: RotateCcw,
      en: {
        title: "Clear the answer",
        desc: "If you want to clear your selection, click on the same option again.",
      },
      hi: {
        title: "उत्तर साफ़ करें",
        desc: "यदि आप अपना चयन साफ़ करना चाहते हैं, तो उसी विकल्प पर फिर से क्लिक करें।"
      }
    },
    {
      icon: MoveHorizontal,
      en: {
        title: "Navigation",
        desc: "Swipe left/right or use buttons to navigate. Use the grid icon on top right to jump to any question.",
      },
      hi: {
        title: "नेविगेशन",
        desc: "नेविगेट करने के लिए बाएं/दाएं स्वाइप करें या बटन का उपयोग करें। किसी भी प्रश्न पर जाने के लिए ऊपर दाईं ओर ग्रिड आइकन का उपयोग करें।"
      }
    }
  ];

  const isHindi = lang === "hi";

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
        <InfoIcon className="w-6 h-6 text-blue-600" />
        {isHindi ? "निर्देश" : "Instructions"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {instructionsList.map((item, index) => {
          const Icon = item.icon;
          const content = isHindi ? item.hi : item.en;

          return (
            <div key={index} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">
                  {content.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
