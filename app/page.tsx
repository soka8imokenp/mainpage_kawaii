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
// ИНТЕРАКТИВНАЯ СЕТКА (Для ПК)
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
    <div className="hidden md:block fixed inset-0 z-[-20] overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-[-15%] w-[130%] h-[130%]" style={{ y: translateY }}>
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: gridSize }} />
        <motion.div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, rgba(138,96,194,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,96,194,0.2) 1px, transparent 1px)`, backgroundSize: gridSize, WebkitMaskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px calc(${mouseY}px - ${translateY}px), black 0%, transparent 100%)`, maskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px calc(${mouseY}px - ${translateY}px), black 0%, transparent 100%)` }} />
      </motion.div>
      <motion.div className="absolute inset-0 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(138,96,194,0.08) 0%, transparent 80%)` }} />
    </div>
  );
};

// ============================================================
// МЕМОИЗИРОВАННАЯ КАРТОЧКА АККОРДЕОНА (ПК)
// ============================================================
const AccordionCard = memo(function AccordionCard({ anime, idx, isActive, onActivate }: any) {
  return (
    <motion.div
      onMouseEnter={() => onActivate(idx)} onClick={() => onActivate(idx)}
      animate={{ flex: isActive ? 6 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.8 }}
      className={`relative overflow-hidden rounded-2xl md:rounded-[2rem] cursor-pointer border transition-colors duration-300 group will-change-[flex]
        ${isActive ? 'border-white/10' : 'border-white/5 hover:border-white/10 bg-[#111] md:bg-[#121015]/60 backdrop-blur-sm'}`}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      <Image src={anime.img} alt={anime.title} fill unoptimized priority={idx <= 2} sizes={isActive ? '60vw' : '10vw'}
        className={`object-cover transition-all duration-700 ease-out pointer-events-none
          ${isActive ? 'scale-100 opacity-100 object-center' : 'scale-[1.15] opacity-40 grayscale-[60%] object-center group-hover:grayscale-[30%] group-hover:opacity-60'}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-90' : 'opacity-60'}`} />
      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent opacity-90 pointer-events-none" />}
      <motion.div initial={false} animate={{ opacity: isActive ? 0 : 1 }} transition={{ duration: 0.2, delay: isActive ? 0 : 0.4 }} className="absolute inset-0 flex flex-col items-center justify-between py-6 md:py-8 pointer-events-none">
        <div className="flex flex-col items-center gap-1"><span className="text-[12px] md:text-sm font-mono text-[#8a60c2]/70 font-black tracking-[0.3em]">0{idx + 1}</span><div className="w-8 h-[1px] bg-white/10" /></div>
        <div className="hidden md:flex flex-col items-center gap-3 px-2">
          <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#8a60c2]/60 fill-[#8a60c2]/40" /><span className="text-sm font-black text-white/80 tracking-tight">{anime.rating}</span></div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {anime.genres.slice(0, 2).map((genre: string) => (<span key={genre} className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/50 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03]">{genre}</span>))}
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
            <span className="px-2.5 py-1 bg-[#8a60c2]/15 border border-[#8a60c2]/30 text-[#8a60c2] text-[9px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm hidden md:inline-flex">{anime.type || 'TV Serial'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2 leading-[0.95]">{anime.title}</h2>
          <p className="text-gray-300 text-xs md:text-sm max-w-md mb-6 mt-4 line-clamp-2 leading-relaxed hidden md:block">{anime.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#8a60c2] hover:text-white hover:shadow-[0_0_20px_rgba(138,96,194,0.4)] transition-all duration-300 shadow-xl group">
              <Play size={16} fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-1" /> <span>Tomosha</span>
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
  
  // Состояние для клика по мобильному баннеру
  const [isBannerClicked, setIsBannerClicked] = useState(false);

  const continueWatchingRef = useRef<HTMLDivElement>(null);

  const handleActivate = useCallback((idx: number) => setActiveIdx(idx), []);
  const scrollLeft = useCallback(() => continueWatchingRef.current?.scrollBy({ left: -260, behavior: 'smooth' }), []);
  const scrollRight = useCallback(() => continueWatchingRef.current?.scrollBy({ left: 260, behavior: 'smooth' }), []);

  const currentFilterLabel = filterOptions.find(f => f.key === activeFilter)?.label || 'Kun davomida';

  // ФУНКЦИИ РЕНДЕРА ДЛЯ КОМПОНЕНТОВ
  const renderUpdates = (limit = 14) => (
    <div className="flex flex-col">
      {latestUpdates.slice(0, limit).map((item) => (
        <motion.a 
          key={item.id} href="#" initial="initial" whileHover="hover"
          className="flex items-center gap-4 py-3.5 lg:py-4 px-3 lg:px-4 rounded-md relative overflow-hidden group transition-all duration-500 bg-transparent lg:bg-[#121015]/30 lg:backdrop-blur-md border-b border-[#1c1c1e] lg:border-white/5 last:border-0 hover:bg-[#111] lg:hover:bg-[#1a191f]/50"
        >
          <motion.div variants={{ initial: { x: '-110%', skewX: -20 }, hover: { x: '-30%', skewX: -20 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 bg-[#8a60c2]/5 pointer-events-none z-0" />
          <motion.div variants={{ initial: { x: '-120%', skewX: -20 }, hover: { x: '-50%', skewX: -20 } }} transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }} className="absolute inset-0 bg-gradient-to-r from-[#8a60c2]/20 to-transparent pointer-events-none z-0 overflow-hidden"><div className="absolute inset-0 cyber-noise" /></motion.div>
          <div className="pixel top-2 left-1/4" style={{ animationDelay: '0.1s' }} /><div className="pixel bottom-4 left-1/3" style={{ animationDelay: '0.4s' }} /><div className="pixel top-1/2 left-10" style={{ animationDelay: '0.7s' }} />
          <motion.div variants={{ hover: { scale: 1.05, x: 5 } }} className="relative w-[55px] h-[80px] lg:w-[65px] lg:h-[95px] rounded-sm overflow-hidden shrink-0 z-10 border border-white/5 lg:border-white/10 shadow-lg transition-all">
            <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
            <motion.div variants={{ initial: { left: '-100%' }, hover: { left: '100%' } }} transition={{ duration: 0.8 }} className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-20" />
          </motion.div>
          <motion.div variants={{ hover: { x: 8 } }} className="flex-1 min-w-0 z-10 relative">
            <div className="flex items-center gap-2 mb-1"><h3 className="text-sm font-medium lg:font-black text-white lg:uppercase tracking-tight transition-colors duration-300 truncate lg:whitespace-normal">{item.title}</h3></div>
            <div className="flex items-center gap-2">
              <motion.span whileHover={{ scale: 1.1 }} className="text-[9px] lg:text-[10px] font-bold text-[#8a60c2] bg-[#8a60c2]/10 px-2 py-0.5 rounded-sm border border-[#8a60c2]/20 cursor-default">{item.ep}</motion.span>
              <span className="text-[8px] lg:text-[9px] font-mono text-gray-500 uppercase tracking-widest">{item.type}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3"><span className="text-[9px] text-gray-600 font-mono flex items-center gap-1 group-hover:text-gray-400 transition-colors"><Clock className="w-3 h-3" /> {item.time}</span></div>
          </motion.div>
          <motion.div variants={{ initial: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1 } }} transition={{ duration: 0.2 }} className="hidden lg:flex items-center gap-2 z-20 mr-2">
            {[{ icon: Play }, { icon: Bookmark }, { icon: Plus }].map((btn, bIdx) => (
              <motion.button key={bIdx} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-sm bg-[#8a60c2]/10 border border-[#8a60c2]/20 flex items-center justify-center transition-all duration-300 hover:bg-[#8a60c2] hover:border-[#8a60c2] group/btn"><btn.icon className="w-4 h-4 text-[#8a60c2] group-hover/btn:text-white transition-all" /></motion.button>
            ))}
          </motion.div>
          <motion.div variants={{ initial: { width: 0, opacity: 0 }, hover: { width: '100%', opacity: 1 } }} className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8a60c2] to-transparent z-30 hidden lg:block" />
        </motion.a>
      ))}
    </div>
  );

  const renderTopUsers = () => (
    <div className="flex flex-col gap-2.5">
      {topUsers.map((user, index) => {
        const rankConfig = rankConfigs[user.rank];
        const progressPercent = (user.points / 15420) * 100;
        return (
          <div key={user.id} className="relative flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-xl transition-all group overflow-hidden cursor-pointer backdrop-blur-sm">
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-transform origin-center duration-500 group-hover:scale-y-100 scale-y-0 ${user.rank === 'amethyst' ? 'bg-violet-400' : user.rank === 'ruby' ? 'bg-red-400' : user.rank === 'emerald' ? 'bg-emerald-400' : user.rank === 'gold' ? 'bg-yellow-400' : user.rank === 'iron' ? 'bg-gray-300' : 'bg-amber-900'}`} />
            <div className="relative w-12 h-10 lg:w-16 lg:h-12 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Image src={rankConfig.imgSrc} alt={rankConfig.name} fill className="object-contain drop-shadow-md" unoptimized />
            </div>
            <div className={`w-8 h-8 rounded shrink-0 border flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 ${rankConfig.borderColor}`}>
              <Image src={user.avatar} alt={user.name} fill className="object-cover z-0" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold truncate transition-all duration-300 ${rankConfig.color}`}>{user.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-[#8a60c2] font-mono font-bold">Lv. {user.level}</span>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[9px] text-gray-500 font-mono tracking-wider">{user.points.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-1.5 hidden lg:block">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${progressPercent}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }} className={`h-full rounded-full ${rankConfig.progressGradient}`} />
              </div>
            </div>
            <div className={`text-[9px] font-mono font-bold shrink-0 pr-2 lg:pr-0 ${rankConfig.color}`}>#{index + 1}</div>
          </div>
        );
      })}
    </div>
  );

  // ПЬЕДЕСТАЛ ТОП-3 ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
  const renderMobileTopUsers = () => {
    const top3 = topUsers.slice(0, 3);
    const rest = topUsers.slice(3, 10);
    const pedestal = [top3[1], top3[0], top3[2]]; // 2-е место, 1-е место, 3-е место

    return (
      <div className="flex flex-col gap-6">
        {/* Пьедестал с выравниванием по низу (items-end) */}
        <div className="flex items-end justify-center gap-2 pt-10">
          {pedestal.map((user) => {
            const rankConfig = rankConfigs[user.rank];
            const isFirst = user.id === top3[0].id;
            const isSecond = user.id === top3[1].id;
            
            // Задаем высоту колонок (разная)
            const heightClass = isFirst ? 'h-[165px]' : isSecond ? 'h-[150px]' : 'h-[145px]';
            const placeNum = isFirst ? '1' : isSecond ? '2' : '3';
            
            const badgeColors = isFirst 
              ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
              : isSecond 
              ? 'bg-gray-300 text-gray-800 shadow-[0_0_10px_rgba(209,213,219,0.5)]' 
              : 'bg-amber-700 text-amber-100 shadow-[0_0_10px_rgba(180,83,9,0.5)]';

            return (
              <div key={user.id} className={`relative flex flex-col items-center w-[32%] bg-[#111] border border-white/5 rounded-t-xl pb-3 px-1 ${heightClass}`}>
                <div className={`absolute inset-0 opacity-[0.03] rounded-t-xl ${rankConfig.bgRank}`} />
                <div className={`absolute top-0 w-full h-[2px] ${rankConfig.progressGradient}`} />

                {/* Аватарка (Всегда торчит сверху из-за абсолюта) */}
                <div className={`absolute -top-8 w-14 h-14 rounded-full border-[2px] flex items-center justify-center bg-black shadow-lg ${rankConfig.borderColor}`}>
                  <Image src={user.avatar} alt={user.name} fill className="object-cover rounded-full z-0 p-[2px]" unoptimized />
                  <div className={`absolute -bottom-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-20 ${badgeColors}`}>
                    {placeNum}
                  </div>
                </div>

                {/* ЗНАЧОК РАНГА (Прижимаем к низу через mt-auto) */}
                <div 
                  className="relative shrink-0 flex items-center justify-center z-10 mt-auto"
                  style={{
                    width: '55px',       // <-- МЕНЯЙ ШИРИНУ ЗДЕСЬ 
                    height: '55px',      // <-- МЕНЯЙ ВЫСОТУ ЗДЕСЬ
                  }}
                >
                  <Image src={rankConfig.imgSrc} alt={rankConfig.name} fill className="object-contain drop-shadow-md" unoptimized />
                </div>

                {/* ТЕКСТ (Всегда сразу под значком) */}
                <div className="flex flex-col items-center mt-1 z-10 w-full px-1">
                  <span className={`text-[10px] font-bold truncate w-full text-center ${rankConfig.color}`}>{user.name}</span>
                  <span className="text-[9px] text-gray-500 font-mono mt-0.5">{user.points.toLocaleString()} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Список 4-10 */}
        <div className="flex flex-col gap-2.5">
          {rest.map((user, index) => {
            const rankConfig = rankConfigs[user.rank];
            const actualIndex = index + 4; 
            return (
              <div key={user.id} className="relative flex items-center gap-3 p-3 bg-[#111] border border-white/5 rounded-xl transition-all overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${user.rank === 'amethyst' ? 'bg-violet-400' : user.rank === 'ruby' ? 'bg-red-400' : user.rank === 'emerald' ? 'bg-emerald-400' : user.rank === 'gold' ? 'bg-yellow-400' : user.rank === 'iron' ? 'bg-gray-300' : 'bg-amber-900'}`} />
                <div className="text-[11px] font-mono font-bold text-gray-600 w-4 text-center">{actualIndex}</div>
                
                <div className={`w-9 h-9 rounded shrink-0 border relative overflow-hidden ${rankConfig.borderColor}`}>
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" unoptimized />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[12px] font-bold truncate ${rankConfig.color}`}>{user.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-[#8a60c2] font-mono font-bold">Lv. {user.level}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-gray-500 font-mono tracking-wider">{user.points.toLocaleString()} XP</span>
                  </div>
                </div>
                
                {/* ЗНАЧОК РАНГА В СПИСКЕ */}
                <div className="flex flex-col items-end shrink-0 pr-1">
                   <div 
                     className="relative flex items-center justify-center"
                     style={{
                       width: '45px',       // <-- МЕНЯЙ ШИРИНУ ЗДЕСЬ 
                       height: '45px',      // <-- МЕНЯЙ ВЫСОТУ ЗДЕСЬ 
                     }}
                   >
                     <Image src={rankConfig.imgSrc} alt={rankConfig.name} fill className="object-contain" unoptimized />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReviews = (limit = 5) => (
    <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-4">
      {reviews.slice(0, limit).map((review) => (
        <a key={review.id} href="#" className="relative overflow-hidden bg-[#111] lg:bg-[#121015]/40 hover:bg-[#161616] lg:hover:bg-[#1a191f]/60 border border-transparent lg:border-white/5 lg:hover:border-[#8a60c2]/40 rounded-xl p-2.5 lg:p-3 transition-all duration-300 group flex flex-col lg:flex-row gap-3 h-auto lg:h-[145px] lg:backdrop-blur-md">
          {/* СЕТКА С ТОЧКАМИ НА ФОНЕ (ДЛЯ ДИЗАЙНА) */}
          <div className="absolute inset-0 z-0 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(138,96,194, 0.8) 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />

          <div className="relative w-full h-[90px] lg:w-[95px] lg:h-full shrink-0 overflow-hidden rounded-md border border-white/5 lg:border-white/10 group-hover:border-[#8a60c2]/50 transition-colors duration-300 z-10 bg-black">
            <Image src={review.bgImage} alt={review.anime} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" unoptimized />
          </div>
          <div className="flex flex-col flex-1 min-w-0 relative z-10">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-white/5 lg:bg-black/40 px-1.5 py-0.5 rounded border border-white/5 lg:border-white/10">{review.type === 'review' ? 'Taqriz' : 'Sharh'}</span>
              <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${review.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                {review.sentiment === 'positive' ? '+' : '–'}
              </span>
            </div>
            <h3 className="text-[11px] lg:text-xs font-bold text-white mb-1.5 group-hover:text-[#8a60c2] transition-colors line-clamp-2 leading-snug">{review.title}</h3>
            {review.anime && <p className="text-[9px] text-[#8a60c2] font-bold mb-1.5 truncate hidden lg:block">{review.anime}</p>}
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-2 flex-1 hidden lg:block">{review.preview}</p>
            <div className="flex items-center justify-between lg:justify-start gap-3 text-gray-500 mt-auto">
              <div className="flex gap-3">
                <div className="flex items-center gap-1 hover:text-[#8a60c2] transition-colors"><ThumbsUp className="w-3 h-3 lg:w-3.5 lg:h-3.5" /><span className="text-[9px] lg:text-[10px] font-mono group-hover:text-white transition-colors">{review.likes}</span></div>
                <div className="flex items-center gap-1 hover:text-[#8a60c2] transition-colors"><MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5" /><span className="text-[9px] lg:text-[10px] font-mono group-hover:text-white transition-colors">{review.comments}</span></div>
              </div>
              <span className="text-[8px] font-mono lg:ml-auto group-hover:text-gray-300 transition-colors bg-white/5 lg:bg-black/40 px-2 py-0.5 rounded border border-white/5 truncate">{review.time}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  const renderForum = () => (
    <div className="flex flex-col gap-0 lg:gap-3 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 lg:pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8a60c2]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#8a60c2] [&::-webkit-scrollbar-thumb]:rounded-full">
      {forumTopics.map((topic) => (
        <a key={topic.id} href="#" className="flex items-center justify-between lg:justify-start gap-4 py-3 lg:p-3.5 bg-transparent lg:bg-[#121015]/40 hover:bg-[#111] lg:hover:bg-[#1a191f]/60 border-b border-[#1c1c1e] lg:border-white/5 lg:hover:border-[#8a60c2]/30 rounded-none lg:rounded-xl transition-all duration-300 group lg:backdrop-blur-md shrink-0">
          <div className={`hidden lg:flex w-10 h-10 rounded-full items-center justify-center shrink-0 border border-white/10 transition-colors ${topic.bg}`}>
            <Hash className={`w-4 h-4 ${topic.color}`} />
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="hidden lg:flex items-center gap-2 mb-1">
              <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/10 ${topic.color} ${topic.bg}`}>{topic.tag}</span>
            </div>
            <h3 className="text-[13px] lg:text-xs font-medium lg:font-bold text-gray-200 lg:text-white mb-0 lg:mb-1.5 group-hover:text-[#8a60c2] transition-colors truncate pr-2">{topic.title}</h3>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><User className="w-3 h-3" /> {topic.author}</span>
              <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-1.5 shrink-0 text-gray-500 lg:pl-2">
            <div className="flex items-center gap-1.5 group-hover:text-[#8a60c2] transition-colors">
              <Eye className="w-4 h-4 lg:w-3 lg:h-3 hidden lg:block" />
              <Eye className="w-3.5 h-3.5 block lg:hidden" />
              <span className="text-[11px] lg:text-[9px] font-mono text-gray-400 lg:text-gray-500">{topic.views}</span>
            </div>
            <div className="flex items-center gap-1.5 group-hover:text-[#8a60c2] transition-colors">
              <MessageCircle className="w-4 h-4 lg:w-3.5 lg:h-3.5 hidden lg:block" />
              <MessageCircle className="w-3.5 h-3.5 block lg:hidden" />
              <span className="text-[11px] lg:text-[10px] font-mono lg:font-bold text-gray-400 lg:text-white">{topic.replies}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  const renderNews = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
      {news.map((item) => (
        <a key={item.id} href="#" className="bg-[#111] lg:bg-[#121015]/40 hover:bg-[#161616] lg:hover:bg-[#1a191f]/60 border border-transparent lg:border-white/5 lg:hover:border-[#8a60c2]/40 rounded-xl p-3 lg:p-4 transition-all duration-300 group flex flex-col h-auto min-h-[200px] lg:min-h-[300px] lg:backdrop-blur-md">
          <div className="relative w-full h-[100px] lg:h-[200px] mb-3 lg:mb-4 rounded-lg overflow-hidden shrink-0 border border-white/5 lg:group-hover:border-[#8a60c2]/30 transition-colors bg-black">
            <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" unoptimized />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#8a60c2]/80 mb-1.5 lg:mb-2 block truncate">{item.source}</span>
            <h3 className="text-xs lg:text-base font-bold text-white mb-1.5 lg:mb-2 group-hover:text-[#8a60c2] transition-colors line-clamp-2 leading-snug">{item.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1 hidden lg:block">{item.preview}</p>
            <span className="text-[9px] lg:text-[10px] text-gray-600 font-mono mt-auto flex items-center gap-1.5"><Clock className="w-3 h-3" /> {item.time}</span>
          </div>
        </a>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#8a60c2] selection:text-white font-sans overflow-x-hidden flex flex-col relative z-0">
      
      {/* ПК ФОН (Сетка и Шум) */}
      <SpotlightGrid />
      <div className="hidden md:block fixed inset-0 z-[-15] pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HEADER ПК */}
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

      {/* МОБИЛЬНЫЙ ПОИСК (HEADER) */}
      <div className="md:hidden sticky top-0 px-4 pt-4 pb-3 w-full z-50 bg-black border-b border-[#111]">
        <div className="bg-[#111] border border-[#222] rounded-xl h-11 flex items-center px-3 gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Tezkor qidiruv" className="bg-transparent border-none outline-none text-white text-[15px] w-full placeholder-gray-500" />
        </div>
      </div>

      <main className="relative z-10 pt-4 md:pt-28 pb-24 max-w-7xl mx-auto px-4 md:px-5 w-full flex-1">
        
        {/* АККОРДЕОН (Только на ПК) */}
        <div className="hidden md:flex flex-col md:flex-row h-[50vh] md:h-[60vh] w-full gap-3 md:gap-4 mt-4 md:mt-0">
          {showcaseAnime.map((anime, idx) => (
            <AccordionCard key={anime.id} anime={anime} idx={idx} isActive={activeIdx === idx} onActivate={handleActivate} />
          ))}
        </div>

        {/* МОБИЛЬНЫЙ БАННЕР С АНИМАЦИЕЙ КЛИКА */}
        <motion.div 
          onClick={() => setIsBannerClicked(!isBannerClicked)}
          animate={{ backgroundColor: isBannerClicked ? '#8a60c2' : '#1A1122' }}
          className="flex md:hidden h-[50vh] w-full rounded-2xl relative overflow-hidden shadow-xl border border-white/5 active:scale-[0.98] transition-transform cursor-pointer mt-2"
        >
          {/* Изображение маскота прижатое к низу */}
          <motion.div 
            animate={{ 
              x: isBannerClicked ? '25%' : '0%', 
              opacity: isBannerClicked ? 0.3 : 1,
              scale: isBannerClicked ? 1.1 : 1.25 // Увеличено
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 origin-bottom pointer-events-none"
          >
            <Image 
              src="/images/banner.png" 
              alt="Reklama Banneri" 
              fill 
              style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
              className="relative z-10" 
              unoptimized 
            />
          </motion.div>

          {/* Анимация текста при клике */}
          <AnimatePresence>
            {isBannerClicked && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-center px-6 z-20"
              >
                <motion.h2 
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                  className="text-6xl font-black tracking-tighter text-black"
                >
                  KAWAII
                </motion.h2>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <a href="#" className="flex items-center gap-2.5 text-black hover:opacity-70 transition-opacity">
                    <Send className="w-5 h-5" />
                    <span className="text-sm font-bold tracking-widest">kawaii_uz_official</span>
                  </a>
                  {/* ИСПОЛЬЗУЕМ ВСТРОЕННЫЙ SVG ВМЕСТО ПРОБЛЕМНОГО ИМПОРТА */}
                  <a href="#" className="flex items-center gap-2.5 text-black hover:opacity-70 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span className="text-sm font-bold tracking-widest">kawaii_uz_official</span>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* DAVOM ETTIRISH */}
        <section className="mt-8 md:mt-20 w-full">
          <div className="flex justify-between items-end mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">Davom ettirish</h2>
              <p className="text-[9px] md:text-xs uppercase tracking-widest text-[#8a60c2] mt-0.5 md:mt-1 font-bold">O'qiyapsiz</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={scrollLeft} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#8a60c2]/50 hover:bg-white/5 transition"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={scrollRight} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#8a60c2]/50 hover:bg-white/5 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div ref={continueWatchingRef} className="flex gap-3 md:gap-6 overflow-x-auto pb-4 snap-x scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {continueWatching.map((item) => (
              <a key={item.id} href="#" className="snap-start flex-shrink-0 w-[180px] md:w-[260px] bg-[#111] md:bg-[#121015]/40 hover:bg-[#1a1a1c] md:hover:bg-[#1a191f]/60 border border-transparent md:border-white/5 hover:border-[#8a60c2]/40 transition-all duration-300 rounded-xl md:rounded-lg p-2 md:p-2.5 flex items-center gap-3 group relative overflow-hidden md:backdrop-blur-md">
                <div className="relative w-16 h-10 md:w-20 md:h-12 rounded md:rounded bg-[#0d0c10] overflow-hidden shrink-0 border border-white/5">
                  <Image src={item.img} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" unoptimized loading="lazy" sizes="80px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" /></div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-wider truncate transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[8px] md:text-[9px] font-mono"><span className="text-[#8a60c2]">{item.ep}</span><span className="text-gray-500">/ {item.total}</span></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5"><motion.div initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#8a60c2]" /></div>
              </a>
            ))}
          </div>
        </section>

        {/* HOZIR KO'RILYAPTI */}
        <section className="mt-8 md:mt-24 w-full">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">Hozir ko'rilyapti</h2>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111] md:bg-[#121015]/80 border border-transparent md:border-white/5 text-gray-300 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:border-[#8a60c2]/40 md:hover:bg-[#8a60c2]/10 hover:text-white md:hover:shadow-[0_0_15px_rgba(138,96,194,0.15)] transition-all duration-300 md:backdrop-blur-md group">
                <span>{currentFilterLabel}</span>
                <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500 group-hover:text-[#8a60c2] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 mt-2 w-44 bg-[#1c1c1e] md:bg-[#121015]/95 border border-transparent md:border-[#8a60c2]/20 rounded-lg shadow-2xl overflow-hidden z-50 md:backdrop-blur-xl">
                    <div className="hidden md:block absolute inset-0 cyber-noise pointer-events-none" />
                    <div className="relative z-10 p-1.5 flex flex-col gap-0.5">
                      {filterOptions.map((option) => (
                        <button key={option.key} onClick={() => { setActiveFilter(option.key); setIsDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between rounded-md ${activeFilter === option.key ? 'bg-[#8a60c2]/20 text-white shadow-[inset_2px_0_0_#8a60c2]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          {option.label}
                          {activeFilter === option.key && <span className="w-1.5 h-1.5 rounded-full bg-[#8a60c2] shadow-[0_0_6px_#8a60c2]" />}
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
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="w-1 h-4 md:h-5 bg-[#8a60c2] rounded-full" />
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-white">{col.title}</h3>
                </div>
                <div className="space-y-2.5 md:space-y-3">
                  {col.items.map((item) => (
                    <a key={item.id} href="#" className="relative overflow-hidden flex items-center gap-3 bg-[#111] md:bg-[#121015]/40 hover:bg-[#1a1a1c] md:hover:bg-[#1a191f]/60 border border-transparent md:border-white/5 hover:border-[#8a60c2]/30 rounded-xl md:rounded-lg p-2 md:p-2.5 transition-all duration-300 group w-full md:backdrop-blur-md">
                      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
                        <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] origin-center bg-gradient-to-tl from-[#8a60c2]/5 to-[#8a60c2]/20 rotate-[-45deg] translate-y-[100%] group-hover:translate-y-[40%] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-[#8a60c2]/50 shadow-[0_-5px_15px_rgba(138,96,194,0.15)]" />
                      </div>
                      <div className="w-10 h-14 md:w-12 md:h-16 rounded md:rounded-md overflow-hidden shrink-0 relative z-10 border border-transparent group-hover:border-[#8a60c2]/30 transition-colors duration-300 bg-black">
                        <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized loading="lazy" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0 z-10">
                        <h4 className="text-[11px] md:text-xs font-bold text-gray-200 md:text-gray-300 truncate group-hover:text-white transition-colors">{item.title}</h4>
                        <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-wider mt-0.5 md:mt-1 group-hover:text-[#8a60c2]/80 transition-colors">{item.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================== */}
        {/* DESKTOP LAYOUT (Скрыт на телефонах)                  */}
        {/* ==================================================== */}
        <div className="hidden lg:flex mt-28 w-full flex-col gap-16">
          <section className="w-full grid grid-cols-12 gap-10">
            <div className="col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">So'nggi yangilanishlar</h2>
                <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition"><span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" /></a>
              </div>
              {renderUpdates(14)}
            </div>
            <div className="col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Haftalik TOP</h2>
                  <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition"><span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" /></a>
                </div>
                {renderTopUsers()}
              </div>
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Oxirgi sharhlar</h2>
                  <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition"><span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" /></a>
                </div>
                {renderReviews(5)}
              </div>
            </div>
          </section>

          <section className="w-full grid grid-cols-2 gap-10 h-[500px]">
            <div className="flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#8a60c2]" /> So'nggi forum mavzulari</h2>
                <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition"><span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" /></a>
              </div>
              {renderForum()}
            </div>
            <div className="flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-6 border-b border-transparent pb-4 shrink-0 opacity-0"><h2 className="text-xl font-black">Spacer</h2></div>
              <a href="#" className="flex-1 w-full bg-[#1A1122] rounded-xl flex flex-col items-center justify-center transition-all duration-500 group cursor-pointer relative overflow-hidden border border-white/5 shadow-xl">
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                 <Image src="/images/banner.png" alt="Reklama Banneri" fill style={{ objectFit: 'contain', transform: 'scale(1.2)', objectPosition: '50% 50%' }} className="relative z-10 transition-all duration-500 pointer-events-none p-4" unoptimized />
              </a>
            </div>
          </section>

          <section className="w-full pt-4">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2"><Newspaper className="w-5 h-5 text-[#8a60c2]" /> Yangiliklar</h2>
              <a href="#" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition"><span>Barchasi</span> <ChevronRightIcon className="w-3 h-3" /></a>
            </div>
            {renderNews()}
          </section>
        </div>

        {/* ==================================================== */}
        {/* MOBILE LAYOUT (Скрыт на ПК)                          */}
        {/* ==================================================== */}
        <div className="flex lg:hidden mt-10 w-full flex-col gap-12">
          
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">So'nggi yangilanishlar</h2>
              <a href="#" className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Barchasi <ChevronRightIcon className="w-3 h-3" /></a>
            </div>
            {renderUpdates(8)}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#8a60c2]" /> Forum</h2>
              <a href="#" className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Barchasi <ChevronRightIcon className="w-3 h-3" /></a>
            </div>
            {renderForum()}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Oxirgi sharhlar</h2>
            </div>
            {renderReviews(4)}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2"><Newspaper className="w-5 h-5 text-[#8a60c2]" /> Yangiliklar</h2>
            </div>
            {renderNews()}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Haftalik TOP</h2>
            </div>
            {renderMobileTopUsers()}
          </section>

        </div>

      </main>

      {/* FOOTER (Скрыт на мобильных устройствах через класс hidden md:block) */}
      <footer className="hidden md:block bg-black/40 backdrop-blur-xl w-full pt-10 pb-[100px] md:pb-10 md:pt-20 border-t border-white/5 mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16 text-center md:text-left">
            <div className="md:col-span-1">
              <div className="text-2xl font-black tracking-tight italic mb-3 md:mb-6">Kawaii<span className="text-[#8a60c2]">UZ</span></div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">O'zbekistondagi eng sifatli va zamonaviy anime platformasi. Biz bilan sevimli animelaringizni o'zbek tilida, yuqori sifatda tomosha qiling.</p>
            </div>
            <div className="hidden md:block">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-white">Navigatsiya</h3>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-white transition">Asosiy</a></li>
                <li><a href="manga_catalog.html" className="hover:text-white transition">Katalog</a></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-white">Ma'lumot</h3>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-white transition">Savollar</a></li>
                <li><a href="#" className="hover:text-white transition">Aloqa</a></li>
                <li><a href="#" className="hover:text-white transition">Dasturchi</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex justify-center md:justify-between items-center">
            <p className="text-[9px] md:text-[11px] text-gray-600 font-medium uppercase tracking-wider text-center md:text-left">© 2026 Kawaii.uz — Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-[#111] flex justify-around pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] z-50">
        <a href="#" className="flex flex-col items-center gap-[4px] text-gray-500 hover:text-white transition group w-[15%]"><Bookmark className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide">Saqlanganlar</span></a>
        <a href="manga_catalog.html" className="flex flex-col items-center gap-[4px] text-gray-500 hover:text-white transition group w-[15%]"><Layers className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide">Katalog</span></a>
        
        {/* КНОПКА С ЛОГОТИПОМ ПО ЦЕНТРУ */}
        <a href="#" className="flex flex-col items-center justify-center relative w-[20%] transform -translate-y-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden relative border border-[#222]">
             <Image src="/images/logo.jpg" alt="KawaiiUZ Logo" fill className="object-cover" unoptimized />
          </div>
        </a>

        <a href="#" className="flex flex-col items-center gap-[4px] text-gray-500 hover:text-white transition group w-[15%] relative">
          <div className="relative"><Bell className="w-5 h-5 group-hover:text-white transition" /><span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-black" /></div>
          <span className="text-[8px] font-medium tracking-wide">Xabarlar</span>
        </a>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-[4px] text-gray-500 hover:text-white transition group w-[15%]"><Menu className="w-5 h-5 group-hover:text-white transition" /><span className="text-[8px] font-medium tracking-wide">Menyu</span></button>
      </nav>

    </div>
  );
}