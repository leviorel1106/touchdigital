export interface YoutubeVideo {
  id: string
  title: string
}

// TODO: החלף ב-IDs אמיתיים מ-YouTube שאתה רוצה
export const FUNNY_YOUTUBE_VIDEOS: YoutubeVideo[] = [
  { id: 'zBi3JIqAqbE', title: '🥷 צבי הנינג\'ה' },
  { id: 'R83OgwJgfMI', title: '🎤 ניר וגלי' },
  { id: 'lfPqCqJlOlk', title: '😂 אסי וגורי' },
  { id: 'eHCH3EoIXkE', title: '🏛️ הפרלמנט' },
  { id: 'JkaxUblCGz0', title: '🎭 שחר חסון' },
  { id: '9bZkp7q19f0', title: '🎵 הפתעה קוריאנית' },
  { id: 'dQw4w9WgXcQ', title: '🎸 קלאסיקה' },
  { id: 'GtL1huin9EE', title: '🐦 ציפור מפתיעה' },
  { id: '2Z4m4lnjxkY', title: '🌟 אגדה ישראלית' },
  { id: 'C2w0jnG0vJo', title: '🎪 ארטיק' },
]

const TRIGGER_AVG = 6
const TRIGGER_VARIANCE = 2

export function getNextTriggerThreshold(): number {
  const variance = (Math.random() * 2 - 1) * TRIGGER_VARIANCE
  return Math.max(3, Math.round(TRIGGER_AVG + variance))
}

export function getRandomVideo(): YoutubeVideo {
  return FUNNY_YOUTUBE_VIDEOS[Math.floor(Math.random() * FUNNY_YOUTUBE_VIDEOS.length)]
}
