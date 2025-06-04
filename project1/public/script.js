const R = ["锋镝", "物穰", "天倾", "琥珀", "幽邃", "齐颂", "智库", "离弦", "嘉果", "乐纪", "戍御", "渊环", "轮契", "灵钥", "相抗", "蓄息", "俱殁", "开疆", "昼影", "调和", "睿见", "焕影", "溯忆"];
const SR = ["丹恒", "佩拉", "青雀", "玲可", "加拉赫", "阿兰", "桑博", "停云", "桂乃芬", "猞泽", "艾丝妲", "虎克", "驭空", "寒鸦", "三月七", "黑塔", "素裳", "卢卡", "雪衣", "一场术后对话", "记忆中的模样", "猎物的视线", "秘密誓心", "宇宙市场趋势", "天才们的休憩", "诺克静默之后", "天才们的问候", 
"晚安与睡颜", "鼹鼠党欢迎你", "朗道的选择", "别让世界静下来", "点个关注吧！", "铭记于心的约定", "芳华待灼", 
"余生的第一天", "『我』的诞生", "论剑", "此时恰好", "舞！舞！舞！", "两个的演唱会", "黑夜如影随行", 
"唯有沉默", "同一种心情", "与行星相会", "决心如汗珠般闪耀", "在蓝天下", "无边曼舞", "梦的蒙太奇"];
const SSR = ["姬子", "瓦尔特", "布洛妮娅", "杰帕德", "克拉拉", "彦卿", "白露", "希儿", "刃", "符玄"];
const UR = ["风堇"];

// ====== 抽卡统计变量（初始化） ======


let totalPull = 0;    // 总抽卡次数

let countR = 0;       // 已抽到R卡数量
let countSR = 0;      // 已抽到SR卡数量
let countSSR = 0;     // 已抽到SSR卡数量
let countPitySSR = 0; // 保底触发的SSR数量
let countUR = 0;      //抽到UR的次数

// 当前连续未抽中SR/SSR的次数（用于小保底机制）
let pitySR = 0;      // 距离保底SR的计数
let pitySSR = 0;     // 距离保底SSR的计数

// UR保底机制相关
let isPity = false;      // 当前是否处于「保底状态」（上次抽出为SSR）
let isPityCount = 0;     // 当前保底已累积次数（触发三次后必出UR）
let extraAnimation = false;  // 是否触发「特殊动画」（用于UR大保底）

// 是否启用抽卡飞入动画（由开关控制）
let isAnimationEnabled = true;

// 系统时间
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

function updateStats() {
    document.getElementById('pitySSR').textContent = `距上次SSR: ${pitySSR}`;   
    const a = isPity ? "是" : "否";
    document.getElementById('isPitied').textContent = `是否有大保底: ${a}`;  
    document.getElementById('totalPull').textContent = `总抽数: ${totalPull}`;
    document.getElementById('countR').textContent = `R卡数量: ${countR}`;
    document.getElementById('countSR').textContent = `SR卡数量: ${countSR}`;
    document.getElementById('countSSR').textContent = `SSR卡数量: ${countSSR}`;
    document.getElementById('countPitySSR').textContent = `保底数: ${countPitySSR}`;
    document.getElementById('countUR').textContent = `已出货: ${countUR}`;
    if(countSSR != 0){document.getElementById('freqSSR').textContent = `平均${(totalPull/countSSR).toFixed(2)}抽出一只SSR`;}
    if(countSR != 0){document.getElementById('freqSR').textContent = `平均${(totalPull/countSR).toFixed(2)}抽出一只SR`;}
}

function pullCardBanner() {
  pitySR += 1;
  pitySSR += 1;
  totalPull += 1;
  const roll = Math.random();
  const upperRateSSR = pitySSR < 73 ? 0 : (pitySSR -73) * 0.06;

  if (roll < 0.006 + upperRateSSR) {
    pitySR = 0;
    pitySSR = 0;

    //超级大保底
    if (isPityCount == 3 && isPity == false) {
        isPityCount = 0;
        extraAnimation = true;
        countSSR += 1;
        countUR += 1;
        return 'UR';
    }

    //保底决策
    if (Math.random() < 0.5) {
        isPityCount = 0;
        isPity = false;
        countSSR += 1;
        countUR += 1;
        return 'UR';
    } else {
        if(isPity == true){
            isPity = false;
            countSSR += 1;
            countUR += 1;
            countPitySSR += 1;
            return 'UR';
        }
        isPity = true;
        isPityCount += 1;
        countSSR += 1;
        return 'SSR';
    }
  //SR抽取
  } else if (roll < 0.006 + 0.05 || pitySR >= 10) {
    pitySR = 0;
    countSR += 1;
    return 'SR';
  } else {
    countR += 1;
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

  // 清空十连内容 & 清除动画类
  multiBox.innerHTML = '';
  effectBox.classList.remove(
    'rarity-R', 'rarity-SR', 'rarity-SSR', 'rarity-UR', 'extra-animation'
  );

  // 更新文字和显示
  textBox.textContent = `${result.name}`;
  effectBox.style.display = 'flex';

  // 添加飞入动画（刷新）
  effectBox.classList.remove('appear-from-top-right');
  void effectBox.offsetWidth;
  effectBox.classList.add('appear-from-top-right');

  // 添加颜色类
  void effectBox.offsetWidth;
  effectBox.classList.add(`rarity-${result.rarity}`);

  // 添加额外动画（仅 UR）
  if (result.extra) {
    effectBox.classList.add('extra-animation');
    extraAnimation = false;
  }
  updateStats();
}


function handleTenPull() {
  // 隐藏单抽区域
  const effectBox = document.getElementById('effectBox');
  const cardText = document.getElementById('cardText');
  effectBox.style.display = 'none';
  cardText.textContent = '';

  // 获取十连区域容器
  const box = document.getElementById('multiResultBox');

  // 先移除所有旧卡片的 extra-animation 类
  box.querySelectorAll('.effect-border-box').forEach(el => {
    el.classList.remove('extra-animation');
  });

  // 清空整个区域，准备绘制新卡片
  box.innerHTML = '';

  // 生成十张卡片
  for (let i = 0; i < 10; i++) {
    const result = pullCard();
    const rarityClass = `rarity-${result.rarity}`;

    const cardBox = document.createElement('div');
    cardBox.className = 'effect-border-box';
    cardBox.style.height = '100px';
    cardBox.style.width = '100px';

    // 添加 inner 内容
    const inner = document.createElement('div');
    inner.className = 'inner-content';
    inner.textContent = `${result.name}`;
    cardBox.appendChild(inner);
    box.appendChild(cardBox);

    //添加稀有度类
    cardBox.classList.add(`rarity-${result.rarity}`);

    //添加额外动画（炫彩）
    if (result.extra) {
    cardBox.classList.add('extra-animation');
    }

    //延迟一帧添加飞入动画
    requestAnimationFrame(() => {
    cardBox.style.animationDelay = !isAnimationEnabled ? `${i * 0.45}s` : '0s';
    cardBox.classList.add('appear-from-top-right');
    });
    updateStats();
  }
}

/*是否关闭动画*/
const toggle = document.getElementById('toggleSwitch');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('off');
    isAnimationEnabled = !toggle.classList.contains('off');
  });
