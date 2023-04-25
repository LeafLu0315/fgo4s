var canvas, context;
var CELL_SIZE = 50;
var caculateField = 70;
var row_padding = 30;
var col_padding = 20;
var marginTop = 10;
var marginLeft = 10;
var country = window.sessionStorage.getItem("r_country") == null ? "tw" : window.sessionStorage.getItem("r_country");
var mode = 0;
var luckyBag = 0;
var CategoryNum;
var bgcolor = "rgb(176, 176, 176)";
var mask = "rgb(0, 0, 0, 0.6)";
var font_color = "rgb(0, 0, 0)";
var unitMissing = "data:image/png;base64,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"
var counter = 0;	// pass職階數量
var init_npLv = 5;
var npLv = init_npLv;	// 上限寶具等級

var servents = {
	'saber': [3, 4, 5, 6, 10, 101, 121, 123, 138, 165, 176, 187, 221, 223, 227, 245, 264, 290, 293, 298, 301, 310, 344, 354, 363],
	'archer': [11, 14, 69, 122, 131, 137, 157, 180, 184, 197, 200, 207, 248, 262, 269, 271, 286, 311, 318, 325],
	'lancer': [18, 78, 87, 102, 134, 140, 141, 146, 181, 183, 193, 214, 217, 228, 252, 266, 279, 283, 288, 313, 347],
	'rider': [29, 30, 66, 73, 94, 115, 132, 182, 211, 263, 291, 315, 322, 326, 332, 366],
	'caster': [61, 67, 74, 100, 103, 111, 120, 130, 145, 192, 194, 208, 225, 236, 319, 330, 340, 358],
	'assassin': [41, 46, 92, 109, 133, 159, 170, 177, 185, 188, 218, 230, 243, 267, 304, 359, 360, 361],
	'berserker': [47, 48, 58, 82, 89, 116, 162, 171, 178, 202, 219, 282, 287, 323, 345],
	'ruler': [135, 233, 242, 320, 364],
	'avenger': [147, 158, 328, 356],
	'alterego': [164, 190, 191, 338],
	'foreigner': [222, 308],
	'mooncancer': [166],
	'pretender': [335, 367, 372]
}

var Category = [
	'saber',			// 劍
	'archer',			// 弓
	'lancer',			// 槍
	'rider',			// 騎
	'caster',			// 術
	'assassin',			// 殺
	'berserker',		// 狂
	'ruler',			// 秤
	'avenger',			// 仇
	'alterego',			// 丑
	'foreigner',		// 外
	'mooncancer',		// 月
	'pretender',		// 偽
];
// 設定數量
var AllCategoryNUM = {
	'jp': [servents['saber'].length, servents['archer'].length, servents['lancer'].length,
	servents['rider'].length, servents['caster'].length, servents['assassin'].length, servents['berserker'].length,
	servents['ruler'].length, servents['avenger'].length, servents['alterego'].length, servents['foreigner'].length, servents['mooncancer'].length, servents['pretender'].length],
	// 台服
	"tw": [22, 18, 20,
		11, 14, 15, 13,
		3, 2, 3, 2, 1, 0],
	// 自選
	"z":  [14, 9, 12, 5, 8, 8, 8, 1, 2, 0, 0, 0, 1]
}
/* 版型
var foo =
{saber:[],
archer:[],
lancer:[],
rider:[],
caster:[],
assassin:[],
berserker:[],
ruler:[],
avenger:[],
alterego:[],
foreigner:[],
mooncancer:[],
pretender:[]};
*/
var z = {saber:[3, 123, 6, 10, 165, 223, 5, 310, 187, 101, 245, 121, 227, 298],
		archer:[248, 14, 11, 157, 207, 325, 184, 122, 311],
		lancer:[78, 140, 18, 279, 228, 193, 313, 183, 87, 146, 102, 214],
		rider:[94, 66, 332, 29, 30],
		caster:[100, 145, 192, 194, 103, 74, 120, 67],
		assassin:[109, 159, 46, 188, 230, 41, 170, 185],
		berserker:[202, 116, 58, 82, 89, 47, 171, 48],
		ruler:[242],
		avenger:[147, 158],
		pretender:[335]};

var Marks = [
	'hiclipart',
	'heart'
];

//右鍵選單取消,綁定功能
document.oncontextmenu = function(){return false};

