// ===================================================================================
// 0. 儲存與帳號管理
// ===================================================================================
const FGO_STORAGE = "FGO_Storage_4S";
const ACCOUNT_KEY = "FGO_Account_4S";

function toggleAccount() {
    const currentAccount = localStorage.getItem(ACCOUNT_KEY) || "account1";
    const newAccount = currentAccount === "account1" ? "account2" : "account1";
    localStorage.setItem(ACCOUNT_KEY, newAccount);
    console.log(`Account switched to: ${newAccount}`);
}
function getCurrentAccount() { return localStorage.getItem(ACCOUNT_KEY) || "account1"; }
function getData(name) { const acc = getCurrentAccount(); const item = localStorage.getItem(`${name}_${acc}`); return item ? JSON.parse(item) : []; }
function setData(name, content) { const acc = getCurrentAccount(); if (content) localStorage.setItem(`${name}_${acc}`, JSON.stringify(content)); }
function deleteData(name) { const acc = getCurrentAccount(); localStorage.removeItem(`${name}_${acc}`); }

function updateData(units) {
  if (!units) return;
  const newData = units.flat(2).filter(x => x);
  const currentData = getData(FGO_STORAGE);
  const storageMap = new Map();
  currentData.forEach(unit => { if (unit.no) storageMap.set(unit.no, unit); });
  newData.forEach(unit => {
      if (unit.no) {
          if (unit.npLv > 0 || unit.mark > 0) storageMap.set(String(unit.no), { npLv: unit.npLv, mark: unit.mark, no: String(unit.no) });
          else storageMap.delete(String(unit.no));
      }
  });
  setData(FGO_STORAGE, Array.from(storageMap.values()));
}

// 遷移舊版 fgoStorage.js 的資料，只在需要時執行
function migrateOldData() {
    const oldDataKey = "FGO_Storage_4S"; // 舊的五星版本鍵值，這裡可能需要確認是否真的要從五星遷移
    const oldData = localStorage.getItem(oldDataKey);
    // 確保只在四星帳號1為空，且舊資料存在時遷移
    if (oldData && !localStorage.getItem(`${FGO_STORAGE}_account1`)) {
        localStorage.setItem(`${FGO_STORAGE}_account1`, oldData);
        console.log("舊資料已成功遷移到四星版本的帳號1");
    }
}


// ===================================================================================
// 1. 全域變數與資料定義
// ===================================================================================
var canvas, context;
var CELL_SIZE = 50, caculateField = 70, row_padding = 30, col_padding = 20;
var marginTop = 10, marginLeft = 10;
const FOOTER_HEIGHT = 50;
var country = localStorage.getItem("r4_country") || "tw";
var currentLang = getLanguage();
var mode = 0, luckyBag = 0;
var CategoryNum;
var bgcolor = "rgb(176, 176, 176)", mask = "rgb(0, 0, 0, 0.6)", font_color = "rgb(0, 0, 0)";
var init_npLv = 5, npLv = init_npLv;

const Category = ['saber', 'archer', 'lancer', 'rider', 'caster', 'assassin', 'berserker', 'ruler', 'avenger', 'alterego', 'foreigner', 'mooncancer', 'pretender'];
const CategoryLen = Category.length;
const Marks = ['hiclipart', 'heart'];

