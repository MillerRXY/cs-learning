const R = ['100', '200', '300', '400'];
const SR = ['10', '20', '30', '40'];
const SSR = ['1', '2', '3', '4']

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  document.getElementById('clock').textContent = `现在的时间是：${timeString}`;
}
setInterval(updateTime, 1000);
updateTime();


function pullCardBanner() {
  const roll = Math.random();

  if (roll < 0.006) {
    return 'SSR';
  } else if (roll < 0.006 + 0.05) {
    return 'SR';
  } else {
    return 'R';
  }
}

function pullCard() {
  const rarity = pullCardBanner();

  let pool;
  switch (rarity) {
    case 'SSR': pool = SSR; break;
    case 'SR': pool = SR; break;
    case 'R': pool = R; break;
  }

  const name = pool[Math.floor(Math.random() * pool.length)];
  return {
    name,
    rarity
  };
}

function handleSinglePull() {
  const result = pullCard();

  const effectBox = document.getElementById('effectBox');
  const textBox = document.getElementById('cardText');

  // 清空十连
  document.getElementById('multiResultBox').innerHTML = '';

  // 恢复显示
  effectBox.style.display = 'flex';

  textBox.textContent = `抽到了 ${result.rarity}·${result.name}`;
  effectBox.classList.remove('rarity-R', 'rarity-SR', 'rarity-SSR');
  effectBox.classList.add(`rarity-${result.rarity}`);
}


function handleTenPull() {
  const box = document.getElementById('multiResultBox');
  box.innerHTML = '';

  // 隐藏单抽框
  const effectBox = document.getElementById('effectBox');
  effectBox.style.display = 'none';

  for (let i = 0; i < 10; i++) {
    const result = pullCard();
    const cardBox = document.createElement('div');
    cardBox.className = `effect-border-box rarity-${result.rarity}`;

    const inner = document.createElement('div');
    inner.className = 'inner-content';
    inner.textContent = `${result.rarity}·${result.name}`;

    cardBox.appendChild(inner);
    box.appendChild(cardBox);
  }
}
