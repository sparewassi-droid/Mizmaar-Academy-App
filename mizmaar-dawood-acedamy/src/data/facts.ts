import { Fact } from '../types';

export const FACTS: Record<string, Fact> = {
  // --- MODULE A1: BASIC TAJWEED ---
  'F-A1-01': {
    id: 'F-A1-01',
    text: 'Tajweed means to improve or make excellent: giving every letter its right sound from its right place.',
    source: 'supplied',
  },
  'F-A1-02': {
    id: 'F-A1-02',
    text: 'The short vowels are: Fatha (a), Kasra (i), and Damma (u).',
    source: 'supplied',
  },
  'F-A1-03': {
    id: 'F-A1-03',
    text: 'Tanween is a double vowel at the end of a word: double Fatha (an), double Kasra (in), double Damma (un).',
    source: 'supplied',
  },
  'F-A1-04': {
    id: 'F-A1-04',
    text: 'Sukoon is a small circle meaning no vowel on the letter; Shaddah means a doubled letter.',
    source: 'supplied',
  },
  'F-A1-05': {
    id: 'F-A1-05',
    text: 'Noon Sakinah is a resting noon (noon with no vowel). Its rules, and the rules for Tanween, depend on the letter that comes next: five rules in this app: Izhar, Idgham (no hum), Idgham Bighunnah, Iqlab, and Ikhfa.',
    source: 'supplied',
  },
  'F-A1-06': {
    id: 'F-A1-06',
    text: 'Izhar (Clear): when the next letter is one of the 6 throat letters: ء ه ع ح غ خ.',
    source: 'supplied',
  },
  'F-A1-07': {
    id: 'F-A1-07',
    text: 'Idgham without hum: when the next letter is ل or ر; the noon merges completely.',
    source: 'supplied',
  },
  'F-A1-08': {
    id: 'F-A1-08',
    text: 'Idgham Bighunnah (merge with hum): when the next letter is ي ن م و; remember the word يَنْمُو (yanmu).',
    source: 'supplied',
  },
  'F-A1-09': {
    id: 'F-A1-09',
    text: 'Iqlab (Change): when the next letter is ب; the noon changes into a soft meem with a hum.',
    source: 'supplied',
  },
  'F-A1-10': {
    id: 'F-A1-10',
    text: 'Ikhfa (Hide): when the next letter is one of the remaining 15 letters; the noon is hidden with a soft nasal hum.',
    source: 'supplied',
  },
  'F-A1-11': {
    id: 'F-A1-11',
    text: 'Ghunnah is a nasal hum held about 2 counts. It appears on noon or meem with Shaddah, in Idgham Bighunnah, Iqlab, Ikhfa, and the Meem rules that hide or merge.',
    source: 'supplied',
  },
  'F-A1-12': {
    id: 'F-A1-12',
    text: 'Meem Sakinah rules: Ikhfa Shafawi (before ب), Idgham Shafawi (before م), and Izhar Shafawi (before every other letter).',
    source: 'supplied',
  },
  'F-A1-13': {
    id: 'F-A1-13',
    text: 'Qalqalah is a small bounce or echo when one of the letters ق ط ب ج د has a Sukoon; remember the phrase قُطْبُ جَدّ (Qutbu Jadd).',
    source: 'supplied',
  },
  'F-A1-14': {
    id: 'F-A1-14',
    text: 'The 7 heavy letters are: خ ص ض غ ط ق ظ; all other letters are light.',
    source: 'supplied',
  },

  // --- MODULE A2: INTERMEDIATE TAJWEED ---
  'F-A2-01': {
    id: 'F-A2-01',
    text: 'Idgham has two kinds: with ghunnah (ي ن م و) and without ghunnah (ل ر).',
    source: 'supplied',
  },
  'F-A2-02': {
    id: 'F-A2-02',
    text: 'The 15 Ikhfa letters are: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك.',
    source: 'supplied',
  },
  'F-A2-03': {
    id: 'F-A2-03',
    text: 'Ghunnah is held for about 2 counts.',
    source: 'supplied',
  },
  'F-A2-04': {
    id: 'F-A2-04',
    text: 'Sun letters (14): ت ث د ذ ر ز س ش ص ض ط ظ ل ن. With sun letters the Lam of "Al" is not said and the next letter is doubled (e.g. الشَّمْس, النَّاس, الرَّحْمَن).',
    source: 'supplied',
  },
  'F-A2-05': {
    id: 'F-A2-05',
    text: 'Moon letters (14): ا ب ج ح خ ع غ ف ق ك م ه و ي. With moon letters the Lam is said clearly (e.g. الْقَمَر, الْكِتَاب, الْحَمْد).',
    source: 'supplied',
  },
  'F-A2-06': {
    id: 'F-A2-06',
    text: 'The Lam in the name of Allah is heavy after Fatha or Damma (رَسُولُ اللَّهِ, قَالَ اللَّهُ) and light after Kasra (بِسْمِ اللَّهِ, الْحَمْدُ لِلَّهِ).',
    source: 'supplied',
  },
  'F-A2-07': {
    id: 'F-A2-07',
    text: 'The letter Raa is heavy when it has Fatha or Damma (رَبِّ, رُسُل) and light when it has Kasra (رِزْق).',
    source: 'supplied',
  },
  'F-A2-08': {
    id: 'F-A2-08',
    text: 'Qalqalah is small in the middle of a word (like يَقْطَعُونَ) and bigger when you stop on the letter, especially with Shaddah (like الْحَقّ, أَحَدْ).',
    source: 'supplied',
  },

  // --- MODULE A3: LETTER PRONUNCIATION ---
  'F-A3-01': {
    id: 'F-A3-01',
    text: 'Each letter has a home called its Makhraj. There are 5 general areas: the mouth cavity (Jawf), the throat (Halq), the tongue (Lisan), the lips (Shafatan), and the nose (Khayshum).',
    source: 'supplied',
  },
  'F-A3-02': {
    id: 'F-A3-02',
    text: 'Mouth cavity (Jawf) letters are the stretching letters: ا و ي.',
    source: 'supplied',
  },
  'F-A3-03': {
    id: 'F-A3-03',
    text: 'The throat has 3 parts: deepest is ء ه; middle is ع ح; nearest the mouth is غ خ.',
    source: 'supplied',
  },
  'F-A3-04': {
    id: 'F-A3-04',
    text: 'Lip letters: ب م و (both lips; و is rounded) and ف (top teeth touch inside of lower lip).',
    source: 'supplied',
  },
  'F-A3-05': {
    id: 'F-A3-05',
    text: 'Tongue tip between the teeth makes: ث ذ ظ.',
    source: 'supplied',
  },
  'F-A3-06': {
    id: 'F-A3-06',
    text: 'Tongue tip at the base of the upper front teeth makes: ت د ط. The tongue tip also makes ن, ل, and ر.',
    source: 'supplied',
  },
  'F-A3-07': {
    id: 'F-A3-07',
    text: 'Hissing letters ص س ز are made near the front teeth.',
    source: 'supplied',
  },
  'F-A3-08': {
    id: 'F-A3-08',
    text: 'Middle of the tongue touching the roof of the mouth makes: ج ش ي.',
    source: 'supplied',
  },
  'F-A3-09': {
    id: 'F-A3-09',
    text: 'Back of the tongue makes: ق (deepest) and ك (slightly forward).',
    source: 'supplied',
  },
  'F-A3-10': {
    id: 'F-A3-10',
    text: 'Side of the tongue touching the upper side teeth makes: ض.',
    source: 'supplied',
  },
  'F-A3-11': {
    id: 'F-A3-11',
    text: 'The nose cavity (Khayshum) is where Ghunnah originates.',
    source: 'supplied',
  },
  'F-A3-12': {
    id: 'F-A3-12',
    text: 'Heavy letters خ ص ض غ ط ق ظ are said with the back of the tongue raised; their light partners are س for ص, ت for ط, د for ض, and ذ for ظ.',
    source: 'supplied',
  },
  'F-A3-13': {
    id: 'F-A3-13',
    text: 'Sound guides: Baa like b in ball, Thaa like th in thumb, Dhal like th in this, Jeem like j in jam, Sheen like sh in ship, Zaay like z in zoo, Seen like s in sun, Faa like f in fish, Meem like m in monkey, Waaw like w in whale, Yaa like y in yes, Haa (ه) like h in hello, Haa (ح) is airy h from deep throat, Khaa is raspy sound, Ain is warm squeeze from throat middle, Ghain is gargle, Qaaf is deep k, Kaaf is light k.',
    source: 'supplied',
  },

  // --- MODULE A4: VOCABULARY ---
  'F-A4-01': {
    id: 'F-A4-01',
    text: 'People and names: اللَّه (God), رَبّ (Lord), النَّاس (people), رَسُول (messenger), نَبِيّ (prophet), مَلَائِكَة (angels), أَب (father), أُمّ (mother).',
    source: 'supplied',
  },
  'F-A4-02': {
    id: 'F-A4-02',
    text: 'Time and action: يَوْم (day), لَيْل (night), قَالَ (he said), كَانَ (he was), بَعْد (after), قَبْل (before).',
    source: 'supplied',
  },
  'F-A4-03': {
    id: 'F-A4-03',
    text: 'Connectors: مِنْ (from), فِي (in), عَلَى (on), إِلَى (to), لَا (no, not), إِنَّ (indeed), كُلّ (every, all), عِنْد (with, at).',
    source: 'supplied',
  },
  'F-A4-04': {
    id: 'F-A4-04',
    text: 'Nature: أَرْض (earth), سَمَاء (sky), مَاء (water), نُور (light), شَمْس (sun), قَمَر (moon), نَجْم (star), بَحْر (sea), جَبَل (mountain), شَجَر (trees).',
    source: 'supplied',
  },
  'F-A4-05': {
    id: 'F-A4-05',
    text: 'Faith and ideas: كِتَاب (book), قُرْآن (Quran), سُورَة (chapter), آيَة (verse, sign), قَلْب (heart), عِلْم (knowledge), سَبِيل (path, way), رَحْمَة (mercy), جَنَّة (paradise, garden), نَار (fire), حَقّ (truth), صَلَاة (prayer), زَكَاة (purifying alms), صَوْم (fasting), حَجّ (pilgrimage), إِيمَان (faith), سَلَام (peace), دُعَاء (supplication), خَيْر (good), صَبْر (patience).',
    source: 'supplied',
  },
  'F-A4-06': {
    id: 'F-A4-06',
    text: 'Opposite pairs: يَوْم (day) and لَيْل (night), بَعْد (after) and قَبْل (before), جَنَّة (paradise) and نَار (fire).',
    source: 'supplied',
  },
  'F-A4-07': {
    id: 'F-A4-07',
    text: 'Words of faith and worship include صَلَاة (prayer), زَكَاة (charity), صَوْم (fasting), and حَجّ (pilgrimage).',
    source: 'supplied',
  },

  // --- MODULE A5: MADD ---
  'F-A5-01': {
    id: 'F-A5-01',
    text: 'Madd means stretching a sound. A count (harakah) is about one finger movement or one beat.',
    source: 'supplied',
  },
  'F-A5-02': {
    id: 'F-A5-02',
    text: 'The three Madd letters are: Alif after a Fatha, Waw (with no vowel) after a Damma, and Ya (with no vowel) after a Kasra.',
    source: 'supplied',
  },
  'F-A5-03': {
    id: 'F-A5-03',
    text: 'Two main families: Natural Madd (Asli) and Secondary Madd (Far\'i). In this app we learn 9 named madds: Natural, Muttasil, Munfasil, Lazim, \'Arid lis-Sukoon, Leen, \'Iwad, Badal, and Silah.',
    source: 'supplied',
  },
  'F-A5-04': {
    id: 'F-A5-04',
    text: 'Natural Madd (Asli): the Madd letter with nothing special after it: held for 2 counts (قَالَ, يَقُولُ, قِيلَ).',
    source: 'supplied',
  },
  'F-A5-05': {
    id: 'F-A5-05',
    text: 'Madd Muttasil (connected): a Madd letter followed by a Hamza in the SAME word: 4 or 5 counts (جَاءَ, السَّمَاءِ, شَاءَ).',
    source: 'supplied',
  },
  'F-A5-06': {
    id: 'F-A5-06',
    text: 'Madd Munfasil (separated): a Madd letter at the end of a word and a Hamza at the start of the NEXT word: 4 or 5 counts (إِنَّا أَعْطَيْنَاكَ, فِي أَنْفُسِكُمْ, بِمَا أُنْزِلَ).',
    source: 'supplied',
  },
  'F-A5-07': {
    id: 'F-A5-07',
    text: 'Madd Lazim (necessary): a Madd letter followed by a permanent Sukoon or Shaddah: always 6 counts (الضَّالِّينَ, الْحَاقَّةُ).',
    source: 'supplied',
  },
  'F-A5-08': {
    id: 'F-A5-08',
    text: 'Madd \'Arid lis-Sukoon: when you stop at the end of a word, the last letter gets a temporary Sukoon: 2, 4 or 6 counts (الرَّحِيمْ, الْعَالَمِينْ, يَعْلَمُونْ, نَسْتَعِينْ).',
    source: 'supplied',
  },
  'F-A5-09': {
    id: 'F-A5-09',
    text: 'Madd Leen: when stopping, a Waw or Ya with Sukoon after a Fatha: 2, 4 or 6 counts (خَوْفْ, قُرَيْشْ, الْبَيْتْ).',
    source: 'supplied',
  },
  'F-A5-10': {
    id: 'F-A5-10',
    text: 'Madd \'Iwad: when stopping on double Fatha (not on round Taa ة), the tanween is replaced by a long "aa": 2 counts (عَلِيمًا and حَكِيمًا, said as aleemaa and hakeemaa).',
    source: 'supplied',
  },
  'F-A5-11': {
    id: 'F-A5-11',
    text: 'Madd Badal: a Hamza followed by a Madd letter: 2 counts (آمَنُوا, إِيمَانًا, أُوتُوا, آدَم).',
    source: 'supplied',
  },
  'F-A5-12': {
    id: 'F-A5-12',
    text: 'Madd Silah: the small "ha" at the end of he/his/him words between two vowels. Silah Sughra: 2 counts (لَهُ مَا, فِيهِ هُدًى). Silah Kubra: when a Hamza follows: 4 or 5 counts (مَالَهُ أَخْلَدَهُ).',
    source: 'supplied',
  },
  'F-A5-13': {
    id: 'F-A5-13',
    text: 'Counts follow the Hafs \'an \'Asim recitation: 2 counts = Natural, \'Iwad, Badal, Silah Sughra; 4 or 5 = Muttasil, Munfasil, Silah Kubra; 6 = Lazim; 2, 4 or 6 only when stopping = \'Arid and Leen.',
    source: 'supplied',
  },

  // --- MODULE B1: ADVANCED TAJWEED ---
  'F-B1-01': {
    id: 'F-B1-01',
    text: 'Idgham Kamil (complete merge) happens with ل and ر (no ghunnah) and with ن and م (with ghunnah). Idgham Naqis (incomplete merge) happens with ي and و because part of the ghunnah remains.',
    source: 'supplied',
  },
  'F-B1-02': {
    id: 'F-B1-02',
    text: 'Exception: if the noon sakinah and the Ya or Waw are in the SAME word, the noon is said clearly (Izhar Mutlaq): دُنْيَا, صِنْوَانٌ, قِنْوَانٌ, بُنْيَانٌ.',
    source: 'supplied',
  },
  'F-B1-03': {
    id: 'F-B1-03',
    text: 'When the same letter meets itself (first letter has Sukoon): Idgham Mutamathilayn Saghir (اضْرِبْ بِعَصَاكَ merges the two Baa).',
    source: 'supplied',
  },
  'F-B1-04': {
    id: 'F-B1-04',
    text: 'When two letters share the same Makhraj but differ in characteristics: Idgham Mutajanisayn (قَدْ تَبَيَّنَ, وَقَالَتْ طَائِفَةٌ).',
    source: 'supplied',
  },
  'F-B1-05': {
    id: 'F-B1-05',
    text: 'When two letters have close Makhraj: Idgham Mutaqaribayn (قُلْ رَبِّ, أَلَمْ نَخْلُقْكُمْ).',
    source: 'supplied',
  },
  'F-B1-06': {
    id: 'F-B1-06',
    text: 'Ghunnah ranks from strongest to weakest: noon or meem with Shaddah, then Ikhfa, then Idgham with ghunnah, then Iqlab, then the clear (Izhar) noon or meem.',
    source: 'supplied',
  },
  'F-B1-07': {
    id: 'F-B1-07',
    text: 'Ikhfa is heavier with the heavy letters ص ض ط ظ ق and lighter with the other Ikhfa letters.',
    source: 'supplied',
  },
  'F-B1-08': {
    id: 'F-B1-08',
    text: 'Izhar Shafawi needs extra care before و and ف so the meem is not accidentally hidden.',
    source: 'supplied',
  },
  'F-B1-09': {
    id: 'F-B1-09',
    text: 'Qalqalah has Sughra (small, in the middle of a word) and Kubra (big, when stopping, strongest when the letter has Shaddah).',
    source: 'supplied',
  },
  'F-B1-10': {
    id: 'F-B1-10',
    text: 'Lam of the Name Allah: heavy after Fatha or Damma, light after Kasra.',
    source: 'supplied',
  },
  'F-B1-11': {
    id: 'F-B1-11',
    text: 'Raa is heavy with Fatha or Damma, light with Kasra, heavy when Sakin after Fatha or Damma, and light when Sakin after an original Kasra with no heavy letter after it.',
    source: 'supplied',
  },
  'F-B1-12': {
    id: 'F-B1-12',
    text: 'Sakta (a brief silent pause without breathing) happens in four places in the Hafs recitation.',
    source: 'supplied',
  },
  'F-B1-13': {
    id: 'F-B1-13',
    text: 'Sun letters (14) double the following letter and silence the Lam; Moon letters (14) pronounce the Lam clearly.',
    source: 'supplied',
  },

  // --- MODULE B2: ADVANCED MADD ---
  'F-B2-01': {
    id: 'F-B2-01',
    text: 'Madd Lazim has four kinds: Kalimi Muthaqqal (Shaddah in same word: الضَّالِّينَ, الْحَاقَّةُ), Kalimi Mukhaffaf (Sukoon in same word: آلْآنَ), Harfi Muthaqqal and Harfi Mukhaffaf (in opening letters of surahs like ص, ن, ق). All four are 6 counts.',
    source: 'supplied',
  },
  'F-B2-02': {
    id: 'F-B2-02',
    text: 'Conditions of madds: Muttasil requires Hamza after Madd letter in the SAME word; Munfasil requires Madd letter at end of word and Hamza at start of next; \'Arid and Leen exist only when stopping; Lazim needs permanent Sukoon or Shaddah.',
    source: 'supplied',
  },
  'F-B2-03': {
    id: 'F-B2-03',
    text: 'Silah applies to the pronoun "ha" only when it sits between two voweled letters.',
    source: 'supplied',
  },
  'F-B2-04': {
    id: 'F-B2-04',
    text: 'Madd Leen requires a Waw or Ya with Sukoon after a Fatha, followed by a temporary stop: 2, 4, or 6 counts.',
    source: 'supplied',
  },
  'F-B2-05': {
    id: 'F-B2-05',
    text: 'Madd counts: 2 counts (Natural, \'Iwad, Badal, Silah Sughra), 4 or 5 counts (Muttasil, Munfasil, Silah Kubra), 6 counts (all forms of Lazim), and 2/4/6 counts on stop (\'Arid, Leen).',
    source: 'supplied',
  },

  // --- MODULE B3: STOPPING AND STARTING ---
  'F-B3-01': {
    id: 'F-B3-01',
    text: 'Waqf means stopping the voice for a breath and a pause, with the intention to continue. Ibtida means starting again.',
    source: 'supplied',
  },
  'F-B3-02': {
    id: 'F-B3-02',
    text: 'Categories of stop by meaning: Tam (complete: sentence and meaning finished), Kafi (sufficient: complete sentence but connected in meaning), Hasan (good: may stop but restart earlier), Qabih (bad: stopping spoils meaning).',
    source: 'supplied',
  },
  'F-B3-03': {
    id: 'F-B3-03',
    text: 'Kinds of stop by situation: Ikhtiyari (chosen), Ikhtibari (testing), Idtirari (forced/out of breath), Intizari (waiting).',
    source: 'supplied',
  },
  'F-B3-04': {
    id: 'F-B3-04',
    text: 'Mushaf signs: م = compulsory stop (Waqf Lazim); لا = do not stop; قلى = stopping is better; صلى = continuing is better; ج = stopping or continuing both fine; three-dot sign (Mu\'anaqah) = stop at one place, not both.',
    source: 'supplied',
  },
  'F-B3-05': {
    id: 'F-B3-05',
    text: 'A brief silent pause without taking breath is called Sakta.',
    source: 'supplied',
  },
  'F-B3-06': {
    id: 'F-B3-06',
    text: 'How to stop: words ending in Fatha, Kasra, or Damma stop on Sukoon; round Taa (ة) is said as Haa (ه); double Fatha becomes long "aa" (Madd \'Iwad); double Kasra and double Damma drop tanween to Sukoon.',
    source: 'supplied',
  },
  'F-B3-07': {
    id: 'F-B3-07',
    text: 'Ending a verse (Ayah end) is generally a good and Sunnah place to stop.',
    source: 'supplied',
  },
  'F-B3-08': {
    id: 'F-B3-08',
    text: 'Bad stop example: stopping at فَوَيْلٌ لِلْمُصَلِّينَ spoils meaning because it continues with الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ. Another bad stop: stopping on لَا إِلَهَ before إِلَّا اللَّهُ would deny God.',
    source: 'supplied',
  },
  'F-B3-09': {
    id: 'F-B3-09',
    text: 'Starting (Ibtida) with Hamzat al-Wasl: with "Al" start with Fatha (اَلْحَمْدُ); in verbs start with Damma if 3rd letter has Damma (اُدْعُوا), Kasra otherwise (اِقْرَأْ); in listed nouns (اِبْن, اِسْم) start with Kasra.',
    source: 'supplied',
  },
  'F-B3-10': {
    id: 'F-B3-10',
    text: 'Sakta places in Hafs: after عِوَجًا in Al-Kahf, after مَرْقَدِنَا in Ya-Sin, after مَنْ in Al-Qiyamah, and after بَلْ in Al-Mutaffifin.',
    source: 'supplied',
  },

  // --- MODULE B4: WORD MEANINGS ---
  'F-B4-01': {
    id: 'F-B4-01',
    text: 'Quranic concepts: تَقْوَى (God-consciousness), إِحْسَان (excellence), صَبْر (patience), شُكْر (gratitude), تَوْبَة (repentance), إِيمَان (faith), إِسْلَام (submission), كُفْر (disbelief), شِرْك (polytheism), ظُلْم (injustice), عَدْل (justice), حَقّ (truth), بَاطِل (falsehood), هُدًى (guidance), ضَلَال (misguidance), مَغْفِرَة (forgiveness).',
    source: 'supplied',
  },
  'F-B4-02': {
    id: 'F-B4-02',
    text: 'Further concepts: آخِرَة (Hereafter), دُنْيَا (worldly life), غَيْب (unseen), وَحْي (revelation), فُرْقَان (criterion), ذِكْر (remembrance), صِرَاط (path), أُمَّة (community), نَفْس (soul), حِكْمَة (wisdom), يَقِين (certainty), خُشُوع (humility), فَضْل (bounty), نِعْمَة (blessing), رِزْق (provision), أَجْر (reward), حِسَاب (reckoning), مِيزَان (scale).',
    source: 'supplied',
  },
  'F-B4-03': {
    id: 'F-B4-03',
    text: 'Opposite pairs: نُور and ظُلُمَات (light & darkness), حَقّ and بَاطِل (truth & falsehood), هُدًى and ضَلَال (guidance & misguidance), إِيمَان and كُفْر (faith & disbelief), جَنَّة and نَار (paradise & fire), دُنْيَا and آخِرَة (this life & Hereafter), عَدْل and ظُلْم (justice & injustice), خَيْر and شَرّ (good & evil), حَيَاة and مَوْت (life & death), يُسْر and عُسْر (ease & hardship).',
    source: 'supplied',
  },
  'F-B4-04': {
    id: 'F-B4-04',
    text: 'Three-letter roots: ك ت ب (كِتَاب, كَاتِب, مَكْتُوب, يَكْتُبُونَ); ع ل م (عِلْم, عَالِم, عَلِيم, عَلَّمَ); س ل م (إِسْلَام, مُسْلِم, سَلَام, أَسْلَمَ); أ م ن (إِيمَان, مُؤْمِن, آمَنَ, أَمْن); س ج د (سَجَدَ, سَاجِد, مَسْجِد, سُجُود).',
    source: 'supplied',
  },
  'F-B4-05': {
    id: 'F-B4-05',
    text: 'Quranic verbs: خَلَقَ (created), أَنْزَلَ (sent down), هَدَى (guided), عَلَّمَ (taught), جَعَلَ (made), سَجَدَ (prostrated), رَكَعَ (bowed), يَعْلَمُونَ (they know), يُؤْمِنُونَ (they believe), يَتَّقُونَ (they are mindful).',
    source: 'supplied',
  },
  'F-B4-06': {
    id: 'F-B4-06',
    text: 'Words of Al-Fatiha: الْحَمْدُ (all praise), الْعَالَمِينَ (the worlds), مَالِكِ (Master), يَوْمِ الدِّينِ (Day of Recompense), نَعْبُدُ (we worship), نَسْتَعِينُ (we seek help), اهْدِنَا (guide us), الصِّرَاطَ الْمُسْتَقِيمَ (the straight path), أَنْعَمْتَ (You have blessed), الْمَغْضُوبِ (those who earned anger), الضَّالِّينَ (those who went astray).',
    source: 'supplied',
  },
  'F-B4-07': {
    id: 'F-B4-07',
    text: 'Surah Al-Ikhlas: قُلْ هُوَ اللَّهُ أَحَدٌ (Say: He is Allah, One), اللَّهُ الصَّمَدُ (Allah, the Eternal Refuge), لَمْ يَلِدْ وَلَمْ يُولَدْ (He neither begets nor is born), وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (and there is none comparable to Him).',
    source: 'supplied',
  },
  'F-B4-08': {
    id: 'F-B4-08',
    text: 'Surah Al-Kawthar: إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (We gave you Al-Kawthar), فَصَلِّ لِرَبِّكَ وَانْحَرْ (so pray to your Lord and sacrifice), إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ (indeed the one who hates you is cut off).',
    source: 'supplied',
  },
  'F-B4-09': {
    id: 'F-B4-09',
    text: 'Divine Names: الرَّحْمَنُ (the Most Gracious), الرَّحِيمُ (the Most Merciful), الْمَلِكُ (the King), الْغَفُورُ (the Oft-Forgiving), الْعَلِيمُ (the All-Knowing), السَّمِيعُ (the All-Hearing), الْبَصِيرُ (the All-Seeing), الْخَالِقُ (the Creator), الرَّزَّاقُ (the Provider), الْحَكِيمُ (the All-Wise).',
    source: 'supplied',
  },

  // --- MODULE B5: ADVANCED PRONUNCIATION ---
  'F-B5-01': {
    id: 'F-B5-01',
    text: 'There are 17 specific Makhraj points in 5 general areas: Jawf (1), Halq (3), Lisan (10), Shafatan (2), Khayshum (1).',
    source: 'supplied',
  },
  'F-B5-02': {
    id: 'F-B5-02',
    text: 'Throat points: deepest ء ه; middle ع ح; nearest mouth غ خ.',
    source: 'supplied',
  },
  'F-B5-03': {
    id: 'F-B5-03',
    text: 'Tongue (10 points): deepest back palate ق; just forward ك; middle palate ج ش ي; side tongue teeth ض; tongue edge gums ل; tip ن; tip further back ر; tip base teeth ط د ت; tip lower teeth ص س ز; tip edge upper teeth ظ ذ ث.',
    source: 'supplied',
  },
  'F-B5-04': {
    id: 'F-B5-04',
    text: 'Lips (2 points): inside lower lip with upper front teeth ف; both lips ب م و.',
    source: 'supplied',
  },
  'F-B5-05': {
    id: 'F-B5-05',
    text: 'Mouth cavity (Jawf) makes Madd letters ا و ي. Nose (Khayshum) produces Ghunnah.',
    source: 'supplied',
  },
  'F-B5-06': {
    id: 'F-B5-06',
    text: 'Whispered letters (Hams): ف ح ث ه ش خ ص س ك ت (remember فَحَثَّهُ شَخْصٌ سَكَتَ).',
    source: 'supplied',
  },
  'F-B5-07': {
    id: 'F-B5-07',
    text: 'Strong-stop letters (Shiddah): ء ج د ق ط ب ك ت (remember أَجِدُ قَطٍ بَكَتْ).',
    source: 'supplied',
  },
  'F-B5-08': {
    id: 'F-B5-08',
    text: 'Medium letters (Tawassut): ل ن ع م ر (remember لِنْ عُمَرْ).',
    source: 'supplied',
  },
  'F-B5-09': {
    id: 'F-B5-09',
    text: 'Raised letters (Isti\'la): خ ص ض غ ط ق ظ (remember خُصَّ ضَغْطٍ قِظْ).',
    source: 'supplied',
  },
  'F-B5-10': {
    id: 'F-B5-10',
    text: 'Covered letters (Itbaq): ص ض ط ظ.',
    source: 'supplied',
  },
  'F-B5-11': {
    id: 'F-B5-11',
    text: 'Whistling letters (Safeer): ص ز س.',
    source: 'supplied',
  },
  'F-B5-12': {
    id: 'F-B5-12',
    text: 'Echo letters (Qalqalah): ق ط ب ج د (قُطْبُ جَدّ).',
    source: 'supplied',
  },
  'F-B5-13': {
    id: 'F-B5-13',
    text: 'Special single characteristics: Inhiraf (ل ر), Takreer (ر, avoid rolling), Tafashshi (ش), Istitalah (ض).',
    source: 'supplied',
  },
  'F-B5-14': {
    id: 'F-B5-14',
    text: 'Commonly confused pairs: ض and ظ, ص and س, ث and س, ح and ه, ع and ء, ق and ك, ط and ت.',
    source: 'supplied',
  },

  // --- MODULE B6: TAJWEED IN ACTION ---
  'F-B6-01': {
    id: 'F-B6-01',
    text: 'Applying rules requires: 1) spot the sakinah letter or madd letter, 2) check the following letter or condition, 3) apply the accurate rule and count.',
    source: 'supplied',
  },
  'F-B6-02': {
    id: 'F-B6-02',
    text: 'Phrases often contain multiple simultaneous rules, such as a Noon Sakinah rule alongside a Madd or Qalqalah.',
    source: 'supplied',
  },
  'F-B6-03': {
    id: 'F-B6-03',
    text: 'In Hafs recitation, stopping smoothly with correct Sukoon or Madd \'Iwad protects the sacred text meaning.',
    source: 'supplied',
  },
  'F-B6-04': {
    id: 'F-B6-04',
    text: 'Heavy letters (خ ص ض غ ط ق ظ) elevate the sound and make adjacent Alif or Ikhfa ghunnah heavy.',
    source: 'supplied',
  },
  'F-B6-05': {
    id: 'F-B6-05',
    text: 'Izhar Mutlaq preserves clear noon in single words (دُنْيَا, صِنْوَانٌ, قِنْوَانٌ, بُنْيَانٌ) avoiding incorrect idgham.',
    source: 'supplied',
  },
  'F-B6-06': {
    id: 'F-B6-06',
    text: 'Recitation mastery balances accurate Makharij with consistent Madd counts and clear Waqf stops.',
    source: 'supplied',
  },
};