const servents = {
	'saber': [3, 4, 5, 6, 10, 101, 121, 123, 138, 165, 176, 187, 221, 223, 227, 245, 264, 290, 293, 298, 301, 310, 344, 354, 363, 379, 405, 434],
	'archer': [11, 14, 69, 122, 131, 137, 157, 180, 184, 197, 200, 207, 248, 262, 269, 271, 286, 311, 318, 325, 391, 399],
	'lancer': [18, 78, 87, 102, 134, 140, 141, 146, 181, 183, 193, 214, 217, 228, 252, 266, 279, 283, 288, 313, 347, 419, 428, 439, 449, 455],
	'rider': [29, 30, 66, 73, 94, 115, 132, 182, 211, 263, 291, 315, 322, 326, 332, 366, 387, 401, 446],
	'caster': [61, 67, 74, 100, 103, 111, 120, 130, 145, 192, 194, 208, 225, 236, 319, 330, 340, 358, 404],
	'assassin': [41, 46, 92, 109, 133, 159, 170, 177, 185, 188, 218, 230, 243, 267, 304, 359, 360, 361, 378, 408],
	'berserker': [47, 48, 58, 82, 89, 116, 162, 171, 178, 202, 219, 282, 287, 323, 345, 382, 398, 414, 447],
	'ruler': [135, 233, 242, 320, 364],
	'avenger': [147, 158, 328, 356, 388, 420, 454],
	'alterego': [164, 190, 191, 338, 451],
	'foreigner': [222, 308, 389, 423],
	'mooncancer': [166, 422, 424, 425],
	'pretender': [335, 367, 372, 392, 410, 430]
};
const z_servants = {
    saber:[3, 123, 6, 10, 165, 223, 5, 310, 187, 101, 245, 121, 227, 298],
    archer:[248, 14, 11, 157, 207, 325, 184, 122, 311],
    lancer:[78, 140, 18, 279, 228, 193, 313, 183, 87, 146, 102, 214],
    rider:[94, 66, 332, 29, 30],
    caster:[100, 145, 192, 194, 103, 74, 120, 67],
    assassin:[109, 159, 46, 188, 230, 41, 170, 185],
    berserker:[202, 116, 58, 82, 89, 47, 171, 48],
    ruler:[242],
    avenger:[147, 158],
    pretender:[335]
};
const z2_servants = {
	saber:[6, 10, 165, 223, 101, 245, 121, 227, 344, 298, 3, 123, 5, 310, 187, 354, 293, 221, 290, 176, 363],
	archer:[14, 11, 207, 325, 184, 248, 157, 122, 311, 200, 318, 131, 286, 180, 262, 269],
	lancer:[140, 18, 228, 193, 313, 183, 87, 146, 214, 78, 279, 347, 102, 217, 134, 266, 181],
	rider:[94, 66, 366, 332, 29, 30, 263, 322, 291, 132],
	caster:[100, 145, 192, 74, 120, 194, 103, 67, 319, 340, 358, 130, 236],
	assassin:[109, 159, 46, 41, 170, 185, 188, 230, 218, 267, 177],
	berserker:[202, 116, 58, 82, 89, 47, 171, 48, 345, 178, 282, 323, 287],
	ruler:[242, 135],
	avenger:[158, 147, 356],
	alterego:[164],
	foreigner:[222],
	pretender:[335]
};

const FGO_DATA = {
    'jp': {servants: servents, type: 'full', isReleased: true, labelKey: 'jp_label'},
	// 台服數量增加變動                                                              [劍, 弓, 槍, 騎, 術, 殺, 狂, 裁, 仇, 丑, 外, 月, 偽, 獸, 非獸, 盾]
    'tw': {servants: servents, type: 'full', isReleased: true, categoryNumOverride: [26, 22, 21, 17, 18, 19, 17, 5, 5, 4, 3, 1, 4], labelKey: 'tw_label'},
    'z': {servants: z_servants, type: 'partial', isReleased: false, categoryNumOverride: [14, 9, 12, 5, 8, 8, 8, 1, 2, 0, 0, 0, 1], labelKey: 'z_label'},
    'z2': {servants: z2_servants, type: 'partial', isReleased: true, categoryNumOverride: [21, 16, 17, 10, 13, 11, 13, 2, 3, 1, 1, 0, 1], labelKey: 'z2_label'},
};


// ===================================================================================
// 2. 核心邏輯區 (Core Logic)
// ===================================================================================

var units = [], allModeButtons = [];

const ImagePreloader = {
    images: {},
    totalImages: 0,
    loadedImages: 0,
    init(callback) {
        const allServantNos = new Set();
        Object.values(FGO_DATA).forEach(data => {
            Object.values(data.servants).flat().forEach(no => allServantNos.add(no));
        });

        this.totalImages = allServantNos.size;
        if (this.totalImages === 0) {
            callback();
            return;
        }

        const loadingText = i18n.loadingImages[currentLang];
        this.updateProgress(loadingText);

        allServantNos.forEach(no => {
            const img = new Image();
            img.src = `images/servents/${no}.png`;
            this.images[no] = img;
            img.onload = img.onerror = () => {
                this.loadedImages++;
                this.updateProgress(loadingText);
                if (this.loadedImages === this.totalImages) {
                    callback();
                }
            };
        });
    },
    updateProgress(loadingText) {
        const percentage = Math.round((this.loadedImages / this.totalImages) * 100);
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = font_color;
        context.font = getFontString(30);
        context.textAlign = "center";
        context.fillText(`${loadingText}${percentage}%`, canvas.width / 2, canvas.height / 2);
        context.textAlign = "start";
    }
};


