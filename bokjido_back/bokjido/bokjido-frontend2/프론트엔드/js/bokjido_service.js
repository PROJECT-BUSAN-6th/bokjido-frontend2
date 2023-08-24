// axios.get('http://localhost/api/user/service/create')
//     .then(response => {
//         console.log(response.data.data)
        
//     })

// fetch('http://localhost/bokjido_back/bokjido-backend/bokjido/src/main/')
//   .then((response) => console.log("response:", response))
//   .catch((error) => console.log("error:", error));

// import axios from 'axios';





addAge();  //연령요소추가
var objData; //응답 객체

//검색버튼 클릭시
const btnSearch = document.getElementById('button-addon2');
btnSearch.addEventListener('click', () => {
        
        //요청값 생성함수
        const request = returnJson();
        console.log(request);

        //api 받아오기
        // API 엔드포인트와 파라미터를 조합하여 URL 생성
        const apiUrl = `http://localhost:8080/api/service?${Object.keys(request).map(key => `${key}=${encodeURIComponent(request[key])}`).join('&')}`;
  
        // GET 요청 보내기
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            //서비스 추가
            addService(data);

            objData = data;
        })
        .catch(error => {
        // 에러 처리
        console.error('Error fetching data:', error);
        });

})


//서비스카드 클릭 시 
let clickService = document.querySelectorAll('.sel-cd');
for(let i=0; i<clickService.length; i++){

    clickService[i].addEventListener('click', () => {

    //서비스의 data-value값(=id값)을 가져옴
    const data = document.querySelector('.service-card-link').getAttribute('data-value');

    //다른 html에 값 전송   
    localStorage.setItem("valueID", data);
    localStorage.setItem("reqData", objData); //변경
    });
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
    const ageValue = ageEl.options[ageEl.selectedIndex].value;
    const keyword = document.getElementById('keywordTxT').value; //검색창 텍스트 받아오기

    console.log(localityValue);
    console.log(ageValue);
     console.log(keyword);

    //요청 값
    const serviceAr = {
        locality: localityValue ,
        age : ageValue ,
        keyword: keyword
    };
    // console.log(serviceAr);

    //object json으로 변환-> 필요없음?
    // const serviceArJS = JSON.stringify(serviceAr);
    // console.log(serviceArJS);
    return(serviceAr);
}


//서비스 추가 함수
function addService(data){
    let cardTemp ="";
    // 받아온 데이터(data)를 처리합니다.
    console.log(data);
    const serviceCardObj = JSON.parse(data);
            

    //서비스 카드 동적 추가
    for(let i=0; i<serviceCardObj.length; i++){
                 
        cardTemp += "<div class='col'>"
        cardTemp += "<div class='card' style='width: 18rem;'>"
        cardTemp += "<a  class='service-card-link' data-value='"+serviceCardObj[i].id+"' href='./bokjido_serviceInfo.html'>"
        cardTemp += "<div class='card-body'>"
        cardTemp += "<h5 class='card-title'>"+serviceCardObj[i].name+"</h5>"
        cardTemp += "<h6 class='card-subtitle mb-2 text-body-secondary'>"
        cardTemp += "<img src='./images/serviceTarget.svg'>"
        cardTemp += "신청대상"
        cardTemp += "<span id='targetName'>"+serviceCardObj[i].applyTarget+"</span>"
        cardTemp += "</h6>"
        cardTemp += "<p class='card-text text-center' style='color:grey'>"
        cardTemp += serviceCardObj[i].summary
        cardTemp += "</p>"
        cardTemp += "</div>"
        cardTemp += "</a>"  
        cardTemp += "</div>"
        cardTemp += "</div>"

    }
    $('#cardGridRow').empty();  
    $('#cardGridRow').append(cardTemp); //append
}

