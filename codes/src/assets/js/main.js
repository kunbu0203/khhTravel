var xhr = new XMLHttpRequest();
var card = document.querySelector('#card'),
    contentBox = document.querySelector('#cardBox');
var numBtnBox = document.querySelector('#numBtnBox'),
    numBtn = document.querySelector('.pageBtn-num');
var prevBtn = document.querySelector('.pageBtn-prev'),
    nextBtn = document.querySelector('.pageBtn-next');
var url = location.href,
    num = Number(url.split('?')[1].split('=')[1]);


xhr.open('get', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true)
xhr.send(null)

xhr.onload = function (){
    var obj = JSON.parse(xhr.responseText);
    var data = obj.data.XML_Head.Infos.Info;

    putData(data, num);


    // 下拉篩選行政區 START
    var searchBox = document.querySelector('#searchBox');

    searchBox.addEventListener('change', function (e){
        var filteredData = filterData(data, this.value);
        putData(filteredData, num);
    }, false);
    // 下拉篩選行政區 END


    // 熱門按鈕篩選 START
    var hotBtn = document.querySelectorAll('.hotBtn');

    hotBtn.forEach(function (item){
        item.addEventListener('click', function (e){
            e.preventDefault();
            var filteredData = filterData(data, this.dataset.area);
            putData(filteredData, num);
        }, false);
    });
    // 熱門按鈕篩選 END


    // 前後頁切換 START
    prevBtn.addEventListener('click', function (e){
        e.preventDefault();
        location.href = '?page='+(num - 1);
    }, false);

    nextBtn.addEventListener('click', function (e){
        e.preventDefault();
        location.href = '?page='+(num + 1);
    }, false);
    // 前後頁切換 END
}

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

function filterData(data, val) {
    if (!val) {
        return data;
    } else {
        var filteredData = data.filter(function (item){
            return item.Zipcode === val
        });
    
        return filteredData;
    }
}

function putData(data, num) {
    contentBox.innerHTML = '';

    upDatePageBtn(data, num);
    var pageData = upDatePageCard(data, num);

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

function upDatePageBtn(data, num) {
    numBtnBox.innerHTML = '';

    var len = data.length / 10;
    var start = (num >= 3) ? (num - 1 - 2) : (num - num),
        end = ((start + 5) <= len) ? (start + 5) : len;
    console.log(len)

    for (var i = start; i < end; i++) {
        var numBtnClone = numBtn.cloneNode(true);

        numBtnClone.textContent = i+1;
        numBtnClone.href = '?page='+(i+1);

        numBtnBox.appendChild(numBtnClone);
    }

    var numBtns = document.querySelectorAll('.pageBtn-num');

    numBtns.forEach(function (item){
        if (Number(item.textContent) === num){
            item.classList.add('active');
        }
    });

    if (num === 1) {
        prevBtn.classList.add('disabled');
    } else if (num >= len) {
        nextBtn.classList.add('disabled');
    }
}

function upDatePageCard(data, num) {
    var start = num * 10 - 10,
        end = num * 10;
    return data.slice(start, end);
}