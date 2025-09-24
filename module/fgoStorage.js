var FGO_STORAGE = "FGO_Storage_4S"; // 修改儲存鍵值以避免與五星版本衝突
var ACCOUNT_KEY = "FGO_Account_4S";

// 在頁面加載時初始化
window.onload = function () {
  const currentAccount = getCurrentAccount();
  updateSwitchButton(currentAccount);
  console.log(`當前帳號：${currentAccount}`);
  migrateOldData(); // 確保舊資料遷移
};

// 按鈕切換帳號的邏輯
function switchAccount() {
  const currentAccount = getCurrentAccount();
  const newAccount = currentAccount === "account1" ? "account2" : "account1";
  localStorage.setItem(ACCOUNT_KEY, newAccount);
  console.log(`切換到帳號：${newAccount}`);
  location.reload();
}

// 取得當前帳號
function getCurrentAccount() {
  return localStorage.getItem(ACCOUNT_KEY) || "account1"; // 預設為 account1
}

// 更新切換按鈕的文字
function updateSwitchButton(currentAccount) {
  const switchButton = document.getElementById("switch-account-btn");
  if (switchButton) {
    switchButton.innerText = `帳號：${currentAccount} (點擊切換)`;
  }
}

// 資料遷移：保證舊資料正確轉移到 `account1`
function migrateOldData() {
  const oldDataKey = "FGO_Storage"; // 舊的鍵值
  const oldData = localStorage.getItem(oldDataKey);
  if (oldData && !localStorage.getItem(`${FGO_STORAGE}_account1`)) {
    localStorage.setItem(`${FGO_STORAGE}_account1`, oldData);
    console.log("舊資料已遷移到四星版本帳號1");
  }
}

// 讀取當前帳號的資料
function getData(configName) {
  const account = getCurrentAccount();
  const item = localStorage.getItem(`${configName}_${account}`);
  return item == null ? [] : JSON.parse(item);
}

// 儲存當前帳號的資料
function setData(configName, configContent) {
  const account = getCurrentAccount();
  if (configContent) {
    localStorage.setItem(`${configName}_${account}`, JSON.stringify(configContent));
  }
}

// 刪除當前帳號的資料
function deleteData(configName) {
  const account = getCurrentAccount();
  localStorage.removeItem(`${configName}_${account}`);
}

// 更新資料 (簡化版邏輯)
function updateData(units) {
  if (!units) return;
  
  const newData = units.flat(2).filter(x => x);
  const currentData = getData(FGO_STORAGE);
  
  const storageMap = new Map();
  currentData.forEach(unit => { if (unit.no) storageMap.set(unit.no, unit); });
  
  newData.forEach(unit => {
      if (unit.no) {
          // 只儲存有寶具等級或標記的資料
          if (unit.npLv > 0 || unit.mark > 0) {
              storageMap.set(String(unit.no), { npLv: unit.npLv, mark: unit.mark, no: String(unit.no) });
          } else {
              storageMap.delete(String(unit.no));
          }
      }
  });
  
  setData(FGO_STORAGE, Array.from(storageMap.values()));
}


// 更新從者 NP 等級
function updateUnitsNPLevel(units) {
  const fgoStorage = getData(FGO_STORAGE);
  const storageMap = new Map();
  fgoStorage.forEach(unit => storageMap.set(String(unit.no), unit));

  units.flat().forEach(unit => {
      if (unit) {
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


// 新增從者編號
function addUnitsNo(units) {
  for (let i = 0; i < units.length; i++) {
    for (let j = 0; j < units[i].length; j++) {
      if(units[i][j] && units[i][j].imageUrl) {
         units[i][j].no = units[i][j].imageUrl.split("/").pop().split(".")[0];
      }
    }
  }
}

// ▼▼▼ 新增匯入匯出功能 ▼▼▼
/**
 * 匯出目前帳號的資料為 JSON 檔案
 */
function exportData() {
    const accountName = getCurrentAccount();
    const data = getData(FGO_STORAGE);
    if (data.length === 0) {
        alert("目前帳號沒有資料可匯出。");
        return;
    }

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

/**
 * 處理選擇的檔案並匯入資料
 * @param {Event} event - 檔案輸入框的 change 事件
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) {
                throw new Error("資料格式不正確，不是一個陣列。");
            }

            if (confirm("確定要匯入資料嗎？這將會覆寫目前帳號的所有資料！此操作無法復原。")) {
                setData(FGO_STORAGE, importedData);
                alert("資料匯入成功！頁面將會重新整理。");
                location.reload();
            }
        } catch (error) {
            console.error("匯入失敗:", error);
            alert("檔案讀取或解析失敗，請確認檔案格式是否為正確的 .json 備份檔。");
        } finally {
            event.target.value = null;
        }
    };
    reader.readAsText(file);
}
// ▲▲▲ 新增匯入匯出功能 ▲▲▲
