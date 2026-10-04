'use client';

import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  BookHeart, 
  Copy, 
  Check, 
  RotateCcw, 
  BookmarkCheck,
  Search,
  Volume2
} from 'lucide-react';

interface DzikirItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  repeat: number;
}

const DZIKIR_PAGI: DzikirItem[] = [
  {
    id: 'pagi-1',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana ‘abduka, wa ana ‘ala ‘ahdika wa wa’dika mastatha’tu, a’udzu bika min syarri ma shana’tu, abu’u laka bini’matika ‘alayya, wa abu’u laka bidzanbi, faghfir li fainnahu la yaghfirudz-dzunuba illa anta.',
    translation: '“Ya Allah, Engkau adalah Rabbku, tidak ada Ilah yang berhak diibadahi selain Engkau. Engkau-lah yang menciptakanku dan aku adalah hamba-Mu. Aku senantiasa menepati janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang kuperbuat. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku, sesungguhnya tidak ada yang mengampuni dosa-dosa selain Engkau.”',
    source: 'HR. Bukhari no. 6306 (Barang siapa membacanya di pagi hari dengan yakin lalu wafat, maka ia termasuk penghuni surga)',
    repeat: 1,
  },
  {
    id: 'pagi-2',
    title: 'Membaca Ayat Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allahu la ilaha illa huwal-hayyul-qayyum, la ta’khudzuhu sinatuw-wa la nawm, lahu ma fis-samawati wa ma fil-ardh, man dzalladzi yasyfa’u ‘indahu illa bi-idznih, ya’lamu ma bayna aydihim wa ma khalfahum, wa la yuhithuna bisyay-im min ‘ilmihi illa bima sya-a, wasi’a kursiyyuhus-samawati wal-ardh, wa la ya-uduhu hifzhuhuma wa huwal-‘aliyyul-‘azhim.',
    translation: '“Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa’at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka...”',
    source: 'QS. Al-Baqarah: 255 & HR. An-Nasa’i (Penjagaan dari gangguan jin dan setan hingga petang)',
    repeat: 1,
  },
  {
    id: 'pagi-3',
    title: 'Pelindung dari Segala Marabahaya di Bumi & Langit',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahilladzi la yadhurru ma’asmihi syai-un fil-ardhi wa la fis-sama-i wa huwas-sami’ul-‘alim.',
    translation: '“Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.”',
    source: 'HR. Abu Daud no. 5088 & Tirmidzi no. 3388 (Dibaca 3x, terhindar dari marabahaya tiba-tiba)',
    repeat: 3,
  },
  {
    id: 'pagi-4',
    title: 'Keridhaan kepada Allah, Islam, dan Nabi Muhammad ﷺ',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: 'Radhitu billahi rabba, wa bil-islami dina, wa bi-muhammadin shallallahu ‘alayhi wa sallama nabiyya.',
    translation: '“Aku ridha Allah sebagai Rabbku, Islam sebagai agamaku, dan Muhammad ﷺ sebagai nabiku.”',
    source: 'HR. Abu Daud no. 5072 & Ahmad (Dibaca 3x, hak bagi Allah untuk meridhai pembacanya)',
    repeat: 3,
  },
  {
    id: 'pagi-5',
    title: 'Permohonan Ilmu yang Bermanfaat, Rezeki Halal & Amal Maqbul',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allahumma inni as-aluka ‘ilman nafi’a, wa rizqan thayyiba, wa ‘amalan mutaqabbala.',
    translation: '“Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal), dan amalan yang diterima.”',
    source: 'HR. Ibnu Majah no. 925 & Ahmad (Dibaca murid setelah sholat subuh/di pagi hari)',
    repeat: 1,
  },
];

const DZIKIR_PETANG: DzikirItem[] = [
  {
    id: 'petang-1',
    title: 'Memasuki Waktu Sore dengan Kerajaan Milik Allah',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli syai-in qadir.',
    translation: '“Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah yang berhak diibadahi dengan benar selain Allah semata, tidak ada sekutu bagi-Nya...”',
    source: 'HR. Muslim no. 2723',
    repeat: 1,
  },
  {
    id: 'petang-2',
    title: 'Perlindungan dengan Kalimat Allah yang Sempurna',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A’udzu bikalimatillahit-tammati min syarri ma khalaq.',
    translation: '“Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.”',
    source: 'HR. Muslim no. 2709 (Dibaca 3x petang hari, terbebas dari gigitan binatang berbisa dan marabahaya malam)',
    repeat: 3,
  },
  {
    id: 'petang-3',
    title: 'Permohonan Keselamatan Jasmani, Pendengaran & Penglihatan',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma ‘afini fi badani, Allahumma ‘afini fi sam’i, Allahumma ‘afini fi bashari, la ilaha illa anta. Allahumma inni a’udzu bika minal-kufri wal-faqri, wa a’udzu bika min ‘adzabil-qabri, la ilaha illa anta.',
    translation: '“Ya Allah, selamatkanlah tubuhku (dari penyakit). Ya Allah, selamatkanlah pendengaranku. Ya Allah, selamatkanlah penglihatanku. Tidak ada Ilah selain Engkau. Ya Allah, aku berlindung kepada-Mu dari kekafiran dan kefakiran, dan aku berlindung kepada-Mu dari siksa kubur...”',
    source: 'HR. Abu Daud no. 5090 & Ahmad (Dibaca 3x)',
    repeat: 3,
  },
];

