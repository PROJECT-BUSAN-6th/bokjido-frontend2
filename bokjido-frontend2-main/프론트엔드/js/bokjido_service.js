
addAge();  //연령요소추가
var objData; //응답 객체

//검색버튼 클릭시
const btnSearch = document.getElementById('button-addon2');
btnSearch.addEventListener('click', () => {


    //요청값 생성함수
    const request = returnJson();
    console.log(request);

    // API 엔드포인트와 파라미터를 조합하여 URL 생성     
    const apiUrl = `http://localhost:8080/api/service`;
    const address = addQueryParams(apiUrl,request);

    fetch(address
    , {
        method: "GET",
        headers: {
            'Origin': 'http://localhost:8000'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        //서비스 추가
        addService(data);
        objData = data;

        //서비스카드 클릭 시 
        const clickService = document.querySelectorAll('.sel-cd');

        for(let i=0; i<clickService.length; i++){

            clickService[i].addEventListener('click', () => {
                const dataID = document.querySelectorAll('.service-card-link');
                //서비스의 data-value값(=id값)을 가져옴
                const data = dataID[i].getAttribute('data-value');
                console.log(data);

                //다른 html에 값 전송   
                localStorage.setItem("valueID", data);
                localStorage.setItem("reqData", objData); //변경
            });
        }
        
    })
    .catch(error => {
        console.log(error);
    })

})


// 쿼리 매개변수를 URL에 추가하기 위한 함수
function addQueryParams(url, params) {    
    const queryString = new URLSearchParams(params).toString();
    return url + (url.includes('?') ? '&' : '?') + queryString;
  }

//연령 요소 추가 함수
function addAge(){
    let ageTemp ="";
    ageTemp +="<option value=''>연령</option>";
    for(let i=1; i<101; i++){
        ageTemp += "<option value='"+i+"'>"+i+"</option>";
    }
    $('#age').empty();  
    $('#age').append(ageTemp); 
}


//검색 값 받아서 요청값 생성하는 함수
function returnJson(){
    //지역, 연령, 키워드 받아오기
    const localityEl = document.getElementById('locality'); //지역 선택요소
    const ageEl = document.getElementById('age'); //연령 선택요소

    const localityValue = localityEl.options[localityEl.selectedIndex].value;
    const ageValue = parseInt(ageEl.options[ageEl.selectedIndex].value);
    const keyword = document.getElementById('keywordTxT').value; //검색창 텍스트 받아오기

    console.log(localityValue);
    console.log(ageValue);
     console.log(keyword);

    //요청 값
    const serviceAr = {
        "locality": localityValue,
        "age": ageValue,
        "keyword": keyword
    };
    console.log(serviceAr);

    // //object json으로 변환
    const serviceArJS = JSON.stringify(serviceAr);
    return(serviceAr);
}


//서비스 추가 함수
function addService(data){
    let cardTemp ="";
    // 받아온 데이터(data)를 처리합니다.
    console.log(data);
    const contentArray = data.content;            

    //서비스 카드 동적 추가
    for(i=0; i<contentArray.length; i++){
        cardTemp += "<div class='col'>"
        cardTemp += "<div class='card sel-cd' id='containerCard' style='width: 18rem;'>"
        cardTemp += `<a  class="service-card-link" data-value="${contentArray[i].id}" href="/프론트엔드/html/bokjido_serviceInfo.html">`
        cardTemp += "<div class='card-body'>"
        cardTemp += `<h5 class="card-title">${contentArray[i].name}</h5>`
        cardTemp += "<h6 class='card-subtitle mb-2 text-body-secondary'>"
        cardTemp += "<img src='/프론트엔드/image/serviceTarget.svg'>"
        cardTemp += "<span id='target'>신청대상</span>"
        cardTemp += `<span id="targetName">${contentArray[i].applyTarget}</span>`
        cardTemp += "</h6>"
        cardTemp += "<p class='card-text text-center' style='color:grey'>"
        cardTemp += contentArray[i].summary
        cardTemp += "</p>"
        cardTemp += "</div>"
        cardTemp += "</a>"  
        cardTemp += "</div>"
        cardTemp += "</div>"
    }
    $('#cardGridRow').empty();  
    $('#cardGridRow').append(cardTemp); //append
}

