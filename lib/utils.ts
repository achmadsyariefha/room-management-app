export function toUTC8ISOString(dateString: string, timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const utcDate = new Date(dateString);
    utcDate.setHours(hours, minutes, 0, 0);

    const utc8 = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000 + 8 * 3600000);
    return utc8.toISOString();
}

export function formatToLocalDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Singapore', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}