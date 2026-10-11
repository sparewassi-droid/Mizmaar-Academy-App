export interface DailyVerse {
  id: number;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  theme: string;
  reflection: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    id: 1,
    surahNumber: 94,
    surahName: 'Ash-Sharh (The Relief)',
    surahNameArabic: 'الشرح',
    ayahNumber: 5,
    arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship comes ease.',
    theme: 'Hope & Perseverance',
    reflection: 'No matter what difficulty you face in your studies or life, Allah has already prepared double the relief alongside it.',
  },
  {
    id: 2,
    surahNumber: 2,
    surahName: 'Al-Baqarah (The Cow)',
    surahNameArabic: 'البقرة',
    ayahNumber: 152,
    arabicText: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    theme: 'Gratitude & Remembrance',
    reflection: 'Whenever your heart or tongue remembers Allah in dhikr, the Lord of all creation is remembering you at that very moment.',
  },
  {
    id: 3,
    surahNumber: 20,
    surahName: 'Taha',
    surahNameArabic: 'طه',
    ayahNumber: 114,
    arabicText: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: "My Lord! Increase me in knowledge."',
    theme: 'Seeking Knowledge',
    reflection: 'The Prophet ﷺ was instructed to ask for an increase in knowledge above all else—an inspiration for our Tajweed journey.',
  },
  {
    id: 4,
    surahNumber: 2,
    surahName: 'Al-Baqarah (The Cow)',
    surahNameArabic: 'البقرة',
    ayahNumber: 186,
    arabicText: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    translation: 'And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
    theme: 'Closeness & Dua',
    reflection: 'Allah is closer to you than anyone else. Whenever you raise your hands or whisper a prayer, He hears you instantly.',
  },
  {
    id: 5,
    surahNumber: 39,
    surahName: 'Az-Zumar (The Groups)',
    surahNameArabic: 'الزمر',
    ayahNumber: 53,
    arabicText: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    translation: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
    theme: 'Divine Mercy',
    reflection: 'Never lose hope in Allah’s boundless mercy. Every mistake is an open door to turn back with sincere repentance.',
  },
  {
    id: 6,
    surahNumber: 73,
    surahName: 'Al-Muzzammil (The Enshrouded One)',
    surahNameArabic: 'المزمل',
    ayahNumber: 4,
    arabicText: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    translation: 'And recite the Quran with measured, rhythmic recitation (tarteel).',
    theme: 'Recitation & Tajweed',
    reflection: 'Tarteel means beautifying your recitation with clear pronunciation, proper stops, and measured cadence—the essence of Tajweed.',
  },
  {
    id: 7,
    surahNumber: 13,
    surahName: 'Ar-Ra\'d (The Thunder)',
    surahNameArabic: 'الرعد',
    ayahNumber: 28,
    arabicText: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Unquestionably, by the remembrance of Allah hearts find rest.',
    theme: 'Inner Peace',
    reflection: 'When restlessness or stress strikes, turning to the Quran and the remembrance of Allah brings true calm to the soul.',
  },
  {
    id: 8,
    surahNumber: 65,
    surahName: 'At-Talaq (The Divorce)',
    surahNameArabic: 'الطلاق',
    ayahNumber: 3,
    arabicText: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
    translation: 'And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.',
    theme: 'Tawakkul (Reliance)',
    reflection: 'Place your full trust in Allah after making your best effort. What is destined for you will never miss you.',
  },
  {
    id: 9,
    surahNumber: 49,
    surahName: 'Al-Hujurat (The Chambers)',
    surahNameArabic: 'الحجرات',
    ayahNumber: 13,
    arabicText: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ',
    translation: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.',
    theme: 'Righteousness & Humility',
    reflection: 'True nobility is measured not by wealth, lineage, or appearance, but by Taqwa—mindfulness and reverence for Allah.',
  },
  {
    id: 10,
    surahNumber: 55,
    surahName: 'Ar-Rahman (The Beneficent)',
    surahNameArabic: 'الرحمن',
    ayahNumber: 60,
    arabicText: 'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ',
    translation: 'Is the reward for excellence anything other than excellence?',
    theme: 'Ihsan (Excellence)',
    reflection: 'Strive to practice excellence (Ihsan) in your character, worship, and Quranic recitation; Allah rewards excellence with pure goodness.',
  },
  {
    id: 11,
    surahNumber: 14,
    surahName: 'Ibrahim (Abraham)',
    surahNameArabic: 'إبراهيم',
    ayahNumber: 7,
    arabicText: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
    translation: 'If you are grateful, I will surely increase you [in favor].',
    theme: 'Blessings of Gratitude',
    reflection: 'A grateful heart multiplies every blessing. Thank Allah for the gift of hearing, sight, and learning His book.',
  },
  {
    id: 12,
    surahNumber: 2,
    surahName: 'Al-Baqarah (The Cow)',
    surahNameArabic: 'البقرة',
    ayahNumber: 286,
    arabicText: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: 'Allah does not burden a soul beyond that it can bear.',
    theme: 'Compassion & Strength',
    reflection: 'Whatever trials you encounter, know with certainty that Allah has bestowed within you the capacity to overcome them.',
  },
  {
    id: 13,
    surahNumber: 17,
    surahName: 'Al-Isra (The Night Journey)',
    surahNameArabic: 'الإسراء',
    ayahNumber: 82,
    arabicText: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
    translation: 'And We send down of the Quran that which is healing and mercy for the believers.',
    theme: 'Healing in the Quran',
    reflection: 'Reciting and listening to the Quran brings spiritual healing to troubled minds and soothing mercy to tender hearts.',
  },
  {
    id: 14,
    surahNumber: 3,
    surahName: 'Ali \'Imran (Family of Imran)',
    surahNameArabic: 'آل عمران',
    ayahNumber: 159,
    arabicText: 'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ',
    translation: 'So by mercy from Allah, you were lenient with them. And if you had been rude and harsh in heart, they would have disbanded from about you.',
    theme: 'Gentleness & Kindness',
    reflection: 'Gentleness and warmth win hearts. Treat your family, peers, and teachers with soft-spoken courtesy and compassion.',
  },
  {
    id: 15,
    surahNumber: 16,
    surahName: 'An-Nahl (The Bee)',
    surahNameArabic: 'النحل',
    ayahNumber: 125,
    arabicText: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',
    translation: 'Invite to the way of your Lord with wisdom and good instruction.',
    theme: 'Wisdom & Good Speech',
    reflection: 'Share goodness with wisdom, pleasant manners, and beautiful speech that inspires others toward truth.',
  },
  {
    id: 16,
    surahNumber: 103,
    surahName: 'Al-\'Asr (The Declining Day)',
    surahNameArabic: 'العصر',
    ayahNumber: 3,
    arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    translation: 'Except those who believe, do righteous deeds, and advise each other to truth and advise each other to patience.',
    theme: 'Truth & Patience',
    reflection: 'Time is our most precious asset. Spend it strengthening your faith, performing good deeds, and lifting others up in patience.',
  },
  {
    id: 17,
    surahNumber: 21,
    surahName: 'Al-Anbiya (The Prophets)',
    surahNameArabic: 'الأنبياء',
    ayahNumber: 87,
    arabicText: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    theme: 'Dua of Yunus (AS)',
    reflection: 'The supplication that brought Prophet Yunus out of the darkness of the whale—a powerful prayer in times of distress.',
  },
];

/**
 * Returns the daily verse calculated based on the day of the year or Unix day.
 * This guarantees that every day revolves through the 17 verses automatically,
 * while still allowing users to browse/revolve through past and next verses!
 */
export function getDailyVerseForToday(): { verse: DailyVerse; index: number } {
  const now = new Date();
  // Calculate day index since epoch
  const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const verseIndex = Math.abs(dayIndex) % DAILY_VERSES.length;
  return { verse: DAILY_VERSES[verseIndex], index: verseIndex };
}
