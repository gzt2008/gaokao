// 倒计时目标日期（2026年6月7日09:00）
const targetDate = new Date('2026-06-07T09:00:00');

// 励志语句库
const motivationalQuotes = [
    "每一滴汗水，都会在六月绽放光芒。",
    "坚持是成功的垫脚石，高考加油！",
    "此刻打盹，你将做梦；此刻学习，你将圆梦。",
    "不为模糊不清的未来担忧，只为清清楚楚的现在努力。",
    "高考倒计时，分秒必争。",
    "你若有一个不屈的灵魂，脚下就会有一片坚实的土地。",
    "没有等来的辉煌，只有拼来的精彩。",
    "乾坤未定，你我皆是黑马。"
];

// 获取CSS变量操作权限
const root = document.documentElement;

// 获取DOM元素
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
    totalDays: document.getElementById('totalDays'),
    motivation: document.getElementById('motivation')
};

// 计算剩余时间
function calculateTimeRemaining() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            totalDays: 0
        };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const milliseconds = Math.floor((diff % 1000) / 100);
    
    // 计算总天数（用于悬浮提示）
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return { days, hours, minutes, seconds, milliseconds, totalDays };
}

// 更新倒计时显示
function updateCountdown() {
    const { days, hours, minutes, seconds, milliseconds, totalDays } = calculateTimeRemaining();
    
    // 更新实时倒计时
    countdownElements.days.textContent = days;
    countdownElements.hours.textContent = hours;
    countdownElements.minutes.textContent = minutes;
    countdownElements.seconds.textContent = seconds;
    countdownElements.milliseconds.textContent = milliseconds;
    
    // 动态调整渐变强度（根据剩余天数）
    const opacity = Math.max(0.3, totalDays / 100); // 最小透明度0.3
    root.style.setProperty('--gradient-opacity', opacity.toFixed(2));
    
    // 更新悬浮提示
    if (countdownElements.totalDays) {
        countdownElements.totalDays.textContent = totalDays;
    }
}

// 显示每日励志语句
function displayMotivationalQuote() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('lastQuoteDate');
    let quoteIndex = 0;
    
    if (storedDate === today) {
        quoteIndex = parseInt(localStorage.getItem('quoteIndex')) || 0;
    } else {
        quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
        localStorage.setItem('lastQuoteDate', today);
        localStorage.setItem('quoteIndex', quoteIndex);
    }
    
    countdownElements.motivation.textContent = motivationalQuotes[quoteIndex];
}

// 初始化倒计时
function initCountdown() {
    updateCountdown();
    displayMotivationalQuote();
    
    // 每秒更新倒计时
    setInterval(() => {
        updateCountdown();
    }, 100);
    
    // 每日更新励志语句
    setInterval(() => {
        displayMotivationalQuote();
    }, 1000 * 60 * 60 * 24);
}

// 注册Service Worker实现离线访问
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// 初始化应用
initCountdown();