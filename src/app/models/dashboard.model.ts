import { Timestamp } from '@angular/fire/firestore';

export type LeaveType =
  | 'sick'
  | 'vacation'
  | 'personal'
  | 'paternity'
  | 'maternity'
  | 'study'
  | 'unpaid';

export interface Employee {
  id: string;
  personalInformation: {
    image: string;
    full_Name: string;
    date_Of_Birth: Timestamp;
    gender: string;
    nationality: string;
    marital_Status: string;
    address: string;
    languages_Spoken: string[];
  };
  employmentDetails: {
    employee_ID: string;
    date_Of_Joining: Timestamp;
    end_Of_Contract: Timestamp;
    employment_Status: string;
    office_Location: string;
    salary: string;
  };
  professionalInformation: {
    position: string;
    department: string;
    supervisor: string;
    supervisor_Company_Email: string;
  };
  contactInfo: {
    personal_Email: string;
    phone_Number: string;
    linkedin_Profile: string;
    github_Profile: string;
  };
  credentials: {
    company_Email: string;
    password: string;
    repeat_password: string;
  };
  isAdmin: boolean;
  leaveRecords: LeaveRecord[];
}

export interface LeaveRecord {
  id: number;
  leaveType: string;
  leaveStatus: 'approved' | 'pending' | 'rejected';
  approver: string;
  leaveDateFrom: Timestamp;
  leaveDateTo: Timestamp;
  leaveDays: string;
  description: string;
  approver_description: string;
  requestDate: Timestamp;
  halfDay?: boolean;
  AM_PM?: 'am' | 'pm';
}

export interface leavesFilter {
  leaveType: string;
  range: string;
  days: string;
  status: string;
  approver: string;
  leaveId: number;
}

export interface Nationality {
  value: string;
  viewValue: string;
}

export const OFFICIAL_HOLIDAYS_TURKEY: string[] = [
  '1/1/2022',
  '4/23/2022',
  '5/1/2022',
  '5/19/2022',
  '7/15/2022',
  '8/30/2022',
  '10/29/2022',
  '5/2/2022',
  '5/3/2022',
  '5/4/2022',
  '7/9/2022',
  '7/10/2022',
  '7/11/2022',
  '7/12/2022',
  '1/1/2023',
  '4/23/2023',
  '5/1/2023',
  '5/19/2023',
  '7/15/2023',
  '8/30/2023',
  '10/29/2023',
  '4/21/2023',
  '4/22/2023',
  '4/23/2023',
  '6/28/2023',
  '6/29/2023',
  '6/30/2023',
  '7/1/2023',
  '1/1/2024',
  '4/8/2024',
  '4/9/2024',
  '4/10/2024',
  '4/11/2024',
  '4/12/2024',
  '4/23/2024',
  '5/1/2024',
  '5/19/2024',
  '6/17/2024',
  '6/18/2024',
  '6/19/2024',
  '7/15/2024',
  '8/30/2024',
  '10/29/2024',
  '1/1/2025',
  '3/30/2025',
  '3/31/2025',
  '4/1/2025',
  '4/23/2025',
  '5/1/2025',
  '5/19/2025',
  '6/6/2025',
  '6/7/2025',
  '6/8/2025',
  '6/9/2025',
  '7/15/2025',
  '8/30/2025',
  '10/29/2025',
  '1/1/2026',
  '3/20/2026',
  '3/21/2026',
  '4/22/2026',
  '4/23/2026',
  '5/1/2026',
  '5/19/2026',
  '5/27/2026',
  '5/28/2026',
  '5/29/2026',
  '5/30/2026',
  '7/15/2026',
  '8/30/2026',
  '10/29/2026',
];