function getUnit(country) {
    const currentData = FGO_DATA[country];
    if (!currentData) { alert("錯誤的資料代碼：" + country); return []; }
    const sourceServants = currentData.servants;
    CategoryNum = Category.map((className, index) => {
        if (currentData.categoryNumOverride) {
            return currentData.categoryNumOverride[index] || 0;
        }
        return sourceServants[className] ? sourceServants[className].length : 0;
    });

    let newUnits = [];
    for (let i = 0; i < CategoryLen; i++) {
        const className = Category[i];
        newUnits[i] = [];
        if (sourceServants[className] && CategoryNum[i] > 0) {
            for (let j = 0; j < CategoryNum[i]; j++) {
                const no = sourceServants[className][j];
                const unitInstance = {
                    no: no,
                    image: ImagePreloader.images[no],
                    npLv: 0,
                    mark: 0,
                };
                newUnits[i][j] = unitInstance;
            }
        }
    }
    return newUnits;
}

window.onload = function() {
    preloadStaticImages(() => {
        ImagePreloader.init(() => {
            mainLogic();
        });
    });
};

function mainLogic(state = 0){
    const currentCountryData = FGO_DATA[country];
    if (!currentCountryData || !currentCountryData.isReleased) {
        country = 'tw'; // 預設回台服
        localStorage.setItem("r4_country", 'tw');
    }

    units = getUnit(country);
    if (!units) return;
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    if (state === 0) {
        migrateOldData();
        Object.keys(FGO_DATA).forEach(modeKey => {
            const button = document.getElementById(`${modeKey}-button`);
            if (button) {
                allModeButtons.push(button);
                button.onclick = () => { if (country !== modeKey) { country = modeKey; localStorage.setItem("r4_country", country); mainLogic(1); } };
            }
        });
        bindActionButtons();
        canvas.onclick = onCanvasClick;
        canvas.addEventListener('contextmenu', e => { e.preventDefault(); rightClick(e); });
    }

    const currentActiveButton = document.getElementById(`${country}-button`);
    if (currentActiveButton) Checked(allModeButtons, currentActiveButton);

    const iconWidth = luckyBag ? (Math.max.apply(null,CategoryNum) + 1) * (CELL_SIZE + col_padding) + caculateField : (Math.max.apply(null,CategoryNum) + 1) * (CELL_SIZE + col_padding);
    const MIN_CANVAS_WIDTH = 850;
    canvas.width = Math.max(iconWidth, MIN_CANVAS_WIDTH);
    canvas.height = Category.length * (CELL_SIZE + row_padding) + marginTop + FOOTER_HEIGHT;

    applyLanguage(currentLang);
    drawCanvas();
}

function drawCanvas() {
    context.fillStyle = bgcolor;
	context.fillRect (0, 0, canvas.width, canvas.height);
    updateUnitsNPLevel(units);

    let pass = 0;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            const yPos = i - pass;
            drawImage(0, yPos, categoryImages[i]);
            for (let j = 0; j < CategoryNum[i]; j++) {
                const unit = units[i][j];
                drawImage(j + 1, yPos, unit.image);
                if (!unit.npLv) fillRect(j, yPos, mask);
                else fillNPText(j, yPos, `${i18n.npLevelPrefix[currentLang]}${unit.npLv}`);
                if (unit.mark) drawImage(j + 1, yPos, markImages[unit.mark - 1]);
            }
        } else {
            pass++;
        }
    }
    fillTotalText();
    if (luckyBag) fillCaculate();
    context.font = getFontString(20);
	context.fillStyle = mask;
	context.fillText("This image was made by mgneko, maintained by LeafLu @ ptt", marginLeft, canvas.height - 15);
}

