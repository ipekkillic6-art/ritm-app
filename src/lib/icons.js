/** Lucide ikon kaydı — alışkanlık ikonları string anahtarla seçilir. */
import {
  Activity,
  Apple,
  BookOpen,
  Brain,
  Coffee,
  Droplet,
  Dumbbell,
  Feather,
  Flame,
  Footprints,
  Heart,
  Leaf,
  Moon,
  Music,
  PenLine,
  Sparkles,
  Sun,
  Target,
} from 'lucide-react-native';

export const HABIT_ICONS = {
  droplet: Droplet,
  dumbbell: Dumbbell,
  book: BookOpen,
  moon: Moon,
  brain: Brain,
  footprints: Footprints,
  coffee: Coffee,
  apple: Apple,
  pen: PenLine,
  sun: Sun,
  heart: Heart,
  leaf: Leaf,
  music: Music,
  sparkles: Sparkles,
  activity: Activity,
  feather: Feather,
};

/** Ekle ekranındaki ikon seçici ızgarası. */
export const ICON_CHOICES = Object.keys(HABIT_ICONS);

export function getIcon(name) {
  return HABIT_ICONS[name] ?? Target;
}

/** Alışkanlık renk paleti (marka + semantik türevleri). */
export const HABIT_COLORS = [
  '#EF4444', // kırmızı (marka)
  '#EC4899', // pembe
  '#3B82F6', // mavi
  '#10B981', // yeşil
  '#F59E0B', // amber
  '#06B6D4', // camgöbeği
  '#F97316', // turuncu
  '#F43F5E', // gül
];
