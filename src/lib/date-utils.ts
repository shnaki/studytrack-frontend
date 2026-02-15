/**
 * Date を YYYY-MM-DD 文字列に変換
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * YYYY-MM-DD 文字列をタイムゾーン問題を回避してパース
 */
function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`)
}

/**
 * 指定日を含む週の月曜日を YYYY-MM-DD で返す
 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  // 日曜(0)は前週の月曜に、それ以外は今週の月曜に
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return formatDate(d)
}

/**
 * 日付文字列に日数を加減算
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

/**
 * 「2024/01/01 〜 2024/01/07」形式で表示
 */
export function formatWeekRange(weekStart: string): string {
  const start = parseDate(weekStart)
  const end = parseDate(addDays(weekStart, 6))

  const fmt = (d: Date) =>
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`

  return `${fmt(start)} 〜 ${fmt(end)}`
}
