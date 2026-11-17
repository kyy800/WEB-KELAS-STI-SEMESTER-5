const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
});

const longDateFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
});

export function formatDate(value) {
    if (!value) return '-';
    return dateFormatter.format(new Date(value));
}

export function formatDateTime(value) {
    if (!value) return '-';
    return dateTimeFormatter.format(new Date(value)).replace('.', ':');
}

export function formatLongDate(value = new Date()) {
    return longDateFormatter.format(new Date(value));
}

export function formatTime(value) {
    if (!value) return '-';
    return value.slice(0, 5).replace(':', '.');
}

export function toTimeInput(value) {
    if (!value) return '';
    return String(value).slice(0, 5);
}

export function toDateTimeInput(value) {
    if (!value) return '';

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date(value));

    const get = (type) => parts.find((part) => part.type === type)?.value ?? '00';

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export function categoryLabel(category) {
    return {
        akademik: 'Akademik',
        kegiatan: 'Kegiatan',
        umum: 'Umum',
    }[category] ?? 'Umum';
}

export function categoryTone(category) {
    return {
        akademik: 'indigo',
        kegiatan: 'emerald',
        umum: 'slate',
    }[category] ?? 'slate';
}

export function roleLabel(role) {
    return role === 'admin' ? 'Admin' : 'Anggota';
}

export function deadlineInfo(dueAt, completed = false) {
    if (completed) {
        return { label: 'Selesai', tone: 'emerald', days: null };
    }

    if (!dueAt) {
        return { label: 'Tanpa deadline', tone: 'slate', days: null };
    }

    const diff = new Date(dueAt).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);

    if (diff < 0) {
        return { label: 'Lewat deadline', tone: 'rose', days };
    }

    if (days <= 1) {
        return { label: 'H-1', tone: 'amber', days };
    }

    if (days <= 3) {
        return { label: 'H-3', tone: 'yellow', days };
    }

    return { label: 'Aktif', tone: 'slate', days };
}

export function excerpt(text = '', length = 160) {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > length ? `${clean.slice(0, length)}…` : clean;
}

export function fileSize(bytes) {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = Number(bytes);
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index += 1;
    }
    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