function bindActionButtons() {
    document.getElementById('switch-account-btn').onclick = switchAccount;
    document.getElementById('set-button').onclick = () => { mode = 0; document.getElementById('set-button').classList.replace("btn--primary", "btn--checked"); document.getElementById('mask-button').classList.replace("btn--checked", "btn--primary"); };
    document.getElementById('mask-button').onclick = () => { mode = 1; document.getElementById('mask-button').classList.replace("btn--primary", "btn--checked"); document.getElementById('set-button').classList.replace("btn--checked", "btn--primary"); };
    document.getElementById('luckyBag-button').onclick = () => { luckyBag = !luckyBag; if(luckyBag){ document.getElementById('luckyBag-button').classList.replace("btn--primary", "btn--checked"); marginLeft += caculateField; } else { document.getElementById('luckyBag-button').classList.replace("btn--checked", "btn--primary"); marginLeft -= caculateField; } mainLogic(2); };
    document.getElementById('reset').onclick = () => { if (confirm(i18n.confirmClearAll[currentLang])) { deleteData(FGO_STORAGE); localStorage.setItem("r4_country", country); location.reload(); } };
    document.getElementById('reset-mark').onclick = () => { if (confirm(i18n.confirmResetMark[currentLang])) { let data = getData(FGO_STORAGE); data.forEach(u => u.mark = 0); setData(FGO_STORAGE, data.filter(u => u.npLv > 0)); location.reload(); } };
    document.getElementById('breakthrough').onclick = () => { npLv = (npLv === init_npLv) ? 20 : init_npLv; alert(`${i18n.alertNpLimit[currentLang]}${npLv}`); };
    document.getElementById('open-image-btn').onclick = openImage;
    const importFile = document.getElementById('import-file');
    document.getElementById('import-button').onclick = () => importFile.click();
    document.getElementById('export-button').onclick = exportData;
    importFile.onchange = importData;
}

// ===================================================================================
// 3. 輔助與繪圖函式區
// ===================================================================================
function getFontString(size = 20) {
    switch (currentLang) {
        case 'ja': return `${size}px -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', 'Yu Gothic Medium', 'メイリオ', Meiryo, sans-serif`;
        case 'en': return `${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
        case 'zh-TW': default: return `${size}px -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Microsoft JhengHei', '微軟正黑體', sans-serif`;
    }
}

function switchAccount() {
    toggleAccount();
    location.reload(); // 重新載入以應用新帳號資料
}

function updateUnitsNPLevel(units) {
  const fgoStorage = getData(FGO_STORAGE);
  const storageMap = new Map();
  fgoStorage.forEach(unit => storageMap.set(String(unit.no), unit));

  units.flat().forEach(unit => {
      if(unit) {
          const saved = storageMap.get(String(unit.no));
          if (saved) {
              unit.npLv = saved.npLv;
              unit.mark = saved.mark;
          } else {
              unit.npLv = 0;
              unit.mark = 0;
          }
      }
  });
}

var categoryImages = [], markImages = [];
function preloadStaticImages(callback) {
    const classIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,99];
    let loadedCount = 0;
    const total = classIds.length + Marks.length;
    const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === total) callback();
    };
    classIds.forEach((id, i) => {
        categoryImages[i] = new Image();
        categoryImages[i].src = `images/class/class_${id}.png`;
        categoryImages[i].onload = onImageLoad;
        categoryImages[i].onerror = onImageLoad;
    });
    Marks.forEach((mark, i) => {
        markImages[i] = new Image();
        markImages[i].src = `images/mark/${mark}.png`;
        markImages[i].onload = onImageLoad;
        markImages[i].onerror = onImageLoad;
    });
}

function Checked(btns, ckbtn){
	btns.forEach(btn => { if (btn === ckbtn) { btn.classList.remove('btn--primary'); btn.classList.add('btn--checked'); }
						  else { btn.classList.remove('btn--checked'); btn.classList.add('btn--primary'); } });
}

function drawImage(x, y, image){
    const xPos = x * (CELL_SIZE + col_padding) + marginLeft, yPos = y * (CELL_SIZE + row_padding) + marginTop;
	if(image && image.complete && image.naturalHeight !== 0){
		try{ context.drawImage(image, xPos, yPos, CELL_SIZE, CELL_SIZE); }
        catch(e) { console.error("圖片繪製失敗:", image.src, e); drawPlaceholder(xPos, yPos); }
	} else {
        drawPlaceholder(xPos, yPos);
	}
}

function drawPlaceholder(xPos, yPos) {
    context.fillStyle = '#AAA'; context.fillRect(xPos, yPos, CELL_SIZE, CELL_SIZE);
    context.fillStyle = '#FFF'; context.font = `bold ${CELL_SIZE * 0.6}px Arial`; context.textAlign = "center"; context.textBaseline = "middle";
    context.fillText("?", xPos + CELL_SIZE / 2, yPos + CELL_SIZE / 2);
    context.textAlign = "start"; context.textBaseline = "alphabetic";
}

