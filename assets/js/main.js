var xhr = new XMLHttpRequest();
var card = document.querySelector('#card'),
    contentBox = document.querySelector('#cardBox');
var title = document.querySelector('.areaInfo-title');
var searchBox = document.querySelector('#searchBox'),
    hotBtn = document.querySelectorAll('.hotBtn');
var numBtnBox = document.querySelector('#numBtnBox'),
    numBtn = document.querySelector('.pageBtn-num');
var prevBtn = document.querySelector('.pageBtn-prev'),
    nextBtn = document.querySelector('.pageBtn-next');
var scrollTop = document.querySelector('.scrollTop');
var url = location.href,
    page = 1,
    area = '';

// ---------------  頁數與區域判斷 START  ---------------
if (url.indexOf('?') != -1) {
    var arr = url.split('?');

    if (arr[1].indexOf('&') != -1){
        var arr1 = arr[1].split('&');

        arr1.forEach(function (item){
            var arr2 = item.split('=');
            if (arr2[0] === 'page'){
                page = Number(arr2[1]);
            } else if (arr2[0] === 'area') {
                area = arr2[1];
            }
        });
    } else {
        var arr1 = arr[1].split('=');

        if (arr1[0] === 'page'){
            page = Number(arr1[1]);
        } else if (arr1[0] === 'area') {
            area = arr1[1];
        }
    }
}
// ---------------  頁數與區域判斷 END  ---------------


xhr.open('get', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true)
xhr.send(null)

xhr.onload = function (){
    var obj = JSON.parse(xhr.responseText);
    var data = obj.data.XML_Head.Infos.Info;
    var filteredData = filterData(data, area);

    putData(filteredData, page);
}

// ---------------  下拉篩選行政區 START  ---------------
searchBox.addEventListener('change', function (e){
    location.href = '?area=' + this.value;
}, false);
// ---------------  下拉篩選行政區 END  ---------------


// ---------------  熱門按鈕篩選 START  ---------------
hotBtn.forEach(function (item){
    item.addEventListener('click', function (e){
        e.preventDefault();
        location.href = '?area=' + this.dataset.area;
    }, false);
});
// ---------------  熱門按鈕篩選 END  ---------------


// ---------------  前後頁切換 START  ---------------
prevBtn.addEventListener('click', function (e){
    e.preventDefault();
    if (area){
        location.href = '?area='+area+'&page='+(page - 1);
    } else {
        location.href = '?page='+(page - 1);
    }
}, false);

nextBtn.addEventListener('click', function (e){
    e.preventDefault();
    if (area){
        location.href = '?area='+area+'&page='+(page + 1);
    } else {
        location.href = '?page='+(page + 1);
    }
}, false);
// ---------------  前後頁切換 END  ---------------


// ---------------  scrollTop START  ---------------
scrollTop.addEventListener('click', function (e){
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}, false);
// ---------------  scrollTop END  ---------------



// 區碼轉換中文
function zipcode(code){
    switch (code) {
        case '800':
            return '新興區';
        case '801':
            return '前金區';
        case '802':
            return '苓雅區';
        case '803':
            return '鹽埕區';
        case '804':
            return '鼓山區';
        case '805':
            return '旗津區';
        case '806':
            return '前鎮區';
        case '807':
            return '三民區';
        case '811':
            return '楠梓區';
        case '812':
            return '小港區';
        case '813':
            return '左營區';
        case '814':
            return '仁武區';
        case '815':
            return '大社區';
        case '820':
            return '岡山區';
        case '821':
            return '路竹區';
        case '822':
            return '阿蓮區';
        case '823':
            return '田寮區';
        case '824':
            return '燕巢區';
        case '825':
            return '橋頭區';
        case '826':
            return '梓官區';
        case '827':
            return '彌陀區';
        case '828':
            return '永安區';
        case '829':
            return '湖內區';
        case '830':
            return '鳳山區';
        case '831':
            return '大寮區';
        case '832':
            return '林園區';
        case '833':
            return '鳥松區';
        case '840':
            return '大樹區';
        case '842':
            return '旗山區';
        case '843':
            return '美濃區';
        case '844':
            return '六龜區';
        case '845':
            return '內門區';
        case '846':
            return '杉林區';
        case '847':
            return '甲仙區';
        case '848':
            return '桃源區';
        case '849':
            return '那瑪夏區';
        case '851':
            return '茂林區';
        case '852':
            return '茄萣區';
        default:
            break;
    }
}

// 篩選區域資料
function filterData(data, area) {
    if (!area) {
        return data;
    } else {
        var filteredData = data.filter(function (item){
            return item.Zipcode === area
        });
    
        return filteredData;
    }
}

// 資料帶入html
function putData(data, page) {
    // title 更換
    if (area){
        title.textContent = zipcode(area);
    } else {
        title.textContent = '全部區域';
    }
    // 下拉預設值 更換
    searchBox.value = area;

    contentBox.innerHTML = '';

    upDatePageBtn(data, page);
    var pageData = upDatePageCard(data, page);

    for (var i = 0; i < pageData.length; i++) {
        var el = pageData[i];
        var cardClone = card.cloneNode(true);
        
        cardClone.querySelector('#cardImg').src = el.Picture1;
        cardClone.querySelector('#cardName').textContent = el.Name;
        cardClone.querySelector('#cardArea').textContent = zipcode(el.Zipcode);
        cardClone.querySelector('#infoTime').textContent = el.Opentime;
        cardClone.querySelector('#infoAddress').textContent = el.Add;
        cardClone.querySelector('#infoPhone').textContent = el.Tel;
        if (!el.Ticketinfo){
            cardClone.querySelector('#infoTag').textContent = '免費參觀';
        }
        
        contentBox.appendChild(cardClone);
    }
}

// 更新頁數切換的按鈕
function upDatePageBtn(data, page) {
    numBtnBox.innerHTML = '';

    var len = data.length / 10;
    var start = (page >= 3) ? (page - 1 - 2) : (page - page),
        end = ((start + 5) <= len) ? (start + 5) : len;

    for (var i = start; i < end; i++) {
        var numBtnClone = numBtn.cloneNode(true);

        numBtnClone.textContent = i+1;
        if (area){
            numBtnClone.href = '?area='+area+'&page='+(i+1);
        } else {
            numBtnClone.href = '?page='+(i+1);
        }

        numBtnBox.appendChild(numBtnClone);
    }

    var numBtns = document.querySelectorAll('.pageBtn-num');

    numBtns.forEach(function (item){
        if (Number(item.textContent) === page){
            item.classList.add('active');
        }
    });

    if (len <= 1) {
        prevBtn.classList.add('disabled');
        nextBtn.classList.add('disabled');
    } else if (page === 1) {
        prevBtn.classList.add('disabled');
    } else if (page >= len) {
        nextBtn.classList.add('disabled');
    }
}

// 顯示該頁面的資料
function upDatePageCard(data, page) {
    var start = page * 10 - 10,
        end = page * 10;
    return data.slice(start, end);
}