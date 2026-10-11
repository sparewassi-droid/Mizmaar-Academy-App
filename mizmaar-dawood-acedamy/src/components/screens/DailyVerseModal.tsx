import React, { useState } from 'react';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  Calendar,
  Volume2,
  Bookmark,
} from 'lucide-react';
import { DAILY_VERSES, DailyVerse, getDailyVerseForToday } from '../../data/dailyVerses';
import { soundService } from '../../utils/audio';

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'default' | 'dark-emerald';
}

export const DailyVerseModal: React.FC<DailyVerseModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark-emerald',
}) => {
  const { index: todayIndex } = getDailyVerseForToday();
  const [currentIndex, setCurrentIndex] = useState<number>(todayIndex);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!isOpen) return null;

  const currentVerse: DailyVerse = DAILY_VERSES[currentIndex];
  const isToday = currentIndex === todayIndex;

  const handleNext = () => {
    soundService.playTap();
    setCurrentIndex((prev) => (prev + 1) % DAILY_VERSES.length);
    setCopied(false);
  };

  const handlePrev = () => {
    soundService.playTap();
    setCurrentIndex((prev) => (prev - 1 + DAILY_VERSES.length) % DAILY_VERSES.length);
    setCopied(false);
  };

  const handleJumpToToday = () => {
    soundService.playTap();
    setCurrentIndex(todayIndex);
    setCopied(false);
  };

  const handleShare = () => {
    soundService.playTap();
    const shareText = `"${currentVerse.arabicText}"\n\n"${currentVerse.translation}"\n— Surah ${currentVerse.surahName} [${currentVerse.surahNumber}:${currentVerse.ayahNumber}]\n\n✨ Mizmaar Dawood Tajweed Quest`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  const handleToggleBookmark = () => {
    soundService.playTap();
    setBookmarked(!bookmarked);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-verse-title"
      className="fixed inset-0 z-50 bg-[#07170E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundService.playTap();
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-[540px] rounded-3xl bg-[#FAF4E6] border-2 border-[#DFD0B2] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] select-none text-[#10264F] my-auto transition-all transform animate-pop"
        style={{
          boxShadow: '0 20px 45px -10px rgba(7, 28, 16, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        }}
      >
        {/* MODAL HEADER */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#F4E8D3] border-b-2 border-[#DFD0B2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E6EFFD] border-2 border-[#2563EB] flex items-center justify-center text-[#1D4ED8] shadow-xs shrink-0">
              <BookOpen size={18} className="text-[#1D4ED8]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 id="daily-verse-title" className="text-sm sm:text-base font-black text-[#10264F] truncate">
                  Daily Quranic Verse
                </h2>
                {isToday && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full shadow-2xs">
                    Today
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#695636] font-semibold truncate">
                Day {currentIndex + 1} of {DAILY_VERSES.length} • Revolving Daily Reflection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark verse'}
              title="Bookmark this verse"
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                bookmarked
                  ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                  : 'bg-white border-[#DFD0B2] text-[#1D4ED8] hover:bg-[#FAF4E6]'
              }`}
            >
              <Bookmark size={15} className={bookmarked ? 'fill-white' : 'text-[#1D4ED8]'} />
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playTap();
                onClose();
              }}
              aria-label="Close Daily Verse"
              className="w-8 h-8 rounded-xl bg-white border border-[#DFD0B2] flex items-center justify-center text-[#10264F] hover:bg-[#EDE0C7] transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* VERSE CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5">
          {/* Top Surah Reference Pill & Theme */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#E6EFFD] border border-[#BAD1F7] text-[#1D4ED8] text-xs font-black shadow-2xs">
                Surah {currentVerse.surahName}
              </span>
              <span className="text-xs font-bold text-[#8C681E] bg-[#F7EEDB] px-2.5 py-1 rounded-xl border border-[#DFD0B2]">
                Ayah {currentVerse.ayahNumber}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] bg-[#FAF5EA] px-2.5 py-1 rounded-lg border border-[#DFD0B2]">
              <Sparkles size={12} className="text-[#1D4ED8]" />
              <span>{currentVerse.theme}</span>
            </div>
          </div>

          {/* ARABIC CALLIGRAPHY BOX */}
          <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EA] to-[#F5EBD7] border-2 border-[#D4AF37] shadow-inner text-center">
            {/* Corner Arabic Rosette / Ornament */}
            <div className="absolute top-2 right-3 font-amiri text-xs font-bold text-[#C59B27] select-none">
              {currentVerse.surahNameArabic}
            </div>
            <div className="absolute top-2 left-3 font-mono text-[10px] text-[#8C681E] select-none font-bold">
              {currentVerse.surahNumber}:{currentVerse.ayahNumber}
            </div>

            {/* Quranic Arabic Text */}
            <p
              dir="rtl"
              className="font-amiri text-2xl sm:text-3xl leading-[2.1] sm:leading-[2.2] text-[#0C2417] font-bold my-2 px-1 select-text"
              style={{
                textShadow: '0 1px 1px rgba(0,0,0,0.05)',
              }}
            >
              {currentVerse.arabicText}
            </p>

            {/* Aya End Symbol Marker */}
            <div className="inline-flex items-center justify-center mt-1 text-xs font-amiri text-[#B8892B] bg-[#FAF3DE] border border-[#DEC89E] px-3 py-0.5 rounded-full">
              ۝ {currentVerse.ayahNumber} ۝
            </div>
          </div>

          {/* ENGLISH TRANSLATION */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFD0B2] shadow-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1D4ED8] mb-1.5">
              <span>English Translation</span>
            </div>
            <blockquote className="text-sm sm:text-[15px] font-bold text-[#10264F] leading-relaxed italic">
              &ldquo;{currentVerse.translation}&rdquo;
            </blockquote>
          </div>

          {/* INSPIRING SCHOLAR REFLECTION */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F6EEDB] border border-[#DCC9AD] flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#E6EFFD] border border-[#2563EB] flex items-center justify-center text-[#1D4ED8] shrink-0 mt-0.5">
              <Sparkles size={14} className="text-[#1D4ED8]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-[#10264F]">Reflection for Today:</h3>
              <p className="text-xs text-[#52442A] font-medium leading-relaxed mt-0.5">
                {currentVerse.reflection}
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER & ROTATION CONTROLS */}
        <div className="p-3 sm:p-4 bg-[#F4E8D3] border-t-2 border-[#DFD0B2] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Verse"
              title="View Previous Verse"
              className="h-9 px-2.5 rounded-xl bg-white border border-[#DFD0B2] text-[#1D4ED8] font-bold text-xs flex items-center gap-1 hover:bg-[#FAF4E6] active:scale-95 transition-all shadow-xs"
            >
              <ChevronLeft size={16} className="text-[#1D4ED8]" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {!isToday ? (
              <button
                type="button"
                onClick={handleJumpToToday}
                title="Go to Today's Verse"
                className="h-9 px-2.5 rounded-xl bg-[#1D4ED8] text-white font-black text-xs flex items-center gap-1 active:scale-95 transition-all shadow-xs"
              >
                <Calendar size={13} className="text-white" />
                <span>Today</span>
              </button>
            ) : (
              <div className="h-9 px-2.5 rounded-xl bg-white/70 border border-[#DFD0B2] text-[#695636] font-bold text-xs flex items-center gap-1">
                <Calendar size={13} className="text-[#1D4ED8]" />
                <span className="text-[11px]">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Verse"
              title="View Next Verse"
              className="h-9 px-2.5 rounded-xl bg-white border border-[#DFD0B2] text-[#1D4ED8] font-bold text-xs flex items-center gap-1 hover:bg-[#FAF4E6] active:scale-95 transition-all shadow-xs"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight size={16} className="text-[#1D4ED8]" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title="Copy verse to clipboard"
              className={`h-9 px-3 rounded-xl border font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs ${
                copied
                  ? 'bg-[#10B981] border-[#059669] text-white'
                  : 'bg-white border-[#DFD0B2] text-[#1D4ED8] hover:bg-[#FAF4E6]'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-[#1D4ED8]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playTap();
                onClose();
              }}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white font-black text-xs hover:from-[#1E40AF] hover:to-[#1D4ED8] active:scale-95 transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