//角色物件
var Unit = function(imageUrl){
	var self = this;
	this.imageUrl = imageUrl;
	this.npLv = 0;
	this.mark = 0;
	this.image = new Image();
	this.image.src = this.imageUrl;
};

var CategoryLen = Category.length;
var categoryImages = new Array(CategoryLen);
var markImages = new Array(Marks.length);

//設定標誌
for(var i = 0 ; i < Marks.length ; ++ i){
	markImages[i] = new Image();
	markImages[i].src = "images/mark/" + Marks[i] + ".png";
}

//設定職階圖
classes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,666,98,99];
for(var i = 0 ; i < classes.length ; i++){
	categoryImages[i] = new Image();
	categoryImages[i].src = "images/class/class_" + classes[i] + ".png";
}
var units = [];
var svt = [];

//設定英靈圖
for (i = 0; i < CategoryLen; i++) {
	for (j = 0; j < servents[Category[i]].length; j++) {
		no = servents[Category[i]][j];
		svt[no] = new Unit("images/servents/" + no + ".png");
	}
}

function getNo(category,i,j){
	return category[Category[i]][j];
}

function getUnit(country){
	for (i=0; i<CategoryLen ; i++){
		units[i] = [];
		if(country == 'jp' || country == 'tw'){
			for (j = 0; j < servents[Category[i]].length; j++) {
				no = getNo(servents,i,j);
				units[i][j] = svt[no];
			}
		}
		// 四星自選(含故事限)
		else if(country == 'z'){
			for(j = 0; j< AllCategoryNUM[country][i]; j++){
				no = getNo(z,i,j);
				units[i][j] = svt[no];
			}
		}
	}
	return units;
}

function getCheckedBtn(country){
	if(country == 'jp')
		return jpButton;
	if(country == 'tw')
		return twButton;
	if(country == 'z')
		return zButton;
	return twButton;
}

function Checked(btns,ckbtn){
	for(var i = 0; i < btns.length; i++){
		if(i == btns.indexOf(ckbtn)){
			btns[i].classList.remove('btn--primary');
			btns[i].classList.add('btn--checked');
		}
		else{
			btns[i].classList.remove('btn--checked');
			btns[i].classList.add('btn--primary');
		}
	}
}

function addLoadEvent(fun) {
	// 把已經載入完成的函式賦值給oldnload變數
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = fun;
	}
	else {
		window.onload = function() {
				oldonload();
				fun();
			}
	}
}

