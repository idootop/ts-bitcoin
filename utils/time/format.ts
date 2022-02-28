import { defaults, padLeft } from '..';
import { LDate, now, toDate } from '.';

type PadItems = 'M' | 'd' | 'h' | 'm' | 's';

interface DateTimeFormatOptions {
  weekdays: string[];
  weekPrefix: '周' | '星期' | string;
  am: 'A' | 'AM' | 'a' | 'am' | '上午' | string;
  pm: 'P' | 'PM' | 'p' | 'pm' | '下午' | string;
  noPads: PadItems[];
}

const defaultOptions: DateTimeFormatOptions = {
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  weekPrefix: '周',
  am: 'AM',
  pm: 'PM',
  noPads: [],
};

/**
 * 格式化时间
 *
 * yyyy年MM月dd日 ww HH:mm tt
 *
 * 2022年01月01日 周一 12:00 AM
 */
export const formatDateTime = (
  date: LDate = now(),
  formatStr = 'yyyy年MM月dd日 ww HH:mm tt',
  options?: Partial<DateTimeFormatOptions>,
) => {
  const d = toDate(date);
  const opts = defaults(options, defaultOptions);
  const pad = (v: number, type: PadItems) => (opts.noPads.includes(type) ? v : padLeft(v));
  const time: any = {
    yyyy: d.getFullYear(),
    yy: padLeft(d.getFullYear() % 100),
    MM: pad(d.getMonth() + 1, 'M'),
    dd: pad(d.getDate(), 'd'),
    HH: pad(d.getHours() % 12 || 12, 'h'),
    hh: pad(d.getHours(), 'h'),
    mm: pad(d.getMinutes(), 'm'),
    ss: pad(d.getSeconds(), 's'),
    ww: `${opts.weekPrefix}${opts.weekdays[d.getDay()]}`,
    tt: d.getHours() < 12 ? opts.am : opts.pm,
  };
  return formatStr.replace(new RegExp(`${Object.keys(time).join('|')}`, 'g'), (subStr: string) => {
    return time[subStr] || '';
  });
};

export const formatDuration = (ms: number, split = ', ') => {
  ms = Math.abs(ms);
  const zhTime: any = {
    day: '天',
    hour: '小时',
    minute: '分钟',
    second: '秒',
    millisecond: '毫秒',
  };
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${zhTime[key]}`)
    .join(split);
};