export const NATIONALITIES: Nationality[] = [
  { value: 'afghan', viewValue: 'Afghan' },
  { value: 'albanian', viewValue: 'Albanian' },
  { value: 'algerian', viewValue: 'Algerian' },
  { value: 'american', viewValue: 'American' },
  { value: 'andorran', viewValue: 'Andorran' },
  { value: 'angolan', viewValue: 'Angolan' },
  { value: 'antiguans', viewValue: 'Antiguans' },
  { value: 'argentinean', viewValue: 'Argentinean' },
  { value: 'armenian', viewValue: 'Armenian' },
  { value: 'australian', viewValue: 'Australian' },
  { value: 'austrian', viewValue: 'Austrian' },
  { value: 'azerbaijani', viewValue: 'Azerbaijani' },
  { value: 'bahamian', viewValue: 'Bahamian' },
  { value: 'bahraini', viewValue: 'Bahraini' },
  { value: 'bangladeshi', viewValue: 'Bangladeshi' },
  { value: 'barbadian', viewValue: 'Barbadian' },
  { value: 'barbudans', viewValue: 'Barbudans' },
  { value: 'batswana', viewValue: 'Batswana' },
  { value: 'belarusian', viewValue: 'Belarusian' },
  { value: 'belgian', viewValue: 'Belgian' },
  { value: 'belizean', viewValue: 'Belizean' },
  { value: 'beninese', viewValue: 'Beninese' },
  { value: 'bhutanese', viewValue: 'Bhutanese' },
  { value: 'bolivian', viewValue: 'Bolivian' },
  { value: 'bosnian', viewValue: 'Bosnian' },
  { value: 'brazilian', viewValue: 'Brazilian' },
  { value: 'british', viewValue: 'British' },
  { value: 'bruneian', viewValue: 'Bruneian' },
  { value: 'bulgarian', viewValue: 'Bulgarian' },
  { value: 'burkinabe', viewValue: 'Burkinabe' },
  { value: 'burmese', viewValue: 'Burmese' },
  { value: 'burundian', viewValue: 'Burundian' },
  { value: 'cambodian', viewValue: 'Cambodian' },
  { value: 'cameroonian', viewValue: 'Cameroonian' },
  { value: 'canadian', viewValue: 'Canadian' },
  { value: 'cape verdean', viewValue: 'Cape Verdean' },
  { value: 'central african', viewValue: 'Central African' },
  { value: 'chadian', viewValue: 'Chadian' },
  { value: 'chilean', viewValue: 'Chilean' },
  { value: 'chinese', viewValue: 'Chinese' },
  { value: 'colombian', viewValue: 'Colombian' },
  { value: 'comoran', viewValue: 'Comoran' },
  { value: 'congolese', viewValue: 'Congolese' },
  { value: 'costa rican', viewValue: 'Costa Rican' },
  { value: 'croatian', viewValue: 'Croatian' },
  { value: 'cuban', viewValue: 'Cuban' },
  { value: 'cypriot', viewValue: 'Cypriot' },
  { value: 'czech', viewValue: 'Czech' },
  { value: 'danish', viewValue: 'Danish' },
  { value: 'djibouti', viewValue: 'Djibouti' },
  { value: 'dominican', viewValue: 'Dominican' },
  { value: 'dutch', viewValue: 'Dutch' },
  { value: 'east timorese', viewValue: 'East Timorese' },
  { value: 'ecuadorean', viewValue: 'Ecuadorean' },
  { value: 'egyptian', viewValue: 'Egyptian' },
  { value: 'emirian', viewValue: 'Emirian' },
  { value: 'equatorial guinean', viewValue: 'Equatorial Guinean' },
  { value: 'eritrean', viewValue: 'Eritrean' },
  { value: 'estonian', viewValue: 'Estonian' },
  { value: 'ethiopian', viewValue: 'Ethiopian' },
  { value: 'fijian', viewValue: 'Fijian' },
  { value: 'filipino', viewValue: 'Filipino' },
  { value: 'finnish', viewValue: 'Finnish' },
  { value: 'french', viewValue: 'French' },
  { value: 'gabonese', viewValue: 'Gabonese' },
  { value: 'gambian', viewValue: 'Gambian' },
  { value: 'georgian', viewValue: 'Georgian' },
  { value: 'german', viewValue: 'German' },
  { value: 'ghanaian', viewValue: 'Ghanaian' },
  { value: 'greek', viewValue: 'Greek' },
  { value: 'grenadian', viewValue: 'Grenadian' },
  { value: 'guatemalan', viewValue: 'Guatemalan' },
  { value: 'guinea-bissauan', viewValue: 'Guinea-Bissauan' },
  { value: 'guinean', viewValue: 'Guinean' },
  { value: 'guyanese', viewValue: 'Guyanese' },
  { value: 'haitian', viewValue: 'Haitian' },
  { value: 'herzegovinian', viewValue: 'Herzegovinian' },
  { value: 'honduran', viewValue: 'Honduran' },
  { value: 'hungarian', viewValue: 'Hungarian' },
  { value: 'icelander', viewValue: 'Icelander' },
  { value: 'indian', viewValue: 'Indian' },
  { value: 'indonesian', viewValue: 'Indonesian' },
  { value: 'iranian', viewValue: 'Iranian' },
  { value: 'iraqi', viewValue: 'Iraqi' },
  { value: 'irish', viewValue: 'Irish' },
  { value: 'israeli', viewValue: 'Israeli' },
  { value: 'italian', viewValue: 'Italian' },
  { value: 'ivorian', viewValue: 'Ivorian' },
  { value: 'jamaican', viewValue: 'Jamaican' },
  { value: 'japanese', viewValue: 'Japanese' },
  { value: 'jordanian', viewValue: 'Jordanian' },
  { value: 'kazakhstani', viewValue: 'Kazakhstani' },
  { value: 'kenyan', viewValue: 'Kenyan' },
  { value: 'kittian and nevisian', viewValue: 'Kittian and Nevisian' },
  { value: 'kuwaiti', viewValue: 'Kuwaiti' },
  { value: 'kyrgyz', viewValue: 'Kyrgyz' },
  { value: 'laotian', viewValue: 'Laotian' },
  { value: 'latvian', viewValue: 'Latvian' },
  { value: 'lebanese', viewValue: 'Lebanese' },
  { value: 'liberian', viewValue: 'Liberian' },
  { value: 'libyan', viewValue: 'Libyan' },
  { value: 'liechtensteiner', viewValue: 'Liechtensteiner' },
  { value: 'lithuanian', viewValue: 'Lithuanian' },
  { value: 'luxembourger', viewValue: 'Luxembourger' },
  { value: 'macedonian', viewValue: 'Macedonian' },
  { value: 'malagasy', viewValue: 'Malagasy' },
  { value: 'malawian', viewValue: 'Malawian' },
  { value: 'malaysian', viewValue: 'Malaysian' },
  { value: 'maldivan', viewValue: 'Maldivan' },
  { value: 'malian', viewValue: 'Malian' },
  { value: 'maltese', viewValue: 'Maltese' },
  { value: 'marshallese', viewValue: 'Marshallese' },
  { value: 'mauritanian', viewValue: 'Mauritanian' },
  { value: 'mauritian', viewValue: 'Mauritian' },
  { value: 'mexican', viewValue: 'Mexican' },
  { value: 'micronesian', viewValue: 'Micronesian' },
  { value: 'moldovan', viewValue: 'Moldovan' },
  { value: 'monacan', viewValue: 'Monacan' },
  { value: 'mongolian', viewValue: 'Mongolian' },
  { value: 'moroccan', viewValue: 'Moroccan' },
  { value: 'mosotho', viewValue: 'Mosotho' },
  { value: 'motswana', viewValue: 'Motswana' },
  { value: 'mozambican', viewValue: 'Mozambican' },
  { value: 'namibian', viewValue: 'Namibian' },
  { value: 'nauruan', viewValue: 'Nauruan' },
  { value: 'nepalese', viewValue: 'Nepalese' },
  { value: 'new zealander', viewValue: 'New Zealander' },
  { value: 'ni-vanuatu', viewValue: 'Ni-Vanuatu' },
  { value: 'nicaraguan', viewValue: 'Nicaraguan' },
  { value: 'nigerien', viewValue: 'Nigerien' },
  { value: 'north korean', viewValue: 'North Korean' },
  { value: 'northern irish', viewValue: 'Northern Irish' },
  { value: 'norwegian', viewValue: 'Norwegian' },
  { value: 'omani', viewValue: 'Omani' },
  { value: 'pakistani', viewValue: 'Pakistani' },
  { value: 'palauan', viewValue: 'Palauan' },
  { value: 'panamanian', viewValue: 'Panamanian' },
  { value: 'papua new guinean', viewValue: 'Papua New Guinean' },
  { value: 'paraguayan', viewValue: 'Paraguayan' },
  { value: 'peruvian', viewValue: 'Peruvian' },
  { value: 'polish', viewValue: 'Polish' },
  { value: 'portuguese', viewValue: 'Portuguese' },
  { value: 'qatari', viewValue: 'Qatari' },
  { value: 'romanian', viewValue: 'Romanian' },
  { value: 'russian', viewValue: 'Russian' },
  { value: 'rwandan', viewValue: 'Rwandan' },
  { value: 'saint lucian', viewValue: 'Saint Lucian' },
  { value: 'salvadoran', viewValue: 'Salvadoran' },
  { value: 'samoan', viewValue: 'Samoan' },
  { value: 'san marinese', viewValue: 'San Marinese' },
  { value: 'sao tomean', viewValue: 'Sao Tomean' },
  { value: 'saudi', viewValue: 'Saudi' },
  { value: 'scottish', viewValue: 'Scottish' },
  { value: 'senegalese', viewValue: 'Senegalese' },
  { value: 'serbian', viewValue: 'Serbian' },
  { value: 'seychellois', viewValue: 'Seychellois' },
  { value: 'sierra leonean', viewValue: 'Sierra Leonean' },
  { value: 'singaporean', viewValue: 'Singaporean' },
  { value: 'slovakian', viewValue: 'Slovakian' },
  { value: 'slovenian', viewValue: 'Slovenian' },
  { value: 'solomon islander', viewValue: 'Solomon Islander' },
  { value: 'somali', viewValue: 'Somali' },
  { value: 'south african', viewValue: 'South African' },
  { value: 'south korean', viewValue: 'South Korean' },
  { value: 'spanish', viewValue: 'Spanish' },
  { value: 'sri lankan', viewValue: 'Sri Lankan' },
  { value: 'sudanese', viewValue: 'Sudanese' },
  { value: 'surinamer', viewValue: 'Surinamer' },
  { value: 'swazi', viewValue: 'Swazi' },
  { value: 'swedish', viewValue: 'Swedish' },
  { value: 'swiss', viewValue: 'Swiss' },
  { value: 'syrian', viewValue: 'Syrian' },
  { value: 'taiwanese', viewValue: 'Taiwanese' },
  { value: 'tajik', viewValue: 'Tajik' },
  { value: 'tanzanian', viewValue: 'Tanzanian' },
  { value: 'thai', viewValue: 'Thai' },
  { value: 'togolese', viewValue: 'Togolese' },
  { value: 'tongan', viewValue: 'Tongan' },
  {
    value: 'trinidadian or tobagonian',
    viewValue: 'Trinidadian or Tobagonian',
  },
  { value: 'tunisian', viewValue: 'Tunisian' },
  { value: 'turkish', viewValue: 'Turkish' },
  { value: 'tuvaluan', viewValue: 'Tuvaluan' },
  { value: 'ugandan', viewValue: 'Ugandan' },
  { value: 'ukrainian', viewValue: 'Ukrainian' },
  { value: 'uruguayan', viewValue: 'Uruguayan' },
  { value: 'uzbekistani', viewValue: 'Uzbekistani' },
  { value: 'venezuelan', viewValue: 'Venezuelan' },
  { value: 'vietnamese', viewValue: 'Vietnamese' },
  { value: 'welsh', viewValue: 'Welsh' },
  { value: 'yemenite', viewValue: 'Yemenite' },
  { value: 'zambian', viewValue: 'Zambian' },
  { value: 'zimbabwean', viewValue: 'Zimbabwean' },
];

