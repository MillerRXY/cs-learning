const R = ['100', '200', '300', '400'];
const SR = ['10', '20', '30', '40'];
const SSR = ['1', '2', '3', '4'];
const UR = ['WIN'];

let totalPull = 0, countR = 0, countSR = 0, countSSR = 0, countPitySSR = 0;
let pitySR = 0, pitySSR = 0, isPity = false, isPityCount = 0, extraAnimation = false;

let isAnimationEnabled = true;

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
  pitySR += 1;
  pitySSR += 1;
  const roll = Math.random();
  const upperRateSSR = pitySSR < 73 ? 0 : (pitySSR -73) * 0.06;

  if (roll < 0.006 + upperRateSSR) {
    pitySR = 0;
    pitySSR = 0;

    //超级大保底
    if (isPityCount == 3 && isPity == false) {
        isPityCount = 0;
        extraAnimation = true;
        return 'UR';
    }

    //保底决策
    if (Math.random() < 0.5) {
        isPityCount = 0;
        isPity = false;
        return 'UR';
    } else {
        if(isPity == true){
            isPity = false;
            return 'UR';
        }
        isPity = true;
        isPityCount += 1;
        return 'SSR';
    }
  //SR抽取
  } else if (roll < 0.006 + 0.05 || pitySR >= 10) {
    pitySR = 0;
    return 'SR';
  } else {
    return 'R';
  }
}

function pullCard() {
  const rarity = pullCardBanner();

  let pool;
  switch (rarity) {
    case 'UR': pool = UR; break;
    case 'SSR': pool = SSR; break;
    case 'SR': pool = SR; break;
    case 'R': pool = R; break;
  }

  const name = pool[Math.floor(Math.random() * pool.length)];
  const card =  {
    name,
    rarity,
    extra: extraAnimation
  };

  extraAnimation = false;
  return card;
}

function handleSinglePull() {
  const result = pullCard();

  const effectBox = document.getElementById('effectBox');
  const textBox = document.getElementById('cardText');
  const multiBox = document.getElementById("multiResultBox");

  effectBox.style.display = 'flex'
  textBox.textContent = `抽到了 ${result.rarity}·${result.name}`;

  // 动画添加
  effectBox.classList.remove('appear-from-top-right');
  void effectBox.offsetWidth;
  effectBox.classList.add('appear-from-top-right');
  
  //清空十连
  multiBox.innerHTML = '';

  //更新稀有度颜色
  effectBox.classList.remove('rarity-R', 'rarity-SR', 'rarity-SSR', 'rarity-UR');
  effectBox.classList.add(`rarity-${result.rarity}`);

  if(result.extra){
    effectBox.classList.add('extra-animation');
    extraAnimation = false;
  }
}


function handleTenPull() {
  //隐藏单抽区域
  const effectBox = document.getElementById('effectBox');
  const cardText = document.getElementById('cardText');
  effectBox.style.display = 'none';
  cardText.textContent = '';

  //清空十连显示区域
  const box = document.getElementById('multiResultBox');
  box.innerHTML = '';

  //添加 10 张卡片
  for (let i = 0; i < 10; i++) {
    const result = pullCard();
    const rarityClass = `rarity-${result.rarity}`;

    const cardBox = document.createElement('div');
    cardBox.className = `effect-border-box ${rarityClass}`;
    cardBox.style.height = '100px'; // 可调
    cardBox.style.width = '100px';

    const inner = document.createElement('div');
    inner.className = 'inner-content';
    inner.textContent = `${result.rarity}·${result.name}`;

    cardBox.appendChild(inner);
    box.appendChild(cardBox);

      // 强制重排 + 添加动画类
    void cardBox.offsetWidth;
    const delay = isAnimationEnabled ? i * 0 : i* 0.45;
    cardBox.style.animationDelay = `${delay}s`;
    cardBox.classList.add('appear-from-top-right');

    cardBox.classList.add(`rarity-${result.rarity}`);
    if (result.extra) {
        cardBox.classList.add('extra-animation');
    }
    }
}

const toggle = document.getElementById('toggleSwitch');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('off');
    isAnimationEnabled = !toggle.classList.contains('off');
  });
