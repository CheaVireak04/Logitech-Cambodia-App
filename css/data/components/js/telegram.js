export const tg = window.Telegram.WebApp;

export function initTelegram() {
    tg.expand();
    tg.ready();
    
    // Set Header color to match dark theme
    tg.setHeaderColor('#121212');
}

export function hapticImpact(style = 'light') {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
    }
}

export function hapticNotification(type = 'success') {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
    }
}