export const LANGUAGES: { [key: string]: string } = {
  afrikans: 'Afrikaans',
  albanian: 'Albanian',
  amharic: 'Amharic',
  arabic: 'Arabic',
  armenian: 'Armenian',
  azerbaijani: 'Azerbaijani',
  basque: 'Basque',
  belarusian: 'Belarusian',
  bengali: 'Bengali',
  bosnian: 'Bosnian',
  bulgarian: 'Bulgarian',
  burmese: 'Burmese',
  catalan: 'Catalan',
  chinese: 'Chinese',
  croatian: 'Croatian',
  czech: 'Czech',
  danish: 'Danish',
  dutch: 'Dutch',
  english: 'English',
  esperanto: 'Esperanto',
  estonian: 'Estonian',
  filipino: 'Filipino',
  finnish: 'Finnish',
  french: 'French',
  galician: 'Galician',
  georgian: 'Georgian',
  german: 'German',
  greek: 'Greek',
  gujarati: 'Gujarati',
  hausa: 'Hausa',
  hebrew: 'Hebrew',
  hindi: 'Hindi',
  hungarian: 'Hungarian',
  icelandic: 'Icelandic',
  igbo: 'Igbo',
  indonesian: 'Indonesian',
  irish: 'Irish',
  italian: 'Italian',
  japanese: 'Japanese',
  javanese: 'Javanese',
  kannada: 'Kannada',
  kazakh: 'Kazakh',
  khmer: 'Khmer',
  korean: 'Korean',
  kurdish: 'Kurdish',
  kyrgyz: 'Kyrgyz',
  lao: 'Lao',
  latvian: 'Latvian',
  lithuanian: 'Lithuanian',
  luxembourgish: 'Luxembourgish',
  macedonian: 'Macedonian',
  malagasy: 'Malagasy',
  malay: 'Malay',
  malayalam: 'Malayalam',
  maltese: 'Maltese',
  maori: 'Maori',
  marathi: 'Marathi',
  mongolian: 'Mongolian',
  nepali: 'Nepali',
  norwegian: 'Norwegian',
  pashto: 'Pashto',
  persian: 'Persian',
  polish: 'Polish',
  portuguese: 'Portuguese',
  punjabi: 'Punjabi',
  romanian: 'Romanian',
  russian: 'Russian',
  samoan: 'Samoan',
  serbian: 'Serbian',
  shona: 'Shona',
  sindhi: 'Sindhi',
  sinhala: 'Sinhala',
  slovak: 'Slovak',
  slovenian: 'Slovenian',
  somali: 'Somali',
  spanish: 'Spanish',
  sundanese: 'Sundanese',
  swahili: 'Swahili',
  swedish: 'Swedish',
  tajik: 'Tajik',
  tamil: 'Tamil',
  telugu: 'Telugu',
  thai: 'Thai',
  turkish: 'Turkish',
  ukrainian: 'Ukrainian',
  urdu: 'Urdu',
  uzbek: 'Uzbek',
  vietnamese: 'Vietnamese',
  welsh: 'Welsh',
  xhosa: 'Xhosa',
  yiddish: 'Yiddish',
  yoruba: 'Yoruba',
  zulu: 'Zulu',
};

//get the leave days (number of days) without the holidays and weekends
export function calculateLeaveDays(
  startTimestamp: Timestamp,
  endTimestamp: Timestamp
): number {
  let start = startTimestamp.toDate();
  let end = endTimestamp.toDate();
  let leaveDays = 0;

  while (start <= end) {
    const dayOfWeek = start.getDay();
    const dateStr = start.toISOString().split('T')[0];

    if (
      dayOfWeek !== 0 &&
      dayOfWeek !== 6 &&
      !OFFICIAL_HOLIDAYS_TURKEY.includes(dateStr)
    ) {
      leaveDays++;
    }

    start.setDate(start.getDate() + 1);
  }

  return leaveDays;
}
