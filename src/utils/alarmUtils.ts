import { Alarm } from '../types';

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatTime(time: string, use12h = true): string {
  const [h, m] = time.split(':').map(Number);
  if (!use12h) return time;
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatTimeComponents(time: string): { hour: string; minute: string; period: string } {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour = (h % 12 || 12).toString();
  const minute = m.toString().padStart(2, '0');
  return { hour, minute, period };
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function formatDays(days: number[]): string {
  if (days.length === 0) return 'Once';
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Weekdays';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  return days.sort().map((d) => DAY_NAMES[d]).join(', ');
}

export function getNextAlarmTime(alarm: Alarm): Date | null {
  if (!alarm.enabled) return null;
  const [h, m] = alarm.time.split(':').map(Number);
  const now = new Date();
  const today = now.getDay();
  const todayMinutes = now.getHours() * 60 + now.getMinutes();
  const alarmMinutes = h * 60 + m;

  if (alarm.days.length === 0) {
    // One-time alarm
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  // Find next matching day
  for (let i = 0; i < 8; i++) {
    const checkDay = (today + i) % 7;
    if (alarm.days.includes(checkDay)) {
      if (i === 0 && alarmMinutes <= todayMinutes) continue;
      const next = new Date();
      next.setDate(next.getDate() + i);
      next.setHours(h, m, 0, 0);
      return next;
    }
  }
  return null;
}

export function getNextAlarmLabel(alarm: Alarm): string {
  const next = getNextAlarmTime(alarm);
  if (!next) return '';
  const now = new Date();
  const diffMs = next.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const remainMins = diffMins % 60;

  if (diffMins < 1) return 'Less than a minute';
  if (diffMins < 60) return `In ${diffMins} min`;
  if (diffHours < 24) {
    return remainMins > 0
      ? `In ${diffHours}h ${remainMins}m`
      : `In ${diffHours}h`;
  }
  const days = Math.floor(diffHours / 24);
  return `In ${days} day${days > 1 ? 's' : ''}`;
}

export function getNextEnabledAlarm(alarms: Alarm[]): Alarm | null {
  const enabled = alarms.filter((a) => a.enabled);
  if (!enabled.length) return null;

  let earliest: { alarm: Alarm; time: Date } | null = null;
  for (const alarm of enabled) {
    const t = getNextAlarmTime(alarm);
    if (t && (!earliest || t < earliest.time)) {
      earliest = { alarm, time: t };
    }
  }
  return earliest?.alarm ?? null;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
