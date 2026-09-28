import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Languages,
  Umbrella,
  Zap,
  Wind,
  PhoneCall,
  ExternalLink,
  Shield,
  Info
} from 'lucide-react';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';

type CitizenLang = 'en' | 'hi' | 'mr';

export const CitizenSafetyPage: React.FC = () => {
  const [lang, setLang] = useState<CitizenLang>('en');
  const [selectedRegion, setSelectedRegion] = useState<'delhi' | 'kullu' | 'nashik'>('delhi');

  const content = {
    en: {
      title: 'PRAGYA CITIZEN WEATHER SAFETY',
      subtitle: 'Public Research Early Advisory Interface',
      officialReminder: 'For official weather forecasts, severe warnings, and evacuation orders, always follow the India Meteorological Department (IMD) and local Disaster Management Authorities.',
      weatherStates: {
        safe: 'NO SIGNIFICANT SIGNAL',
        monitoring: 'MONITORING DEVELOPING CONDITIONS',
        elevated: 'ELEVATED WEATHER POTENTIAL',
        highAttention: 'HIGH ATTENTION — RESEARCH SIGNAL',
      },
      regions: {
        delhi: {
          name: 'Dhaula Kuan & South-West NCT Delhi',
          state: 'HIGH ATTENTION — RESEARCH SIGNAL',
          situation: 'Atmospheric conditions indicate developing localized intense rain within the next 45 minutes.',
          window: '17:15 – 18:30 IST',
          confidence: 'Moderate-to-High (Research Prototype)',
          safetyTips: [
            'Avoid parking or driving through known waterlogging underpasses (Dhaula Kuan, Moti Bagh).',
            'Stay away from electrical poles, fallen cables, and open stormwater drains during heavy downpours.',
            'Keep emergency numbers handy and check official local municipal updates.',
          ],
        },
        kullu: {
          name: 'Kullu Valley & Upper Beas Basin (Himachal Pradesh)',
          state: 'MONITORING DEVELOPING CONDITIONS',
          situation: 'High atmospheric moisture observed; mid-level dry air currently suppressing major rain clouds.',
          window: 'Next 3–4 Hours',
          confidence: 'Moderate',
          safetyTips: [
            'Maintain safe distance from riverbanks and seasonal streams in mountain terrain.',
            'Be vigilant for localized mudslides along steep hillside roadways.',
            'Monitor official IMD Shimla and Himachal SDRF bulletins.',
          ],
        },
        nashik: {
          name: 'Nashik & Western Ghats Foothills (Maharashtra)',
          state: 'NO SIGNIFICANT SIGNAL',
          situation: 'Typical monsoon cloud cover with light scattered showers; no severe convective anomaly detected.',
          window: 'Normal Weather Cadence',
          confidence: 'High',
          safetyTips: [
            'Normal outdoor activities safe; follow standard monsoon precautions.',
          ],
        },
      },
      whatYouCanDo: 'What You Can Do',
      emergencyContactsTitle: 'Emergency Help Numbers (India)',
      footerDisclaimer: 'PRAGYA is an experimental scientific research architecture developed to study convective predictability. This page is NOT an official government emergency alert platform.',
    },
    hi: {
      title: 'प्रज्ञा नागरिक मौसम सुरक्षा',
      subtitle: 'सार्वजनिक अनुसंधान पूर्व-परामर्श मंच',
      officialReminder: 'आधिकारिक मौसम पूर्वानुमान, चेतावनी और आपातकालीन निर्देशों हेतु सदैव भारत मौसम विज्ञान विभाग (IMD) तथा स्थानीय आपदा प्रबंधन प्राधिकरण का पालन करें।',
      weatherStates: {
        safe: 'कोई विशेष चेतावनी नहीं',
        monitoring: 'स्थिति पर निरंतर निगरानी',
        elevated: 'मौसम हलचल की बढ़ती संभावना',
        highAttention: 'उच्च ध्यान — अनुसंधान संकेत',
      },
      regions: {
        delhi: {
          name: 'धौला कुआँ एवं दक्षिण-पश्चिम दिल्ली',
          state: 'उच्च ध्यान — अनुसंधान संकेत',
          situation: 'वायुमंडलीय विश्लेषण अगले ४५ मिनट में तेज स्थानीय बारिश बनने की संभावना दर्शा रहा है।',
          window: 'शाम १७:१५ - १८:३० (IST)',
          confidence: 'मध्यम से उच्च (प्रायोगिक अनुसंधान)',
          safetyTips: [
            'धौला कुआँ और मोती बाग जैसे जलभराव वाले अंडरपास में जाने से बचें।',
            'भारी बारिश के दौरान बिजली के खंभों, तारों और खुले नालों से दूरी बनाए रखें।',
            'आपातकालीन हेल्पलाइन नंबर तैयार रखें और आधिकारिक घोषणाओं पर ध्यान दें।',
          ],
        },
        kullu: {
          name: 'कुल्लू घाटी एवं ऊपरी ब्यास बेसिन (हिमाचल प्रदेश)',
          state: 'स्थिति पर निरंतर निगरानी',
          situation: 'वातावरण में नमी अधिक है, किन्तु शुष्क हवा के कारण बड़े बादलों की तीव्रता अभी थमी हुई है।',
          window: 'अगले ३-४ घंटे',
          confidence: 'मध्यम',
          safetyTips: [
            'पहाड़ी नदियों और मौसमी नालों के तट से सुरक्षित दूरी बनाए रखें।',
            'तीव्र ढलान वाले मार्गों पर भूस्खलन के प्रति सतर्क रहें।',
            'मौसम विभाग शिमला तथा हिमाचल एसडीआरएफ के निर्देशों का पालन करें।',
          ],
        },
        nashik: {
          name: 'नासिक एवं पश्चिमी घाट तलहटी (महाराष्ट्र)',
          state: 'कोई विशेष चेतावनी नहीं',
          situation: 'सामान्य मानसूनी बादल तथा हल्की वर्षा; किसी अतिवृष्टि की संभावना नहीं।',
          window: 'सामान्य मौसम',
          confidence: 'उच्च',
          safetyTips: [
            'सामान्य गतिविधियां जारी रखी जा सकती हैं; मानसूनी सावधानी बरतें।',
          ],
        },
      },
      whatYouCanDo: 'नागरिक सुरक्षा उपाय',
      emergencyContactsTitle: 'आपातकालीन सहायता नंबर (भारत)',
      footerDisclaimer: 'प्रज्ञा एक प्रयोगात्मक वैज्ञानिक अनुसंधान प्रणाली है। यह कोई आधिकारिक सरकारी चेतावनी नहीं है।',
    },
    mr: {
      title: 'प्रज्ञा नागरिक हवामान सुरक्षा',
      subtitle: 'सार्वजनिक संशोधन पूर्व-सूचना व्यासपीठ',
      officialReminder: 'अधिकृत हवामान अंदाज, अतिवृष्टी सूचना आणि आणीबाणीच्या सूचनांसाठी नेहमी भारतीय हवामान विभाग (IMD) आणि स्थानिक आपत्ती व्यवस्थापन प्राधिकरणाचे पालन करा.',
      weatherStates: {
        safe: 'कोणताही गंभीर इशारा नाही',
        monitoring: 'वातावरणावर सातत्यपूर्ण देखरेख',
        elevated: 'हवामान बदलाची वाढती शक्यता',
        highAttention: 'विशेष दक्षता — संशोधन संकेत',
      },
      regions: {
        delhi: {
          name: 'धौला कुआँ आणि नैऋत्य दिल्ली परिसर',
          state: 'विशेष दक्षता — संशोधन संकेत',
          situation: 'पुढील ४५ मिनिटांत मुसळधार स्थानिक पर्जन्यवृष्टीची निर्मिती होण्याचे वातावरणीय संकेत आहेत.',
          window: 'संध्याकाळी १७:१५ - १८:३० (IST)',
          confidence: 'मध्यम ते उच्च (संशोधन प्रारूप)',
          safetyTips: [
            'पाणी साचणाऱ्या भुयारी मार्गांमधून (अंडरपास) प्रवास करणे टाळा.',
            'जोरदार पावसाच्या वेळी विजेचे खांब आणि तुटलेल्या तारांपासून दूर राहा.',
            'स्थानिक प्रशासनाच्या अधिकृत सूचनांचे काटेकोर पालन करा.',
          ],
        },
        kullu: {
          name: 'कुल्लू खोरे आणि ब्यास नदी परिसर (हिमाचल प्रदेश)',
          state: 'वातावरणावर सातत्यपूर्ण देखरेख',
          situation: 'हवेत उच्च आर्द्रता नोंदवली गेली आहे, तरीही कोरड्या हवेमुळे वादळी ढगांची निर्मिती नियंत्रित आहे.',
          window: 'पुढील ३-४ तास',
          confidence: 'मध्यम',
          safetyTips: [
            'डोंगराळ नद्या आणि ओढ्यांच्या काठापासून सुरक्षित अंतरावर राहा.',
            'दरड कोसळण्याच्या संभाव्य क्षेत्रांतून प्रवास करताना विशेष दक्षता घ्या.',
            'स्थानिक आपत्ती निवारण पथकांच्या सूचना ऐका.',
          ],
        },
        nashik: {
          name: 'नाशिक आणि पश्चिम घाट परिसर (महाराष्ट्र)',
          state: 'कोणताही गंभीर इशारा नाही',
          situation: 'सामान्य पावसाळी ढग आणि हलक्या सरी; कोणत्याही अतिवृष्टीची नोंद नाही.',
          window: 'सामान्य हवामान स्थिती',
          confidence: 'उच्च',
          safetyTips: [
            'दैनंदिन व्यवहार सुरक्षितपणे सुरू ठेवता येतील; पावसाळी काळजी घ्या.',
          ],
        },
      },
      whatYouCanDo: 'नागरिक सुरक्षा सूचना',
      emergencyContactsTitle: 'आपत्कालीन संपर्क क्रमांक (भारत)',
      footerDisclaimer: 'प्रज्ञा हे एक प्रायोगिक वैज्ञानिक संशोधन व्यासपीठ आहे. हा कोणताही अधिकृत सरकारी इशारा नाही.',
    },
  };

  const t = content[lang];
  const activeRegion = t.regions[selectedRegion];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Top Header & Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-wide font-mono">
              {t.title}
            </h1>
            <p className="text-xs text-scientific-muted font-mono">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Trilingual Language Selector */}
        <div className="flex items-center space-x-1 bg-graphite-950 p-1.5 rounded-lg border border-scientific-border text-xs font-mono">
          <Languages className="w-4 h-4 text-scientific-muted ml-2 mr-1" />
          {(['en', 'hi', 'mr'] as CitizenLang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                lang === l
                  ? 'bg-observation text-graphite-950 shadow'
                  : 'text-scientific-muted hover:text-slate-200'
              }`}
            >
              {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent Official Source Reminder Banner */}
      <div className="bg-blue-950/40 border border-blue-500/40 p-4 rounded-xl flex items-start space-x-3.5 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-200 uppercase font-mono block tracking-wider">
            OFFICIAL ADVISORY NOTICE
          </span>
          <p className="text-blue-100/90 leading-relaxed font-sans">
            {t.officialReminder}
          </p>
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['delhi', 'kullu', 'nashik'] as const).map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
              selectedRegion === reg
                ? 'bg-scientific-panel border-observation text-slate-100 shadow'
                : 'bg-graphite-900 border-scientific-border text-scientific-muted hover:text-slate-200'
            }`}
          >
            {t.regions[reg].name}
          </button>
        ))}
      </div>

      {/* Main Citizen Alert Card */}
      <div className="bg-graphite-900 border border-scientific-border rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-scientific-border pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-scientific-muted mb-1">
              <MapPin className="w-3.5 h-3.5 text-observation" />
              <span>{activeRegion.name}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {activeRegion.situation}
            </h2>
          </div>

          <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
            activeRegion.state.includes('HIGH') || activeRegion.state.includes('उच्च') || activeRegion.state.includes('विशेष')
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
          }`}>
            {activeRegion.state}
          </span>
        </div>

        {/* Window & Confidence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-graphite-950 p-4 rounded-lg border border-scientific-border space-y-1">
            <span className="text-scientific-muted block text-[11px] uppercase">
              POTENTIAL TIME WINDOW
            </span>
            <div className="flex items-center space-x-2 text-base font-bold text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{activeRegion.window}</span>
            </div>
          </div>

          <div className="bg-graphite-950 p-4 rounded-lg border border-scientific-border space-y-1">
            <span className="text-scientific-muted block text-[11px] uppercase">
              RESEARCH CONFIDENCE
            </span>
            <div className="flex items-center space-x-2 text-base font-bold text-observation">
              <Shield className="w-4 h-4 text-observation" />
              <span>{activeRegion.confidence}</span>
            </div>
          </div>
        </div>

        {/* Safety Guidance */}
        <div className="space-y-3 pt-2">
          <h3 className="font-mono font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-observation" />
            <span>{t.whatYouCanDo}</span>
          </h3>

          <ul className="space-y-2.5">
            {activeRegion.safetyTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-graphite-950 border border-scientific-border text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-graphite-800 text-observation font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Helpline Contacts */}
      <div className="bg-graphite-900 border border-scientific-border rounded-xl p-5 font-mono text-xs space-y-3">
        <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>{t.emergencyContactsTitle}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-graphite-950 border border-scientific-border">
            <span className="text-scientific-muted block text-[10px]">National Emergency</span>
            <span className="font-bold text-slate-100 text-sm">112</span>
          </div>
          <div className="p-3 rounded-lg bg-graphite-950 border border-scientific-border">
            <span className="text-scientific-muted block text-[10px]">Disaster Management</span>
            <span className="font-bold text-slate-100 text-sm">1078</span>
          </div>
          <div className="p-3 rounded-lg bg-graphite-950 border border-scientific-border">
            <span className="text-scientific-muted block text-[10px]">Ambulance</span>
            <span className="font-bold text-slate-100 text-sm">108</span>
          </div>
          <div className="p-3 rounded-lg bg-graphite-950 border border-scientific-border">
            <span className="text-scientific-muted block text-[10px]">IMD Weather Mausam</span>
            <span className="font-bold text-slate-100 text-sm">1800-180-1717</span>
          </div>
        </div>
      </div>

      {/* Public Scientific Disclaimer Footer */}
      <footer className="text-center font-mono text-[11px] text-scientific-muted px-4 py-2 border-t border-scientific-border/60">
        <p>{t.footerDisclaimer}</p>
      </footer>
    </div>
  );
};
