'use client';

import { useState, useRef, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { 
  Play, ChevronRight, ChevronLeft,
  Search, X, BookOpen, MessageSquare, Headphones, MoreHorizontal, User, 
  Bookmark, Layers, Bell, Menu, Send, ChevronDown, Star, Trophy, ChevronRightIcon,
  ThumbsUp, ThumbsDown, MessageCircle, Newspaper, Shield, Plus, Eye, Clock, Hash
} from 'lucide-react';
import Image from 'next/image';

// --- ДАННЫЕ ---
const showcaseAnime = [
  { 
    id: 1, title: 'Arra odam', status: 'AIRING', episodes: 'S1 • EP 12', 
    description: 'Qarzga botgan yigit iblis iti bilan qo\'shilib, zanjirli arra-odamga aylanadi.', 
    img: '/images/chainsaw.webp', rating: 9.1, genres: ['Action', 'Dark Fantasy', 'Shonen'], year: 2022
  },
  { 
    id: 2, title: 'Jodugarlar jangi', status: 'AIRING', episodes: 'S2 • EP 21', 
    description: 'Yulduzli plazma tomirini himoya qilish missiyasi qanday qilib butun dunyo taqdirini o\'zgartirib yubordi?', 
    img: '/images/jjk.webp', rating: 9.4, genres: ['Action', 'Supernatural', 'Dark'], year: 2020
  },
  { 
    id: 3, title: 'Iblislar qotili', status: 'COMPLETED', episodes: 'S4 • EP 11', 
    description: 'Qilichbozlar qishlog\'idagi jang yakuniga yetmoqda. Muzan endi Nezukoga ov boshlaydi.', 
    img: '/images/kny.webp', rating: 9.3, genres: ['Action', 'Historical', 'Drama'], year: 2019
  },
  { 
    id: 4, title: 'Frieren', status: 'COMPLETED', episodes: 'S1 • EP 28', 
    description: 'Qahramonlar partiyasi tarqalgach, o\'lmas elfning hayoti va xotiralar orqali sayohati.', 
    img: '/images/frieren.webp', rating: 9.5, genres: ['Fantasy', 'Slice of Life', 'Adventure'], year: 2023
  },
  { 
    id: 5, title: 'Yolg\'iz kuch', status: 'AIRING', episodes: 'S1 • EP 12', 
    description: 'Dunyodagi eng kuchsiz ovchi qanday qilib yengilmas soyalar qiroliga aylandi?', 
    img: '/images/solo.webp', rating: 8.9, genres: ['Action', 'Fantasy', 'Game'], year: 2024
  },
];

const continueWatching = [
  { id: 1, title: 'Ruhlar olami', ep: '32-QISM', progress: 25, total: '128 ta qism', img: '/images/chainsaw.webp' },
  { id: 2, title: 'Mononoke', ep: '12-QISM', progress: 80, total: '15 ta qism', img: '/images/frieren.webp' },
  { id: 3, title: 'Yolg\'iz o\'yinchi', ep: '110-QISM', progress: 45, total: '200 ta qism', img: '/images/solo.webp' },
  { id: 4, title: 'Iblis akademiyasi', ep: '5-QISM', progress: 10, total: '50 ta qism', img: '/images/jjk.webp' },
  { id: 5, title: 'Demonlar dunyosi', ep: '28-QISM', progress: 60, total: '80 ta qism', img: '/images/kny.webp' },
  { id: 6, title: 'Jodugar ovchilari', ep: '15-QISM', progress: 90, total: '30 ta qism', img: '/images/chainsaw.webp' },
];

const nowWatching = {
  completed: [
    { id: 1, title: 'Mening qahramonlik akademiyam: Final', type: 'TV Serial', img: '/images/jjk.webp' },
    { id: 2, title: 'Sehrli jang: O\'limli migratsiya', type: 'TV Serial', img: '/images/kny.webp' },
    { id: 3, title: 'Blich', type: 'TV Serial', img: '/images/chainsaw.webp' },
  ],
  ongoing: [
    { id: 4, title: 'Mukammallik sinfiga xush kelibsiz 4: Ikkinchi yil —...', type: 'TV Serial', img: '/images/solo.webp' },
    { id: 5, title: 'Kanan — juda oddiy qiz', type: 'TV Serial', img: '/images/frieren.webp' },
    { id: 6, title: 'Muz devor', type: 'TV Serial', img: '/images/chainsaw.webp' },
  ],
  movies: [
    { id: 7, title: 'Yozga tunnel, xayrlashuv chiqishi', type: 'Film', img: '/images/frieren.webp' },
    { id: 8, title: 'Sehrli jang 0. Film', type: 'Film', img: '/images/jjk.webp' },
    { id: 9, title: 'Re:Zero. Alternativ dunyoda hayot: Qorli...', type: 'Film', img: '/images/kny.webp' },
  ],
};

const latestUpdates = [
  { id: 1, title: 'Van-Pis (One Piece)', type: 'TV Serial', ep: '1160-qism', time: '35 daqiqa oldin', pg: 'PG-13', img: '/images/chainsaw.webp', isNew: false },
  { id: 2, title: 'Kastlvaniya', type: 'TV Serial', ep: '4-qism + yana 3 qism', time: '2 soat oldin', pg: '18+', img: '/images/jjk.webp', isNew: false },
  { id: 3, title: 'Izlanuvchi Ajdarho', type: 'ONA', ep: '1-qism + yana 2 qism', time: '5 soat oldin', pg: 'PG-13', img: '/images/solo.webp', isNew: false },
  { id: 4, title: 'Mening qahramonlik akademiyam', type: 'Maxsus', ep: '1-qism', time: '5 soat oldin', pg: 'PG-13', img: '/images/kny.webp', isNew: true },
  { id: 5, title: 'Momaqaldiroq', type: 'ONA', ep: '1-qism', time: '5 soat oldin', pg: 'PG', img: '/images/frieren.webp', isNew: false },
  { id: 6, title: 'Naruto: Shippuden', type: 'TV Serial', ep: '500-qism', time: '7 soat oldin', pg: 'PG-13', img: '/images/solo.webp', isNew: false },
  { id: 7, title: 'Hujum Titanlariga', type: 'TV Serial', ep: 'Final qism', time: '8 soat oldin', pg: '18+', img: '/images/kny.webp', isNew: false },
  { id: 8, title: 'Demon Slayer: Hashira', type: 'Maxsus', ep: '1-qism', time: '9 soat oldin', pg: 'PG-13', img: '/images/chainsaw.webp', isNew: true },
  { id: 9, title: 'Bleach: Ming yillik urush', type: 'TV Serial', ep: '26-qism', time: '10 soat oldin', pg: '18+', img: '/images/jjk.webp', isNew: false },
  { id: 10, title: 'Jujutsu Kaisen: Shibuya', type: 'TV Serial', ep: '21-qism', time: '11 soat oldin', pg: '18+', img: '/images/frieren.webp', isNew: false },
  { id: 11, title: 'Solo Leveling: Arise', type: 'ONA', ep: '12-qism', time: '12 soat oldin', pg: 'PG-13', img: '/images/solo.webp', isNew: false },
  { id: 12, title: 'Frieren: Yangi sayohat', type: 'TV Serial', ep: '28-qism', time: '13 soat oldin', pg: 'PG', img: '/images/kny.webp', isNew: false },
  { id: 13, title: 'One Punch Man 3', type: 'TV Serial', ep: '1-qism', time: '14 soat oldin', pg: 'PG-13', img: '/images/chainsaw.webp', isNew: true },
  { id: 14, title: 'Mushoku Tensei III', type: 'TV Serial', ep: '5-qism', time: '15 soat oldin', pg: '18+', img: '/images/jjk.webp', isNew: false },
  { id: 15, title: 'Vinland Saga 2', type: 'TV Serial', ep: '24-qism', time: '16 soat oldin', pg: '18+', img: '/images/frieren.webp', isNew: false },
  { id: 16, title: 'Oshi no Ko 2', type: 'TV Serial', ep: '13-qism', time: '17 soat oldin', pg: 'PG-13', img: '/images/solo.webp', isNew: false },
];

const reviews = [
  {
    id: 1, type: 'review' as const, sentiment: 'positive' as const,
    title: 'Shamol kuchaymoqda! ... yashashga harakat qilish kerak!',
    anime: 'Shamol kuchaymoqda / 風立ちぬ',
    preview: 'Yaqinda bildimki, nom Tazzo Hori romanidan olingan, unda...',
    likes: 40, comments: 6, time: '11 soat oldin',
    bgImage: '/images/wind.jpg'
  },
  {
    id: 2, type: 'review' as const, sentiment: 'positive' as const,
    title: 'Eng buyuk anime #2',
    anime: 'Shamol vodiysining Navsikasi / 風の谷のナウシカ',
    preview: '"Kaliostro qal\'asi" ustida ishni tugatgandan so\'ng, (Seriya...)',
    likes: 85, comments: 5, time: '14 soat oldin',
    bgImage: '/images/navsikaya.jpg'
  },
  {
    id: 3, type: 'review' as const, sentiment: 'positive' as const,
    title: 'Eng buyuk Anime',
    anime: 'Akira / アキラ',
    preview: '1988 yil 9-aprelda chiqarilgan. Bu asar o\'yinchoqlar va...',
    likes: 114, comments: 6, time: '19 soat oldin',
    bgImage: '/images/akira.jpg'
  },
  {
    id: 4, type: 'review' as const, sentiment: 'negative' as const,
    title: 'Bo\'sh, oddiy va bolalarcha',
    anime: 'Made in Abyss / メイドインアビス',
    preview: 'DIsklemer: Men muxlislarni xafa qilishga yoki o\'z fikrimni majburlashga harakat qilmayapman. Rahmat...',
    likes: 93, comments: 6, time: 'bir kun oldin',
    bgImage: '/images/abyss.jpg'
  },
  {
    id: 5, type: 'review' as const, sentiment: 'positive' as const,
    title: 'Ajoyib qaytish!',
    anime: 'Bleach: Ming yillik urush',
    preview: 'Kubo sensei nihoyat o\'zining eng zo\'r asarini anime formatiga olib kirdi...',
    likes: 210, comments: 45, time: '2 kun oldin',
    bgImage: '/images/chainsaw.webp'
  },
];

const news = [
  { id: 1, title: '«Jodugarlar jangi» 3-mavsumi 2026 yil kuzida chiqadi', preview: 'MAPPA studiyasi Culling Games arkini ekranlashtirish boshlanganini tasdiqladi. Reliz sanasi va birinchi treyler...', source: 'Anime News Network', time: '2 soat oldin', img: '/images/jjk.jpg' },
  { id: 2, title: 'O\'zbekistonda birinchi anime-festival: AniFest 2026 Toshkentda', preview: '20-22 iyun kunlari Toshkentda birinchi xalqaro anime festivali bo\'lib o\'tadi. Mehmonlar orasida...', source: 'KawaiiUZ', time: '5 soat oldin', img: '/images/anifest.jpg' },
  { id: 3, title: '«Solo Leveling» 2-mavsumi rekord o\'rnatdi', preview: 'Crunchyroll ma\'lumotlariga ko\'ra, ikkinchi mavsum premyerasi platforma tarixidagi eng ko\'p tomosha qilingan...', source: 'Crunchyroll', time: '8 soat oldin', img: '/images/solo.jpg' },
  { id: 4, title: 'Ufotable «Iblislar qotili» filmini e\'lon qildi', preview: 'Yangi to\'liq metrajli film mangadagi yakuniy jangni ekranlashtiradi. Premyera 2027 yilga...', source: 'Anime News Network', time: '12 soat oldin', img: '/images/kimetsu.jpg' },
  { id: 5, title: 'Makoto Shinkayning yangi filmi anons qilindi', preview: 'Rejissyor o\'zining navbatdagi asari ustida ish boshlaganini ma\'lum qildi...', source: 'Twitter', time: '1 kun oldin', img: '/images/wind.jpg' },
  { id: 6, title: 'Oshi no Ko 2-mavsum treyleri namoyish etildi', preview: 'Aqua va Rubyning sarguzashtlari davom etadi. Yangi qahramonlar va...', source: 'Kadokawa', time: '2 kun oldin', img: '/images/akira.jpg' },
];

const forumTopics = [
  { id: 1, title: 'Solo Leveling 2-mavsum qachon chiqadi?', author: 'AnimeQiroli', replies: 45, views: '1.2k', time: '10 daq oldin', tag: 'Muhokama', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 2, title: 'One Piece: Gear 5 animatsiyasi haqida fikrlar', author: 'Otaku_Uzz', replies: 128, views: '3.4k', time: '1 soat oldin', tag: 'Spoiler', color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 3, title: 'Toshkentda AniFest 2026: Kimlar boryapti?', author: 'Kawaii_Girl', replies: 312, views: '5k', time: '2 soat oldin', tag: 'Tadbir', color: 'text-[#8a60c2]', bg: 'bg-[#8a60c2]/10' },
  { id: 4, title: 'Jujutsu Kaisen manga oxiri... qanday tugaydi?', author: 'GojoSensei', replies: 89, views: '2.1k', time: '5 soat oldin', tag: 'Manga', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 5, title: 'Boshlovchilar uchun qaysi animelarni tavsiya qilasiz?', author: 'Newbie123', replies: 56, views: '800', time: '1 kun oldin', tag: 'Tavsiya', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 6, title: 'O\'zbek tilidagi eng yaxshi fandub studiyalari', author: 'DuberMan', replies: 34, views: '1.5k', time: '1 kun oldin', tag: 'Dublyaj', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 7, title: 'Demon Slayer vs Jujutsu Kaisen: Animatsiya jangi', author: 'NinjaTash', replies: 210, views: '4.2k', time: '2 kun oldin', tag: 'Versus', color: 'text-red-500', bg: 'bg-red-500/10' },
];

type RankType = 'wood' | 'iron' | 'gold' | 'emerald' | 'ruby' | 'amethyst';

interface RankConfig {
  name: string;
  color: string;
  borderColor: string;
  bgRank: string;
  progressGradient: string;
  imgSrc: string;
}

const rankConfigs: Record<RankType, RankConfig> = {
  wood: {
    name: 'Wood', color: 'text-amber-900', borderColor: 'border-amber-900/30', bgRank: 'bg-amber-900/10',
    progressGradient: 'bg-gradient-to-r from-amber-950 to-amber-800', imgSrc: '/images/wood.webp',
  },
  iron: {
    name: 'Iron', color: 'text-gray-300', borderColor: 'border-gray-300/30', bgRank: 'bg-gray-300/10',
    progressGradient: 'bg-gradient-to-r from-gray-400 to-gray-200', imgSrc: '/images/iron.webp',
  },
  gold: {
    name: 'Gold', color: 'text-yellow-400', borderColor: 'border-yellow-400/30', bgRank: 'bg-yellow-400/10',
    progressGradient: 'bg-gradient-to-r from-yellow-400 to-amber-500', imgSrc: '/images/gold.webp',
  },
  emerald: {
    name: 'Emerald', color: 'text-emerald-400', borderColor: 'border-emerald-400/30', bgRank: 'bg-emerald-400/10',
    progressGradient: 'bg-gradient-to-r from-emerald-400 to-green-300', imgSrc: '/images/emerald.webp',
  },
  ruby: {
    name: 'Ruby', color: 'text-red-400', borderColor: 'border-red-400/30', bgRank: 'bg-red-400/10',
    progressGradient: 'bg-gradient-to-r from-red-500 to-orange-500', imgSrc: '/images/ruby.webp',
  },
  amethyst: {
    name: 'Amethyst', color: 'text-violet-400', borderColor: 'border-violet-400/30', bgRank: 'bg-violet-400/10',
    progressGradient: 'bg-gradient-to-r from-violet-500 to-purple-400', imgSrc: '/images/amethyst.webp',
  },
};

const topUsers = [
  { id: 1, name: 'AnimeQiroli', points: 15420, level: 99, rank: 'amethyst' as RankType, avatar: '/images/1.jpg' },
  { id: 2, name: 'Otaku_Uzz', points: 14200, level: 92, rank: 'ruby' as RankType, avatar: '/images/2.jpg' },
  { id: 3, name: 'SenzuBean', points: 13850, level: 88, rank: 'ruby' as RankType, avatar: '/images/3.jpg' },
  { id: 4, name: 'NinjaTash', points: 12100, level: 81, rank: 'emerald' as RankType, avatar: '/images/4.jpg' },
  { id: 5, name: 'GojoSensei', points: 11900, level: 79, rank: 'emerald' as RankType, avatar: '/images/5.jpg' },
  { id: 6, name: 'BakaMitai', points: 10500, level: 74, rank: 'gold' as RankType, avatar: '/images/6.jpg' },
  { id: 7, name: 'Kawaii_Girl', points: 9800, level: 68, rank: 'gold' as RankType, avatar: '/images/7.jpg' },
  { id: 8, name: 'Hokage123', points: 9200, level: 65, rank: 'iron' as RankType, avatar: '/images/8.jpg' },
  { id: 9, name: 'SoloLeveler', points: 8900, level: 62, rank: 'iron' as RankType, avatar: '/images/9.jpg' },
  { id: 10, name: 'ZoroLostAgain', points: 8500, level: 59, rank: 'wood' as RankType, avatar: '/images/10.jpg' },
];

const filterOptions = [
  { key: 'kun' as const, label: 'Kun davomida' },
  { key: 'hafta' as const, label: 'Hafta davomida' },
  { key: 'oy' as const, label: 'Oy davomida' },
];

// ============================================================
// ИНТЕРАКТИВНАЯ СЕТКА (Spotlight + Parallax Effect)
// ============================================================
const SpotlightGrid = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollY } = useScroll();
  const translateY = useTransform(scrollY, [0, 2000], [0, -200]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    mouseX.set(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    mouseY.set(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gridSize = '150px 150px';

  return (
    <div className="fixed inset-0 z-[-20] bg-[#050408] overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-[-15%] w-[130%] h-[130%]"
        style={{ y: translateY }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: gridSize
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(138,96,194,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,96,194,0.2) 1px, transparent 1px)`,
            backgroundSize: gridSize,
            WebkitMaskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px calc(${mouseY}px - ${translateY}px), black 0%, transparent 100%)`,
            maskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px calc(${mouseY}px - ${translateY}px), black 0%, transparent 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(138,96,194,0.08) 0%, transparent 80%)`,
        }}
      />
    </div>
  );
};

// ============================================================
// МЕМОИЗИРОВАННАЯ КАРТОЧКА АККОРДЕОНА
// ============================================================
const AccordionCard = memo(function AccordionCard({ anime, idx, isActive, onActivate }: any) {
  return (
    <motion.div
      onMouseEnter={() => onActivate(idx)} onClick={() => onActivate(idx)}
      animate={{ flex: isActive ? 6 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.8 }}
      className={`relative overflow-hidden rounded-2xl md:rounded-[2rem] cursor-pointer border transition-colors duration-300 group will-change-[flex]
        ${isActive ? 'border-white/10' : 'border-white/5 hover:border-white/10 bg-[#121015]/60 backdrop-blur-sm'}`}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      <Image src={anime.img} alt={anime.title} fill unoptimized priority={idx <= 2} sizes={isActive ? '60vw' : '10vw'}
        className={`object-cover transition-all duration-700 ease-out pointer-events-none
          ${isActive ? 'scale-100 opacity-100 object-center' : 'scale-[1.15] opacity-40 grayscale-[60%] object-center group-hover:grayscale-[30%] group-hover:opacity-60'}`}
      />
      
      <div className={`absolute inset-0 bg-gradient-to-t from-[#0b090f] via-[#0b090f]/40 to-transparent transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-90' : 'opacity-60'}`} />
      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-[#0b090f]/90 via-transparent to-transparent opacity-90 pointer-events-none" />}

      <motion.div initial={false} animate={{ opacity: isActive ? 0 : 1 }} transition={{ duration: 0.2, delay: isActive ? 0 : 0.4 }} className="absolute inset-0 flex flex-col items-center justify-between py-6 md:py-8 pointer-events-none">
        <div className="flex flex-col items-center gap-1"><span className="text-[12px] md:text-sm font-mono text-[#8a60c2]/70 font-black tracking-[0.3em]">0{idx + 1}</span><div className="w-8 h-[1px] bg-white/10" /></div>
        <div className="hidden md:flex flex-col items-center gap-3 px-2">
          <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#8a60c2]/60 fill-[#8a60c2]/40" /><span className="text-sm font-black text-white/80 tracking-tight">{anime.rating}</span></div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {anime.genres.slice(0, 2).map((genre: string) => (<span key={genre} className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/50 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03]">{genre}</span>))}
            {anime.genres.length > 2 && (<span className="text-[8px] md:text-[9px] font-bold text-white/30">+{anime.genres.length - 2}</span>)}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1"><div className="w-8 h-[1px] bg-white/10" /><span className="text-[10px] md:text-[11px] font-mono text-white/30 tracking-widest">{anime.year}</span></div>
      </motion.div>

      <motion.div initial={false} animate={{ opacity: isActive ? 0 : 1 }} transition={{ duration: 0.2, delay: isActive ? 0 : 0.4 }} className="hidden md:flex absolute inset-0 flex-col items-center justify-end pb-8 pointer-events-none">
        <span className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase group-hover:text-white transition-colors mb-16" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{anime.title}</span>
      </motion.div>

      <motion.div initial={false} animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.3, delay: isActive ? 0.4 : 0 }} className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-end pointer-events-auto ${!isActive && 'pointer-events-none'}`}>
        <div className="relative z-10 w-[80vw] md:w-[600px] max-w-full">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#8a60c2] text-white text-[10px] font-black uppercase tracking-widest rounded-md">{anime.status}</span>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-gray-200 text-[10px] font-mono uppercase tracking-widest rounded-md">{anime.episodes}</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md"><Star className="w-3 h-3 text-[#8a60c2] fill-[#8a60c2]" /><span className="text-white text-[10px] font-black tracking-wider">{anime.rating}</span></div>
            <span className="px-2.5 py-1 bg-[#8a60c2]/15 border border-[#8a60c2]/30 text-[#8a60c2] text-[9px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm">
              {anime.type || 'TV Serial'}
            </span>
          </div>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {anime.genres.map((genre: string) => (<span key={genre} className="text-[9px] font-bold uppercase tracking-wider text-white/60 px-2 py-0.5 rounded-full border border-white/10">{genre}</span>))}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2 leading-[0.95]">{anime.title}</h2>
          <p className="text-gray-300 text-xs md:text-sm max-w-md mb-6 mt-4 line-clamp-2 leading-relaxed hidden md:block">{anime.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#8a60c2] hover:text-white hover:shadow-[0_0_20px_rgba(138,96,194,0.4)] transition-all duration-300 shadow-xl group">
              <Play size={16} fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-1" /> 
              <span>Tomosha</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ============================================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================================
export default function PremiumDashboardHomePage() {
  const [activeIdx, setActiveIdx] = useState(2);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'kun' | 'hafta' | 'oy'>('kun');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const continueWatchingRef = useRef<HTMLDivElement>(null);

  const handleActivate = useCallback((idx: number) => setActiveIdx(idx), []);
  const scrollLeft = useCallback(() => continueWatchingRef.current?.scrollBy({ left: -260, behavior: 'smooth' }), []);
  const scrollRight = useCallback(() => continueWatchingRef.current?.scrollBy({ left: 260, behavior: 'smooth' }), []);

  const currentFilterLabel = filterOptions.find(f => f.key === activeFilter)?.label || 'Kun davomida';

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-[#8a60c2] selection:text-white font-sans overflow-x-hidden flex flex-col relative z-0">
      
      <SpotlightGrid />
      <div className="fixed inset-0 z-[-15] pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HEADER */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 h-[72px]">
          <div className="text-2xl font-black tracking-tight italic cursor-pointer">Kawaii<span className="text-[#8a60c2]">UZ</span></div>
          <div className="flex items-center gap-6 text-xs uppercase font-bold tracking-[0.15em] text-gray-400">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-white transition flex items-center gap-2 p-2"><Search className="w-[18px] h-[18px]" /></button>
            <a href="manga_catalog.html" className="hover:text-white transition flex items-center gap-2 p-2"><BookOpen className="w-[18px] h-[18px]" /><span>Katalog</span></a>
            <a href="#" className="hover:text-white transition flex items-center gap-2 p-2"><MessageSquare className="w-[18px] h-[18px]" /><span>Forum</span></a>
            <a href="#" className="hover:text-white transition flex items-center gap-2 p-2"><Headphones className="w-[18px] h-[18px]" /><span>Radio</span></a>
          </div>
          <div className="flex items-center gap-4 text-gray-400"><User className="w-5 h-5 hover:text-white cursor-pointer transition p-1 box-content" /></div>
        </nav>
      </header>

      <main className="relative z-10 pt-16 md:pt-28 pb-24 max-w-7xl mx-auto px-5 w-full flex-1">
        
        {/* АККОРДЕОН */}
        <div className="flex flex-col md:flex-row h-[75vh] md:h-[60vh] w-full gap-3 md:gap-4 mt-4">
          {showcaseAnime.map((anime, idx) => (
            <AccordionCard key={anime.id} anime={anime} idx={idx} isActive={activeIdx === idx} onActivate={handleActivate} />
          ))}
        </div>

        {/* DAVOM ETTIRISH */}
        <section className="mt-12 md:mt-20 w-full">
          <div className="flex justify-between items-end mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Davom ettirish</h2>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#8a60c2] mt-1 font-bold">O'qiyapsiz</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={scrollLeft} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#8a60c2]/50 hover:bg-white/5 transition"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={scrollRight} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#8a60c2]/50 hover:bg-white/5 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div ref={continueWatchingRef} className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-hidden pb-4 -mx-5 px-5 md:mx-0 md:px-0 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {continueWatching.map((item) => (
              <a key={item.id} href="#" className="snap-start flex-shrink-0 w-[220px] md:w-[260px] bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-white/5 hover:border-[#8a60c2]/40 transition-all duration-300 rounded-lg p-2.5 flex items-center gap-3 group relative overflow-hidden backdrop-blur-md">
                <div className="relative w-20 h-12 rounded bg-[#0d0c10] overflow-hidden shrink-0 border border-white/5">
                  <Image src={item.img} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" unoptimized loading="lazy" sizes="80px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" /></div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider truncate transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[9px] font-mono"><span className="text-[#8a60c2]">{item.ep}</span><span className="text-gray-500">/ {item.total}</span></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5"><motion.div initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#8a60c2]" /></div>
              </a>
            ))}
            <a href="manga_catalog.html" className="snap-start flex-shrink-0 w-[220px] md:w-[260px] bg-transparent border border-dashed border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg p-2.5 flex items-center justify-center gap-3 group cursor-pointer opacity-70 hover:opacity-100 min-h-[68px]">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#8a60c2] group-hover:bg-[#8a60c2]/10 transition"><span className="text-xl font-light mb-1">+</span></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition mt-0.5">Yangi qo'shish</span>
            </a>
          </div>
        </section>

        {/* HOZIR KO'RILYAPTI */}
        <section className="mt-16 md:mt-24 w-full">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Hozir ko'rilyapti</h2>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121015]/80 border border-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-widest hover:border-[#8a60c2]/40 hover:bg-[#8a60c2]/10 hover:text-white hover:shadow-[0_0_15px_rgba(138,96,194,0.15)] transition-all duration-300 backdrop-blur-md group"
              >
                <span>{currentFilterLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 group-hover:text-[#8a60c2] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: -5, scale: 0.98 }} 
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-44 bg-[#121015]/95 border border-[#8a60c2]/20 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 cyber-noise pointer-events-none" />
                    <div className="relative z-10 p-1.5 flex flex-col gap-0.5">
                      {filterOptions.map((option) => (
                        <button 
                          key={option.key} 
                          onClick={() => { setActiveFilter(option.key); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between rounded-md
                            ${activeFilter === option.key 
                              ? 'bg-[#8a60c2]/20 text-white shadow-[inset_2px_0_0_#8a60c2]' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                          {option.label}
                          {activeFilter === option.key && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8a60c2] shadow-[0_0_6px_#8a60c2]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Yakunlangan', items: nowWatching.completed },
              { title: 'Davom etmoqda', items: nowWatching.ongoing },
              { title: 'To\'liq metrajli', items: nowWatching.movies }
            ].map((col, i) => (
              <div key={i} className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-[#8a60c2] rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">{col.title}</h3>
                </div>
                <div className="space-y-3">
                  {col.items.map((item) => (
                    <a key={item.id} href="#" className="relative overflow-hidden flex items-center gap-3 bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-white/5 hover:border-[#8a60c2]/30 rounded-lg p-2.5 transition-all duration-300 group w-full backdrop-blur-md">
                      
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] origin-center bg-gradient-to-tl from-[#8a60c2]/5 to-[#8a60c2]/20 rotate-[-45deg] translate-y-[100%] group-hover:translate-y-[40%] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-[#8a60c2]/50 shadow-[0_-5px_15px_rgba(138,96,194,0.15)]" />
                      </div>

                      <div className="w-12 h-16 rounded overflow-hidden shrink-0 relative z-10 border border-transparent group-hover:border-[#8a60c2]/30 transition-colors duration-300">
                        <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized loading="lazy" sizes="48px" />
                      </div>
                      
                      <div className="flex-1 min-w-0 z-10">
                        <h4 className="text-xs font-bold text-gray-300 truncate group-hover:text-white transition-colors">{item.title}</h4>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5 group-hover:text-[#8a60c2]/80 transition-colors">{item.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* НОВАЯ ЛЕЙАУТ-СТРУКТУРА: РАЗДЕЛЕНО НА 3 РЯДА */}
        <div className="mt-16 md:mt-28 w-full flex flex-col gap-12 md:gap-16">
          
          {/* ==================================================== */}
          {/* РЯД 1: ОБНОВЛЕНИЯ (слева 8) + ТОП И ОТЗЫВЫ (справа 4)*/}
          {/* ==================================================== */}
          <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            
            {/* ЛЕВАЯ КОЛОНКА (ОБНОВЛЕНИЯ) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">So'nggi yangilanishlar</h2>
                <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                  <span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" />
                </a>
              </div>
              
              <div className="flex flex-col">
                {/* ВЫВОДИМ 14 ЭЛЕМЕНТОВ ДЛЯ ИДЕАЛЬНОГО ВЫРАВНИВАНИЯ */}
                {latestUpdates.slice(0, 14).map((item, index) => (
                  <motion.a 
                    key={item.id} 
                    href="#" 
                    initial="initial"
                    whileHover="hover"
                    className="flex items-center gap-4 py-4 px-4 rounded-md relative overflow-hidden group transition-all duration-500 bg-[#121015]/30 backdrop-blur-md border-b border-white/5 last:border-0 hover:bg-[#1a191f]/50"
                  >
                    <motion.div 
                      variants={{
                        initial: { x: '-110%', skewX: -20 },
                        hover: { x: '-30%', skewX: -20 }
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-[#8a60c2]/5 pointer-events-none z-0"
                    />

                    <motion.div 
                      variants={{
                        initial: { x: '-120%', skewX: -20 },
                        hover: { x: '-50%', skewX: -20 }
                      }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#8a60c2]/20 to-transparent pointer-events-none z-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 cyber-noise" />
                    </motion.div>

                    <div className="pixel top-2 left-1/4" style={{ animationDelay: '0.1s' }} />
                    <div className="pixel bottom-4 left-1/3" style={{ animationDelay: '0.4s' }} />
                    <div className="pixel top-1/2 left-10" style={{ animationDelay: '0.7s' }} />

                    <motion.div 
                      variants={{
                        hover: { scale: 1.05, x: 5 }
                      }}
                      className="relative w-[65px] h-[95px] rounded-sm overflow-hidden shrink-0 z-10 border border-white/10 shadow-2xl transition-all"
                    >
                      <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
                      <motion.div 
                        variants={{
                          initial: { left: '-100%' },
                          hover: { left: '100%' }
                        }}
                        transition={{ duration: 0.8 }}
                        className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-20"
                      />
                    </motion.div>

                    <motion.div 
                      variants={{ hover: { x: 8 } }}
                      className="flex-1 min-w-0 z-10 relative"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="text-[10px] font-bold text-[#8a60c2] bg-[#8a60c2]/10 px-2 py-0.5 rounded-sm border border-[#8a60c2]/20 cursor-default"
                        >
                          {item.ep}
                        </motion.span>
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{item.type}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                            <Clock className="w-3 h-3" /> {item.time}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={{
                        initial: { opacity: 0, scale: 0.8 },
                        hover: { opacity: 1, scale: 1 }
                      }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 z-20 mr-2"
                    >
                      {[
                        { icon: Play, label: "Tomosha" },
                        { icon: Bookmark, label: "Saqlash" },
                        { icon: Plus, label: "Ro'yxat" }
                      ].map((btn, bIdx) => (
                        <motion.button
                          key={bIdx}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ 
                            type: "spring", stiffness: 400, damping: 15, delay: bIdx * 0.05 
                          }}
                          className="w-9 h-9 rounded-sm bg-[#8a60c2]/10 border border-[#8a60c2]/20 flex items-center justify-center transition-all duration-300 hover:bg-[#8a60c2] hover:border-[#8a60c2] hover:shadow-[0_0_15px_rgba(138,96,194,0.3)] group/btn"
                        >
                          <btn.icon className="w-4 h-4 text-[#8a60c2] group-hover/btn:text-white transition-all duration-300" />
                        </motion.button>
                      ))}
                    </motion.div>

                    <motion.div 
                      variants={{
                        initial: { width: 0, opacity: 0 },
                        hover: { width: '100%', opacity: 1 }
                      }}
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8a60c2] to-transparent z-30"
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА (ТОП И ОТЗЫВЫ) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              
              {/* HAFTALIK TOP */}
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Haftalik TOP</h2>
                  <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                    <span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col gap-2.5">
                  {topUsers.map((user, index) => {
                    const rankConfig = rankConfigs[user.rank];
                    const maxPoints = 15420;
                    const progressPercent = (user.points / maxPoints) * 100;
                    
                    return (
                      <div key={user.id} className="relative flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-md transition-all group overflow-hidden cursor-pointer backdrop-blur-sm">
                        <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-transform origin-center duration-500 group-hover:scale-y-100 scale-y-0
                          ${user.rank === 'amethyst' ? 'bg-violet-400' : ''}
                          ${user.rank === 'ruby' ? 'bg-red-400' : ''}
                          ${user.rank === 'emerald' ? 'bg-emerald-400' : ''}
                          ${user.rank === 'gold' ? 'bg-yellow-400' : ''}
                          ${user.rank === 'iron' ? 'bg-gray-300' : ''}
                          ${user.rank === 'wood' ? 'bg-amber-900' : ''}`}
                        />
                        <div className="relative w-16 h-12 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <Image src={rankConfig.imgSrc} alt={rankConfig.name} fill className="object-contain drop-shadow-md" unoptimized />
                        </div>
                        <div className={`w-8 h-8 rounded shrink-0 border flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 ${rankConfig.borderColor}`}>
                          <Image src={user.avatar} alt={user.name} fill className="object-cover z-0" unoptimized />
                          <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity z-10
                            ${user.rank === 'amethyst' ? 'bg-violet-400' : ''}
                            ${user.rank === 'ruby' ? 'bg-red-400' : ''}
                            ${user.rank === 'emerald' ? 'bg-emerald-400' : ''}
                            ${user.rank === 'gold' ? 'bg-yellow-400' : ''}
                            ${user.rank === 'iron' ? 'bg-gray-300' : ''}
                            ${user.rank === 'wood' ? 'bg-amber-950' : ''}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-bold truncate transition-all duration-300 ${rankConfig.color}`}>{user.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[#8a60c2] font-mono font-bold">Lv. {user.level}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[9px] text-gray-500 font-mono tracking-wider">{user.points.toLocaleString()} XP</span>
                          </div>
                          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progressPercent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
                              className={`h-full rounded-full ${rankConfig.progressGradient}`}
                            />
                          </div>
                        </div>
                        <div className={`text-[9px] font-mono font-bold shrink-0 ${rankConfig.color}`}>#{index + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OXIRGI SHARHLAR (5 штук) */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Oxirgi sharhlar</h2>
                  <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                    <span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  {reviews.slice(0, 5).map((review) => (
                    <a key={review.id} href="#" className="relative overflow-hidden bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-white/5 hover:border-[#8a60c2]/40 rounded-lg p-3 transition-all duration-300 group flex gap-3 h-[145px] backdrop-blur-md">
                      <div className="relative w-[95px] h-full shrink-0 overflow-hidden rounded-md border border-white/10 group-hover:border-[#8a60c2]/50 transition-colors duration-300 z-10 shadow-md bg-[#050408]">
                        <Image src={review.bgImage} alt={review.anime} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" unoptimized />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 relative z-10 py-0.5">
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{review.type === 'review' ? 'Taqriz' : 'Sharh'}</span>
                          <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${review.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                            {review.sentiment === 'positive' ? '+' : '–'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white mb-1.5 group-hover:text-[#8a60c2] transition-colors line-clamp-2 leading-snug">{review.title}</h3>
                        {review.anime && <p className="text-[9px] text-[#8a60c2] font-bold mb-1.5 truncate">{review.anime}</p>}
                        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-2 flex-1">{review.preview}</p>
                        <div className="flex items-center gap-3 text-gray-500 mt-auto">
                          <div className="flex items-center gap-1 hover:text-[#8a60c2] transition-colors"><ThumbsUp className="w-3.5 h-3.5" /><span className="text-[10px] font-mono group-hover:text-white transition-colors">{review.likes}</span></div>
                          <div className="flex items-center gap-1 hover:text-[#8a60c2] transition-colors"><MessageCircle className="w-3.5 h-3.5" /><span className="text-[10px] font-mono group-hover:text-white transition-colors">{review.comments}</span></div>
                          <span className="text-[9px] font-mono ml-auto group-hover:text-gray-300 transition-colors bg-white/5 px-2 py-0.5 rounded border border-white/5">{review.time}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ==================================================== */}
          {/* РЯД 2: ТЕМЫ ФОРУМА (50%) + БАННЕР ПЛЕЙСХОЛДЕР (50%)  */}
          {/* ==================================================== */}
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            
            {/* ЛЕВАЯ ПОЛОВИНА (ПОСЛЕДНИЕ ТЕМЫ ФОРУМА) */}
            <div className="flex flex-col h-[400px] md:h-[500px]">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#8a60c2]" /> So'nggi forum mavzulari
                </h2>
                <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                  <span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" />
                </a>
              </div>

              {/* Лента со скроллом */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8a60c2]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#8a60c2] [&::-webkit-scrollbar-thumb]:rounded-full">
                {forumTopics.map((topic) => (
                  <a key={topic.id} href="#" className="flex items-center gap-4 bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-white/5 hover:border-[#8a60c2]/30 rounded-xl p-3.5 transition-all duration-300 group backdrop-blur-md shrink-0">
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 transition-colors ${topic.bg}`}>
                      <Hash className={`w-4 h-4 ${topic.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/10 ${topic.color} ${topic.bg}`}>
                          {topic.tag}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1.5 group-hover:text-[#8a60c2] transition-colors truncate">{topic.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><User className="w-3 h-3" /> {topic.author}</span>
                        <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                      <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-[#8a60c2] transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono font-bold text-white">{topic.replies}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Eye className="w-3 h-3" />
                        <span className="text-[9px] font-mono">{topic.views}</span>
                      </div>
                    </div>

                  </a>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ ПОЛОВИНА (БАННЕР ПЛЕЙСХОЛДЕР) */}
            <div className="flex flex-col h-[400px] md:h-[500px]">
              <div className="flex items-center justify-between mb-6 border-b border-transparent pb-4 shrink-0 opacity-0 hidden md:flex">
                <h2 className="text-xl font-black">Spacer</h2>
              </div>
              
              {/* Контейнер баннера заполняет всю доступную высоту flex-1 */}
              <div className="flex-1 w-full bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-dashed border-white/10 hover:border-[#8a60c2]/40 rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 group cursor-pointer relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#8a60c2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#8a60c2] group-hover:bg-[#8a60c2]/10 transition-all duration-300 mb-4 relative z-10 shadow-lg">
                    <Plus className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors relative z-10">
                   Katta Banner
                 </span>
                 <span className="text-[10px] text-gray-600 font-mono mt-2 relative z-10 group-hover:text-[#8a60c2]/70 transition-colors text-center px-4 max-w-xs">
                   Bu yerda sizning gorizontal reklamangiz yoki maxsus rasm bo'lishi mumkin
                 </span>
              </div>
            </div>

          </section>

          {/* ==================================================== */}
          {/* РЯД 3: НОВОСТИ (На всю ширину контейнера, 2 ряда по 3) */}
          {/* ==================================================== */}
          <section className="w-full pt-4">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#8a60c2]" /> Yangiliklar
              </h2>
              <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                <span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" />
              </a>
            </div>

            {/* Сетка: на мобилках 1 колонка, на планшетах 2, на ПК 3 колонки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {news.map((item) => (
                <a key={item.id} href="#" className="bg-[#121015]/40 hover:bg-[#1a191f]/60 border border-white/5 hover:border-[#8a60c2]/40 rounded-xl p-4 transition-all duration-300 group flex flex-col h-auto min-h-[300px] backdrop-blur-md">
                  
                  {/* УВЕЛИЧЕННАЯ ОБЛОЖКА */}
                  <div className="relative w-full h-[180px] md:h-[200px] mb-4 rounded-lg overflow-hidden shrink-0 border border-white/5 group-hover:border-[#8a60c2]/30 transition-colors">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" unoptimized />
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a60c2]/80 mb-2 block truncate">{item.source}</span>
                    <h3 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-[#8a60c2] transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">{item.preview}</p>
                    <span className="text-[10px] text-gray-600 font-mono mt-auto flex items-center gap-1.5"><Clock className="w-3 h-3" /> {item.time}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-black/40 backdrop-blur-xl w-full pt-12 pb-24 md:pb-10 md:pt-20 border-t border-white/5 mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16 text-center md:text-left">
            <div className="md:col-span-1">
              <div className="text-2xl font-black tracking-tight italic mb-4 md:mb-6">Kawaii<span className="text-[#8a60c2]">UZ</span></div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">O'zbekistondagi eng sifatli va zamonaviy anime platformasi. Biz bilan sevimli animelaringizni o'zbek tilida, yuqori sifatda tomosha qiling.</p>
            </div>
            <div>
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-white">Navigatsiya</h3>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-white transition">Asosiy</a></li>
                <li><a href="manga_catalog.html" className="hover:text-white transition">Katalog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-white">Ma'lumot</h3>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-white transition">Savollar</a></li>
                <li><a href="#" className="hover:text-white transition">Aloqa</a></li>
                <li><a href="#" className="hover:text-white transition">Dasturchi</a></li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-white">Bizga qo'shiling</h3>
              <div className="flex gap-4 mb-4 md:mb-6">
                <a href="#" className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center hover:bg-[#8a60c2] transition group"><Send className="w-4 h-4 text-gray-400 group-hover:text-white transition" /></a>
              </div>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] md:text-[11px] text-gray-600 font-medium uppercase tracking-wider text-center md:text-left">© 2026 Kawaii.uz — Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] z-50">
        <a href="#" className="flex flex-col items-center gap-[2px] text-gray-500 hover:text-white transition group w-[15%]"><Bookmark className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide mt-1">Saqlanganlar</span></a>
        <a href="manga_catalog.html" className="flex flex-col items-center gap-[2px] text-gray-500 hover:text-white transition group w-[15%]"><Layers className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide mt-1">Katalog</span></a>
        <a href="#" className="flex flex-col items-center justify-center relative w-[20%] transform -translate-y-1"><div className="w-10 h-10 rounded-md bg-[#8a60c2] text-white flex items-center justify-center font-black italic drop-shadow-[0_0_10px_rgba(138,96,194,0.5)]">K</div></a>
        <a href="#" className="flex flex-col items-center gap-[2px] text-gray-500 hover:text-white transition group w-[15%] relative">
          <div className="relative"><Bell className="w-5 h-5 group-hover:text-white transition" /><span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-black" /></div>
          <span className="text-[8px] font-medium tracking-wide mt-1">Xabarlar</span>
        </a>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-[2px] text-gray-500 hover:text-white transition group w-[15%]"><Menu className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide mt-1">Menyu</span></button>
      </nav>

    </div>
  );
}