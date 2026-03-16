// Safely exports Telegram API, preventing crashes if tested outside Telegram
const tg = window.Telegram?.WebApp || {
    expand: () => console.log('Mock: tg.expand()'),
    ready: () => console.log('Mock: tg.ready()'),
    setHeaderColor: () => {},
    close: () => console.log('Mock: tg.close()'),
    sendData: (data) => console.log('Mock: tg.sendData()', data),
    MainButton: {
        show: () => {}, hide: () => {}, setText: () => {}, onClick: () => {}, offClick: () => {}
    },
    BackButton: {
        show: () => {}, hide: () => {}, onClick: () => {}, offClick: () => {}
    },
    HapticFeedback: {
        impactOccurred: () => {}, notificationOccurred: () => {}
    }
};

export default tg;