function init(state = 0){
	CategoryNUM = Array.from(AllCategoryNUM[country]);
	units = getUnit(country);

	canvas = document.getElementById('canvas');
	canvas.onclick = onCanvasClick;
	// 台GO 日GO
	twButton = document.getElementById('tw-button');
	jpButton = document.getElementById('jp-button');
	btns = [twButton,jpButton];
	// 自選
	zButton = document.getElementById('z-button');
	btns.push(zButton);
	Checked(btns, getCheckedBtn(country));
	// 中間欄
	setButton = document.getElementById('set-button');
	maskButton = document.getElementById('mask-button');
	luckyBagButton = document.getElementById('luckyBag-button');
	resetButton = document.getElementById('reset');
	// 寶具等級上限
	var breakthrough = false;
	document.getElementById('breakthrough').onclick = function(){
		if(breakthrough == true){
			npLv = init_npLv;
			breakthrough = false;
		}
		else{
			npLv = 20;
			breakthrough = true;
		}
		alert("寶具等級上限為:" + npLv);
	}

	// Taiwan GO
	twButton.onclick = function(){
		if (country != "tw"){
			country = "tw";
			init(1);
		}
	};
	// JP GO
	jpButton.onclick = function(){
		if (country != "jp"){
			country = "jp";
			init(1);
		}
	};
	// 自選
	zButton.onclick = function(){
		if(country != "z"){
			country = 'z';
			init(1);
		}
	};

	setButton.onclick = function(){
		mode = 0;
		setButton.classList.remove("btn--primary");
		setButton.classList.add('btn--checked');
		maskButton.classList.remove("btn--checked");
		maskButton.classList.add('btn--primary');
	};
	maskButton.onclick = function(){
		mode = 1;
		maskButton.classList.remove("btn--primary");
		maskButton.classList.add('btn--checked');
		setButton.classList.remove("btn--checked");
		setButton.classList.add('btn--primary');
	};
	luckyBagButton.onclick = function(){
		luckyBag = !luckyBag;
		if(luckyBag){
			luckyBagButton.classList.remove("btn--primary");
			luckyBagButton.classList.add('btn--checked');
			marginLeft += caculateField;
		}else{
			luckyBagButton.classList.remove("btn--checked");
			luckyBagButton.classList.add('btn--primary');
			marginLeft -= caculateField;
		}
		init(2);
	};

	resetButton.onclick = function(){
		window.sessionStorage.setItem("r_country", country);
		location.reload();
	}

	if(!state){
		canvas.addEventListener('mousedown', function rightClickHandler(e) {
			if(e.button === 2) {
				rightClick(e);
			}
		});
	}

	canvas.width  = luckyBag ? (Math.max.apply(null,CategoryNUM) + 1) * (CELL_SIZE + col_padding) + caculateField : (Math.max.apply(null,CategoryNUM) + 1) * (CELL_SIZE + col_padding);
	// add width
	var wid = 700;
	if(canvas.width < wid) canvas.width = wid;
	canvas.height = CategoryLen * (CELL_SIZE + row_padding) + marginTop;
	// 補正值
	canvas.height += CELL_SIZE * 0.5;
	switch(country){
		case 'jp':
			break;
		case 'z':
			canvas.height += CELL_SIZE * 1.5;
		// 少偽職
		default:
			canvas.height -= CELL_SIZE * 1.5;
			break;
	}

	context = canvas.getContext('2d');
	context.font = "20px Microsoft JhengHei";
	context.textBaseline = 'top';

	context.fillStyle = bgcolor;
	luckyBag ? context.fillRect (0, 0, canvas.width + caculateField, canvas.height) : context.fillRect (0, 0, canvas.width, canvas.height);

	fillTotalText();
	var pass = 0;
	counter = 0;

	function getImgNo(images, target){
		for (var i = 0; i < images.length; i++){
			if(target == images[i])
				return i;
		}
		return 0;
	}

	function getImg(country){
		arr = [];
		switch(country){
			case "newyear_23_up":
				arr = [1,1,2,2,3,3,4,4,5,5];
				return arr;
			case "newyear_23_down":
				arr = [6,6,7,7,99,99,99,99,99,99];
				return arr;
			case "sixth":
				return 666;
		}
		return arr;
	}

	arr = getImg(country);

	for (i = 0; i < CategoryLen; i++) {
		// needs to maintain the click event if empty class occurs
		if(CategoryNUM[i]>0){
			if(country == 'jp' || country == 'tw' || country == 'z'){
				drawImage(0, i-pass, categoryImages[i]);
			}
			else if(country == 'newyear_23_up' || country == 'newyear_23_down'){
				img = getImgNo(classes, arr[i]);
				drawImage(0, i-pass, categoryImages[img]);
			}
			else{
				img = getImgNo(classes, arr);
				drawImage(0, i-pass, categoryImages[img]);
			}
		}
		else{
			counter++;
		}
		for (j = 0; j < CategoryNUM[i]; j++) {
			drawImage(j + 1, i-pass, units[i][j].image);
			if(!units[i][j].npLv){
				fillRect(j, i-pass, mask);
			}else{
				fillNPText(j, i-pass, "寶" + units[i][j].npLv, font_color);
			}
			if(units[i][j].mark){
				drawImage(j + 1, i-pass, markImages[units[i][j].mark - 1]);
			}
		}
		// pass = CategoryNUM[i] > 0 ? 0:1;
	}

	if(luckyBag){
		fillCaculate();
	}

	context.font = "20px Microsoft JhengHei";
	context.fillStyle = mask;
	context.fillText("This image was made by mgneko, maintained by LeafLu @ ptt", marginLeft, canvas.height - 25);
}

function drawImage(x, y, image){
	if(image.complete){
		try{
			context.drawImage(image,
				x * (CELL_SIZE + col_padding) + marginLeft,
				y * (CELL_SIZE + row_padding) + marginTop,
				CELL_SIZE,
				CELL_SIZE);
			draw_done = 1;
		}catch(e){
			image.src = unitMissing;
			context.drawImage(image,
				x * (CELL_SIZE + col_padding) + marginLeft,
				y * (CELL_SIZE + row_padding) + marginTop,
				CELL_SIZE,
				CELL_SIZE);
		}
	}else{
		setTimeout(function(){
			drawImage(x, y, image);
		},1000);
	}
}

