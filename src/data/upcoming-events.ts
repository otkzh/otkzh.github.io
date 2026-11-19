// Activity面「次の予定」に載せるイベント。
// 終了時刻（end）を過ぎたイベントは、ビルド時に除外し、閲覧時にもブラウザ側で隠す。
// 追い方と更新手順は docs/technical-tips.md の「Activityの次の予定」を参照。

export type UpcomingEvent = {
  /** 主催・関わっている団体名 */
  organizer: string
  /** イベント名。配列の区切りで折り返す */
  title: string[]
  /** 開始・終了日時（日本時間のISO 8601、+09:00付き） */
  start: string
  end: string
  /** 会場や参加条件を短く。「 · 」でつなぎ、区切りで折り返す */
  place: string[]
  /** 詳細・申し込みページ */
  url: string
  /** リンク先を示す短い文言 */
  linkLabel: string
  /** 確認した情報源と確認日（表示しない） */
  source: string
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    organizer: 'シビックテックさいたま',
    title: ['ちいさなデジタル相談室'],
    start: '2026-11-30T18:30:00+09:00',
    end: '2026-11-30T20:00:00+09:00',
    place: ['浦和パルコ9階', '参加無料・予約不要'],
    url: 'https://www.facebook.com/events/1730169768672040/',
    linkLabel: '詳細・Facebook',
    source:
      '公式WebのNewsと告知画像 /images/261130-small-digital-consult.webp（2026-11-19確認）',
  },
  {
    organizer: 'りっかRIKA',
    title: ['ゆんたく会 #6', '「AIとの付き合い方」'],
    start: '2026-12-06T14:00:00+09:00',
    end: '2026-12-06T16:00:00+09:00',
    place: ['沖縄市・りっかRIKA LAB', '中学生以上'],
    url: 'https://riccarika-yuntaku-06.peatix.com/',
    linkLabel: '詳細・申し込み・Peatix',
    source: '公式Web「りっかRIKAゆんたく会（11月、12月のお知らせ）」とPeatix（2026-11-19確認）',
  },
]

// 実行環境のICUによって「11/30」「11月30日」と表記が揺れるため、部品から組み立てる。
const tokyoParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''
  return {
    month: part('month'),
    day: part('day'),
    weekday: part('weekday'),
    time: `${part('hour')}:${part('minute')}`,
  }
}

/** 例: 11月30日（月）18:30〜20:00 */
export const formatEventSchedule = (event: UpcomingEvent) => {
  const start = tokyoParts(new Date(event.start))
  const end = tokyoParts(new Date(event.end))
  return `${start.month}月${start.day}日（${start.weekday}）${start.time}〜${end.time}`
}

/** ビルド時点で終わっていないイベントを開始順に返す */
export const getUpcomingEvents = (now = new Date()) =>
  upcomingEvents
    .filter((event) => new Date(event.end).getTime() > now.getTime())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