const DOA_MURID: DzikirItem[] = [
  {
    id: 'doa-1',
    title: 'Doa Sebelum Memulai Belajar & Menghafal Al-Qur’an',
    arabic: 'رَبِّ زِدْنِي عِلْمًا، وَارْزُقْنِي فَهْمًا، وَاجْعَلْنِي مِنَ الصَّالِحِينَ',
    transliteration: 'Rabbi zidni ‘ilma, warzuqni fahma, waj’alni minash-shalihin.',
    translation: '“Wahai Rabbku, tambahkanlah kepadaku ilmu pengetahuan, anugerahilah aku pemahaman yang mendalam, dan jadikanlah aku termasuk orang-orang yang shalih.”',
    source: 'Adab Penuntut Ilmu & Doa Ma’tsur Para Asatidzah',
    repeat: 1,
  },
  {
    id: 'doa-2',
    title: 'Doa Memohon Kemudahan Menghadapi Ujian & Kesulitan',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja’altahu sahla, wa anta taj’alul-hazna idza syi’ta sahla.',
    translation: '“Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah. Dan Engkau-lah yang menjadikan kesedihan/kesulitan itu mudah apabila Engkau menghendakinya.”',
    source: 'HR. Ibnu Hibban no. 327 (Dianjurkan saat murid menghadapi tasmi’ hafalan & ujian akademik)',
    repeat: 1,
  },
  {
    id: 'doa-3',
    title: 'Doa Birrul Walidain (Kedua Orang Tua)',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbighfir li wa liwalidayya warhamhuma kama rabbayani shaghira.',
    translation: '“Wahai Rabbku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka berdua sebagaimana mereka telah mendidikku di waktu kecil.”',
    source: 'QS. Al-Isra’: 24',
    repeat: 1,
  },
  {
    id: 'doa-4',
    title: 'Doa Kaffaratul Majelis (Penutup Majelis Belajar)',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanakallahumma wa bihamdika, asyhadu alla ilaha illa anta, astaghfiruka wa atubu ilaik.',
    translation: '“Maha Suci Engkau ya Allah dan segala puji bagi-Mu. Aku bersaksi bahwasanya tiada Ilah yang berhak disembah selain Engkau. Aku memohon ampunan kepada-Mu dan aku bertaubat kepada-Mu.”',
    source: 'HR. Tirmidzi no. 3433 & Abu Daud (Menghapus kekhilafan selama majelis taklim)',
    repeat: 1,
  },
];

export default function DoaDzikirClient() {
  const [activeTab, setActiveTab] = useState<'pagi' | 'petang' | 'murid'>('pagi');
  const [counters, setCounters] = useState<{ [id: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const currentList = activeTab === 'pagi' ? DZIKIR_PAGI : activeTab === 'petang' ? DZIKIR_PETANG : DOA_MURID;

  const filteredList = currentList.filter(item => 
    item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.translation.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.transliteration.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleIncrement = (id: string, maxRepeat: number) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      if (current >= maxRepeat) {
        return { ...prev, [id]: 0 }; // reset
      }
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleReset = (id: string) => {
    setCounters(prev => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (item: DzikirItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n${item.transliteration}\n\nArtinya:\n${item.translation}\n\nSumber: ${item.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Tab Bar Navigation */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('pagi')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pagi'
                ? 'bg-[#184F48] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-300" />
            <span>Dzikir Pagi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('petang')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'petang'
                ? 'bg-[#184F48] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-300" />
            <span>Dzikir Petang</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('murid')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'murid'
                ? 'bg-[#184F48] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookHeart className="w-4 h-4 text-rose-300" />
            <span>Doa Harian Murid</span>
          </button>
        </div>

        {/* Search within current category */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari doa, lafadz, arti..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48] transition-all"
          />
        </div>
      </div>

      {/* Cards Display */}
      <div className="space-y-6">
        {filteredList.map((item, index) => {
          const currentCount = counters[item.id] || 0;
          const isDone = currentCount >= item.repeat;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border transition-all duration-300 ${
                isDone 
                  ? 'border-emerald-300 bg-emerald-50/20' 
                  : 'border-slate-200/80 hover:border-[#184F48]/40 hover:shadow-md'
              }`}
            >
              {/* Card Header: Title, Repeat Badge & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-[#E8F3F1] text-[#184F48] font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Dibaca {item.repeat}x
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Salin Teks Doa"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text Block */}
              <div className="my-8 text-right py-4 px-2">
                <p 
                  dir="rtl" 
                  className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-[2.2] sm:leading-[2.4] tracking-wide select-all"
                >
                  {item.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div className="bg-[#FAFDFD] p-4 rounded-2xl border border-slate-200/60 mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#184F48] mb-1">
                  Transliterasi Latin:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{item.transliteration}&rdquo;
                </p>
              </div>

              {/* Translation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Terjemahan &amp; Makna:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.translation}
                </p>
              </div>

              {/* Card Footer: Source & Interactive Counter */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[11px] text-slate-400 max-w-md">
                  <span className="font-semibold text-slate-600">Fadhilah / Rujukan:</span> {item.source}
                </div>

                {/* Counter Pill Button */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.id, item.repeat)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-[#184F48] hover:bg-[#123E38] text-white shadow-sm'
                    }`}
                  >
                    <span>{isDone ? '✓ Selesai' : `Hitung Baca (${currentCount}/${item.repeat})`}</span>
                  </button>

                  {currentCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReset(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Reset Hitungan"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