function fillCaculate(){
	context.font = getFontString(12);
	var have = 0, haveFull = 0, like = 0, percent = 0, ex = 0;
	var lucky_bag = (country != 'jp' && country != 'tw');
	var default_cat1 = lucky_bag ? CategoryLen : 7;
    var default_cat2 = lucky_bag ? CategoryLen : 6;
	context.fillStyle = bgcolor; context.fillRect(0, 0, caculateField + 10, canvas.height); context.fillStyle = font_color;
    let pass = 0;
	for(var category = 0; category < CategoryLen; category++){
        if (CategoryNum[category] === 0) { pass++; continue; }
		if (category <= default_cat1) have = 0, haveFull = 0, like = 0;
		for(var attribute = 0; attribute < CategoryNum[category]; attribute++){
			if (units[category][attribute].npLv){ have++; if(units[category][attribute].npLv >= 5) haveFull++; }
			if (units[category][attribute].mark == 2) like++;
		}
		if (category <= default_cat2){
			if(attribute>0){
                const yPos = marginTop + (category - pass) * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
                context.textBaseline = 'middle';
				percent = ((1 - (have / attribute)) * 100);
				context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
				percent = (haveFull / units[category].length * 100);
				context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
				percent = (like / units[category].length * 100);
				context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
                context.textBaseline = 'alphabetic';
			}
		} else { ex += units[category].length; }
	}
	if(!lucky_bag && ex > 0){
        const yPos = marginTop + 7 * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
        context.textBaseline = 'middle';
		percent = ((1 - (have / ex)) * 100);
		context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
		percent = (haveFull / ex * 100);
		context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
		percent = (like / ex * 100);
		context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
        context.textBaseline = 'alphabetic';
	}
}

function fillRect(x, y, color){ context.fillStyle = color; context.fillRect ((x + 1) * (CELL_SIZE + col_padding) + marginLeft, y * (CELL_SIZE + row_padding) + marginTop, CELL_SIZE, CELL_SIZE); }
function fillTextMask(x, y, color){ context.fillStyle = color; context.fillRect(x * (CELL_SIZE + col_padding) + marginLeft, (y + 1) * (CELL_SIZE + row_padding) - row_padding  + marginTop, CELL_SIZE, row_padding); }

function fillNPText(x, y, msg) {
    context.font = getFontString(20);
    let number = msg.match(/\d+/)[0];
    context.fillStyle = (number == 5) ? "rgb(255, 255, 0)" : (number >= 6) ? "rgb(255, 0, 0)" : font_color;
    context.textBaseline = 'top';
    const textWidth = context.measureText(msg).width;
    const xPos = (x + 1) * (CELL_SIZE + col_padding) + marginLeft + (CELL_SIZE - textWidth) / 2;
    const yPos = y * (CELL_SIZE + row_padding) + marginTop + CELL_SIZE + 5;
    context.fillText(msg, xPos, yPos);
    context.textBaseline = 'alphabetic';
}

function fillTotalText() {
    context.font = getFontString(18);
    var totalHave = 0, totalNP = 0, total = 0;
    units.flat().forEach(unit => {
        if(unit) {
            totalNP += unit.npLv;
            if (unit.npLv > 0) totalHave++;
        }
    });
    total = CategoryNum.reduce((a, b) => a + b, 0);
    var percent = total > 0 ? (totalHave / total) * 100 : 0;

    const boxWidth = 220;
    const boxHeight = 85;
    const boxX = canvas.width - boxWidth - 10;
    const boxY = canvas.height - boxHeight - 40;
    context.fillStyle = bgcolor;
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    context.textAlign = 'left';
    context.fillStyle = font_color;
    const xPos = boxX + 10;
    context.fillText(`${i18n.totalOwned[currentLang]}: ${totalHave}/${total}`, xPos, boxY + 10);
    context.fillText(`${i18n.ownedRate[currentLang]}: ${percent.toFixed(2)}%`, xPos, boxY + 35);
    context.fillText(`${i18n.totalNPLevel[currentLang]}: ${totalNP}`, xPos, boxY + 60);
    context.textAlign = 'start';
}