function fillCaculate(){
	context.font = "12px Microsoft JhengHei";
	var have = 0;
	var haveFull = 0;
	var like = 0;
	var percent = 0;
	var ex = 0;

	// 福袋
	var lucky_bag = (country != 'jp' && country != 'tw' && country != 'en') ? true : false;
	var default_cat1 = lucky_bag ? 14:7;
	var default_cat2 = lucky_bag ? 14:6;
	//
	context.fillStyle = bgcolor;
	context.fillRect(0, 0, caculateField + 10, canvas.height)
	context.fillStyle = font_color;

	for(var category = 0; category < CategoryLen; category++){
		if (category <= default_cat1){
			have = 0;
			haveFull = 0;
			like = 0;
			ban = 0;
		}
		for(var attribute = 0; attribute < CategoryNUM[category]; attribute++){
			if (units[category][attribute].npLv){
				have += 1;
				if(units[category][attribute].npLv >= 5){
					haveFull += 1;
				}
			}
			if (units[category][attribute].mark == 2){
				like += 1;
			}
			if (units[category][attribute].mark == 1){
				ban += 1;
			}
		}

		if (category <= default_cat2){
			if(attribute>0){
				percent = ((1 - (have / attribute)) * 100);
				context.fillText("新:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding));

				percent = (haveFull / units[category].length * 100);
				context.fillText("盤:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding) + 20);

				percent = (like / units[category].length * 100);
				context.fillText("婆:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding) + 40);
			}
			// 新增雷
			// percent = (ban / units[category].length * 100);
			// context.fillText("雷:" + percent.toFixed(2) + "%",
			// marginLeft - caculateField,
			// marginTop + category * (CELL_SIZE + row_padding) + 60);
		}else {
			ex += units[category].length;
		}
	}
	if(lucky_bag == false){
		percent = ((1 - (have / ex)) * 100);
		context.fillText("新:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding));

		percent = (haveFull / ex * 100);
		context.fillText("盤:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding) + 20);

		percent = (like / ex * 100);
		context.fillText("婆:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding) + 40);
	}
	// 新增 雷
	// percent = (ban / ex * 100);
	// msContentScript.fillText("雷:" + percent.toFixed(2) + "%",
	// marginLeft - caculateField,
	// marginTop + 7 * (CELL_SIZE + row_padding) + 60);

	context.font = "20px Microsoft JhengHei";
}

function fillRect(x, y, color){
	context.fillStyle = color;
	context.fillRect ((x + 1) * (CELL_SIZE + col_padding) + marginLeft,
		y * (CELL_SIZE + row_padding) + marginTop,
		CELL_SIZE,
		CELL_SIZE);
}

function fillTextMask(x, y, color){
	context.fillStyle = color;
	context.fillRect(x * (CELL_SIZE + col_padding) + marginLeft,
		(y + 1) * (CELL_SIZE + row_padding) - row_padding  + marginTop,
		CELL_SIZE,
		row_padding);
}

function fillNPText(x, y, msg, color){
	let number = msg.match(/\d+/)[0];
	if(number == 5) context.fillStyle = "rgb(255, 255, 0)";
	else if(number >= 6) context.fillStyle = "rgb(255, 0, 0)";
	else context.fillStyle = "rgb(0, 0, 0)";
	if(number>9){
		context.fillText(msg,
			(x + 1) * (CELL_SIZE + col_padding) + 4 + marginLeft,
			(y + 1) * (CELL_SIZE + row_padding) + marginTop - row_padding + 5,
			CELL_SIZE);
	}
	else{
		context.fillText(msg,
			(x + 1) * (CELL_SIZE + col_padding) + 8 + marginLeft,
			(y + 1) * (CELL_SIZE + row_padding) + marginTop - row_padding + 5,
			CELL_SIZE);
	}
}

function fillTotalText(){
	var totalHave = 0;
	var totalNP = 0;
	var total = 0;
	context.fillStyle = bgcolor;
	context.fillRect(canvas.width - 200, canvas.height - 110, 200, 80)

	for (i = 0; i < CategoryLen; i++) {
		for (j = 0; j < CategoryNUM[i]; j++) {
			totalNP += units[i][j].npLv;
			if(units[i][j].npLv){
				totalHave += 1;
			}
		}
	}
	for (var i = 0; i < CategoryNUM.length; i++) {
		total += CategoryNUM[i];
	};
	var percent =(totalHave/total) * 100;

	var width_fix = 180;

	context.fillStyle = font_color;
	context.fillText("英靈持有數:"+ totalHave + "/" + total,
		canvas.width - width_fix,
		canvas.height - 90);
	context.fillText("英靈持有率:" + percent.toFixed(2) + "%",
		canvas.width - width_fix,
		canvas.height - 70);
	context.fillText("總寶數:" + totalNP,
		canvas.width - width_fix,
		canvas.height - 50);
}

function getCoordinates (event){
	var rect = event.target.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	return {'x':x, 'y':y};
}

function getCategory(y){
	return Math.floor((y - marginTop) / (CELL_SIZE + row_padding));
}

function getAttribute(x){
	return Math.floor((x - marginLeft) / (CELL_SIZE + col_padding));
}

function rightClick(event){
	var rect = event.target.getBoundingClientRect();
	var point = getCoordinates(event);
	var attribute = getAttribute(point.x);
	var category = getCategory(point.y);
	if(point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) < CELL_SIZE &&
		point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) > 0 &&
		point.y - (category * (CELL_SIZE + row_padding) + marginTop) < CELL_SIZE &&
		point.y - (category * (CELL_SIZE + row_padding) + marginTop) > 0 &&
		attribute != 0 &&
		attribute <= CategoryNUM[category]){
		switch(mode) {
			case 0:
				if(units[category][attribute - 1].npLv){
					units[category][attribute - 1].npLv -= 1;
					fillTextMask(attribute, category, bgcolor);
					if(!units[category][attribute - 1].npLv){
						fillRect(attribute - 1, category, mask);
						units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
					}
					else{
						fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
					}
				}
				else{
					units[category][attribute - 1].npLv = npLv;
					drawImage(attribute , category, units[category][attribute - 1].image);
					units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
					fillTextMask(attribute, category, bgcolor);
					fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
				}
				fillTotalText();
				if(luckyBag){
					fillCaculate();
				}
				break;
		case 1:
			drawImage(attribute , category, units[category][attribute - 1].image);
			if(!units[category][attribute - 1].npLv){
				fillRect(attribute - 1, category, mask);
			}
			if(units[category][attribute - 1].mark > 0){
				units[category][attribute - 1].mark--;
			}
			else{
				units[category][attribute - 1].mark = Marks.length;
			}
			if(units[category][attribute - 1].mark){
				drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
			}
			if(luckyBag){
				fillCaculate();
			}
			break;
		}
	}
}

function onCanvasClick(event){

	var rect = event.target.getBoundingClientRect();
	var point = getCoordinates(event);
	var attribute = getAttribute(point.x);
	var category = getCategory(point.y);

	if(point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) < CELL_SIZE &&
		point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) > 0 &&
		point.y - (category * (CELL_SIZE + row_padding) + marginTop) < CELL_SIZE &&
		point.y - (category * (CELL_SIZE + row_padding) + marginTop) > 0 &&
		attribute != 0 &&
		attribute <= CategoryNUM[category]){
		switch(mode) {
			case 0:
				if(!units[category][attribute - 1].npLv){
					drawImage(attribute , category, units[category][attribute - 1].image);
					units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
				}

				if(units[category][attribute - 1].npLv < npLv){
					units[category][attribute - 1].npLv += 1;
					fillTextMask(attribute, category, bgcolor);
					fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
				}
				else{
					units[category][attribute - 1].npLv = 0;
					fillRect(attribute - 1, category, mask);
					units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
					fillTextMask(attribute, category, bgcolor);
					//fillText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
				}
				fillTotalText();
				if(luckyBag){
					fillCaculate();
				}
				break;
		case 1:
			drawImage(attribute , category, units[category][attribute - 1].image);
			if(!units[category][attribute - 1].npLv){
				fillRect(attribute - 1, category, mask);
			}
			units[category][attribute - 1].mark++;
			units[category][attribute - 1].mark = units[category][attribute - 1].mark % (Marks.length + 1);
			if(units[category][attribute - 1].mark){
				drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
			}
			if(luckyBag){
				fillCaculate();
			}
			break;
		}
	}
}

function openImage(){
	try{
		var image = new Image();
		var canvas = document.getElementById("canvas");
		image.src = canvas.toDataURL("image/png");
		window.open().document.write('<img src="' + image.src + '" />');
	}catch(e){
		alert(e);
	}
}
