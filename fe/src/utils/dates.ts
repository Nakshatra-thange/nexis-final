import {
    formatDistanceToNow,
    format,
    isToday as isTodayFns,
    isYesterday as isYesterdayFns,
    parseISO,
  } from 'date-fns'
  
  /**
   * Safely parses a date string or Date object into a Date
   */
  function toDate(dateInput) {
    if (!dateInput) return new Date()
    if (dateInput instanceof Date) return dateInput
    // date-fns parseISO handles ISO strings; fallback to new Date for others
    try {
      return parseISO(dateInput)
    } catch {
      return new Date(dateInput)
    }
  }
  
  /**
   * Returns relative time string
   * e.g. "2 hours ago", "3 days ago", "about 1 month ago"
   */
  export function formatRelativeTime(dateString) {
    if (!dateString) return ''
    try {
      return formatDistanceToNow(toDate(dateString), { addSuffix: true })
    } catch {
      return ''
    }
  }
  
  /**
   * Returns formatted date + time
   * e.g. "Feb 3, 2024 10:30 AM"
   */
  export function formatDateTime(dateString) {
    if (!dateString) return ''
    try {
      return format(toDate(dateString), 'MMM d, yyyy h:mm a')
    } catch {
      return ''
    }
  }
  
  /**
   * Returns formatted date only
   * e.g. "Feb 3, 2024"
   */
  export function formatDate(dateString) {
    if (!dateString) return ''
    try {
      return format(toDate(dateString), 'MMM d, yyyy')
    } catch {
      return ''
    }
  }
  
  /**
   * Returns true if the date is today
   */
  export function isToday(dateString) {
    if (!dateString) return false
    try {
      return isTodayFns(toDate(dateString))
    } catch {
      return false
    }
  }
  
  /**
   * Returns true if the date is yesterday
   */
  export function isYesterday(dateString) {
    if (!dateString) return false
    try {
      return isYesterdayFns(toDate(dateString))
    } catch {
      return false
    }
  }
  
  /**
   * Returns a human-readable date group label
   * "Today", "Yesterday", or "Feb 3, 2024"
   */
  export function getDateLabel(dateString) {
    if (!dateString) return ''
    if (isToday(dateString)) return 'Today'
    if (isYesterday(dateString)) return 'Yesterday'
    return formatDate(dateString)
  }
  
  /**
   * Returns a MM:SS countdown string from a future ISO datetime
   * Returns "Expired" if the time has already passed
   * Returns "00:00" if the difference is exactly 0
   */
  export function formatCountdown(expiresAt) {
    if (!expiresAt) return 'Expired'
    try {
      const expiryTime = toDate(expiresAt).getTime()
      const now = Date.now()
      const diffMs = expiryTime - now
  
      if (diffMs <= 0) return 'Expired'
  
      const totalSeconds = Math.floor(diffMs / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
  
      // Pad with leading zeros
      const mm = String(minutes).padStart(2, '0')
      const ss = String(seconds).padStart(2, '0')
  
      return `${mm}:${ss}`
    } catch {
      return 'Expired'
    }
  }