function getCoordinates(e){ const rect = e.target.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return {'x': (e.clientX - rect.left) * scaleX, 'y': (e.clientY - rect.top) * scaleY}; }
function getCategory(y){ return Math.floor((y - marginTop) / (CELL_SIZE + row_padding)); }
function getAttribute(x){ return Math.floor((x - marginLeft) / (CELL_SIZE + col_padding)); }

function handleUnitInteraction(event, isRightClick = false) {
    const point = getCoordinates(event);
    let categoryIndex = getCategory(point.y), attributeIndex = getAttribute(point.x);
    let visibleCategoryIndex = 0, actualCategoryIndex = -1;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            if (visibleCategoryIndex === categoryIndex) { actualCategoryIndex = i; break; }
            visibleCategoryIndex++;
        }
    }
    if (actualCategoryIndex === -1) return;
    categoryIndex = actualCategoryIndex;
    const xInCell = point.x - (attributeIndex * (CELL_SIZE + col_padding) + marginLeft);
    const yInCell = point.y - (getCategory(point.y) * (CELL_SIZE + row_padding) + marginTop);
    if (xInCell < CELL_SIZE && xInCell > 0 && yInCell < CELL_SIZE && yInCell > 0 && attributeIndex > 0 && attributeIndex <= CategoryNum[categoryIndex]) {
        const unit = units[categoryIndex][attributeIndex - 1];
        const yPos = getCategory(point.y);
        switch(mode) {
			case 0:
                if (isRightClick) {
                    if (unit.npLv === 0) unit.npLv = npLv;
                    else unit.npLv--;
                } else {
                    unit.npLv = unit.npLv < npLv ? unit.npLv + 1 : 0;
                }
				break;
		    case 1:
                if (isRightClick) unit.mark = unit.mark > 0 ? unit.mark - 1 : Marks.length;
                else unit.mark = (unit.mark + 1) % (Marks.length + 1);
				break;
		}
        drawImage(attributeIndex, yPos, unit.image);
        if (!unit.npLv) { fillTextMask(attributeIndex, yPos, bgcolor); fillRect(attributeIndex - 1, yPos, mask); }
        else { fillTextMask(attributeIndex, yPos, bgcolor); fillNPText(attributeIndex - 1, yPos, `${i18n.npLevelPrefix[currentLang]}${unit.npLv}`); }
        if (unit.mark) drawImage(attributeIndex, yPos, markImages[unit.mark - 1]);
		fillTotalText();
		if(luckyBag) fillCaculate();
		updateData(units);
    }
}
function rightClick(e){ handleUnitInteraction(e, true); }
function onCanvasClick(e){ handleUnitInteraction(e, false); }

function exportData() {
    const accountName = getCurrentAccount();
    const data = getData(FGO_STORAGE);
    if (data.length === 0) { alert("目前帳號沒有資料可匯出。"); return; }
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fgo_4star_data_${accountName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Data is not an array.");
            if (confirm(i18n.confirmImport[currentLang])) {
                setData(FGO_STORAGE, importedData);
                alert(i18n.successImport[currentLang]);
                location.reload();
            }
        } catch (error) {
            console.error("Import failed:", error);
            alert(i18n.errorImport[currentLang]);
        } finally {
            event.target.value = null;
        }
    };
    reader.readAsText(file);
}

function openImage(){
	try{
		const image = new Image();
		const canvas = document.getElementById("canvas");
		image.src = canvas.toDataURL("image/png");
		window.open().document.write('<img src="' + image.src + '" />');
	}catch(e){
        if (e.name === "SecurityError") alert(i18n.errorSecurity[currentLang]);
        else alert(`${i18n.errorGenerateImage[currentLang]}${e}`);
	}
}
function getLanguage() {
    const savedLang = localStorage.getItem('fgo4s-lang'); // Use a different key for 4-star version
    if (savedLang && i18n.pageTitle[savedLang]) return savedLang;
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('en')) return 'en';
    return 'zh-TW';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('fgo4s-lang', lang);
    applyLanguage(lang);
    if (canvas && context) drawCanvas();
}

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        if (i18n[key] && i18n[key][lang]) el.innerText = i18n[key][lang];
    });
    Object.keys(FGO_DATA).forEach(modeKey => {
        const modeData = FGO_DATA[modeKey];
        if (modeData.labelKey) {
            const button = document.getElementById(`${modeKey}-button`);
            if (button && i18n[modeData.labelKey] && i18n[modeData.labelKey][lang]) {
                button.innerText = i18n[modeData.labelKey][lang];
            }
        }
    });
}
