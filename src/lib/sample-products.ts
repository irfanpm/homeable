import type { Product } from './types';
import { localized as l } from './i18n';
const rows = [
 ['ceramic-vase','Sculptural ceramic vase','സെറാമിക് പൂപ്പാത്രം','सिरेमिक फूलदान','செராமிக் பூச்சாடி','decor',649,899,'vase','bestseller','Ceramic','18 × 10 cm'],
 ['everyday-mug','The everyday mug','ദൈനംദിന കപ്പ്','रोज़मर्रा का मग','அன்றாட கோப்பை','kitchen',349,499,'mug','bestseller','Stoneware','300 ml'],
 ['woven-basket','Natural woven basket','നെയ്ത സംഭരണക്കൂട്','बुनी हुई टोकरी','பின்னிய சேமிப்புக் கூடை','storage',799,1099,'basket','','Natural fibre','28 × 24 cm'],
 ['linen-cushion','Soft linen cushion','ലിനൻ കുഷൻ','लिनेन कुशन','லினன் குஷன்','living',599,799,'cushion','new','Linen blend','40 × 40 cm'],
 ['wooden-tray','Everyday wooden tray','തടികൊണ്ടുള്ള ട്രേ','लकड़ी की ट्रे','மரத் தட்டு','kitchen',549,749,'tray','','Wood','30 × 20 cm'],
 ['bedside-light','Warm glow table lamp','ടേബിൾ വിളക്ക്','टेबल लैंप','மேசை விளக்கு','bedroom',1499,1899,'lamp','new','Wood & fabric','32 × 18 cm'],
 ['cotton-throw','Textured cotton throw','കോട്ടൺ പുതപ്പ്','कॉटन थ्रो','பருத்திப் போர்வை','bedroom',999,1299,'throw','','Cotton blend','130 × 170 cm'],
 ['bath-towel','Everyday cotton towel','കോട്ടൺ ടവൽ','कॉटन तौलिया','பருத்தித் துண்டு','bath',449,649,'towel','bestseller','Cotton','70 × 140 cm'],
 ['glass-carafe','Clear glass carafe','ഗ്ലാസ് ജഗ്','कांच का कैराफ़','கண்ணாடி குடுவை','kitchen',499,699,'carafe','','Glass','750 ml'],
 ['ceramic-planter','Little ceramic planter','ചെടിച്ചട്ടി','सिरेमिक गमला','செராமிக் செடித்தொட்டி','decor',399,599,'planter','new','Ceramic','12 × 12 cm'],
 ['organiser-set','Neat desk organiser','ഡെസ്ക് ഓർഗനൈസർ','डेस्क ऑर्गनाइज़र','மேசை ஒழுங்குபடுத்தி','storage',699,899,'organiser','','Wood','24 × 16 cm'],
 ['accent-chair','The quiet corner chair','അലങ്കാര കസേര','आराम कुर्सी','அலங்கார நாற்காலி','living',3499,4499,'chair','','Wood & woven seat','75 × 55 cm']
] as const;
export const sampleProducts: Product[] = rows.map((r, i) => ({ id: `sample-${i+1}`, slug:r[0],name:l(r[1],r[2],r[3],r[4]),description:l('A considered essential for a calmer, more beautiful home. This sample listing illustrates the Homebele collection; confirm actual specifications and availability before ordering.','വീടിന് സൗന്ദര്യവും സൗകര്യവും നൽകുന്ന ഒരു മാതൃകാ ഉൽപ്പന്നം. വാങ്ങുന്നതിന് മുമ്പ് യഥാർത്ഥ വിവരങ്ങളും ലഭ്യതയും സ്ഥിരീകരിക്കുക.','घर के लिए एक उपयोगी और सुंदर चीज़। यह नमूना उत्पाद है; खरीदने से पहले वास्तविक विवरण और उपलब्धता की पुष्टि करें।','வீட்டிற்கு அழகும் வசதியும் தரும் மாதிரி பொருள். வாங்குமுன் உண்மையான விவரங்களையும் கிடைக்கும் நிலையையும் உறுதிசெய்யவும்.'),category:r[5],price:r[6],compareAt:r[7],images:[`/images/${r[8]}.jpg`],badge:r[9],featured:i<8,active:true,material:r[10],dimensions:r[11],meeshoUrl:'',sourceNote:'Illustrative sample — replace with supplier-verified product data and licensed product photography.' }));
