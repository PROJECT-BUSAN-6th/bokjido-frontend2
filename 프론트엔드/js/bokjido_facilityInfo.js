//시설 단일 조회
const facilityInfoId = localStorage.getItem('facilityID');
// localStorage.removeItem('facilityID');
console.log(facilityInfoId);

fetch(`http://localhost:8080/api/facility/${facilityInfoId}`
    , {
        method: "GET",
        headers: {
            'Origin': 'http://localhost:8000'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        //서비스 정보 추가
        document.querySelector('.serviceName').innerHTML = data.name;
        document.querySelector('.service-ex').innerHTML = data.category;
        document.getElementById('facilityName').innerHTML =  data.name;
        document.getElementById('facilityCategory').innerHTML =  data.category;
        document.getElementById('facilityLocation').innerHTML =  data.location;
        document.getElementById('facilityNumber').innerHTML =  data.tel;
        document.getElementById('facilityParking').innerHTML =  data.tel;





    })  
    .catch(error => {
        console.log(error);
    })

// 각 항목별 점수 저장 변수
let storeK=[];
let storeC=[];
let storeP=[];
var serviceID = "";

document.addEventListener('DOMContentLoaded', function(){
    addReview(facilityInfoId, 65); //리뷰 조회 //서비스아이디 추가해야함

    //별점선택 이벤트 리스너
    // const rateForms = document.querySelectorAll('.rating'); /* 별점 선택 템플릿을 모두 선택 */
    const rateK = document.querySelector('#rating-kindness');  /*친절 별점 선택 템플릿*/
    const rateC = document.querySelector('#rating-clean');  /* 별점 선택 템플릿*/
    const rateP = document.querySelector('#rating-parking');  /* 별점 선택 템플릿*/

 
    //클릭 이벤트 리스너 친절 등록
		rateK.addEventListener('click',function(e){
			let elem = e.target;
			if(elem.classList.contains('rate_radio')){
				rating.setRate(elem.parentElement, parseInt(elem.value)); // setRate() 에 ".rating" 요소를 첫 번째 파라메터로 넘김
                storeK.push(elem.value);
            }
		});
	

    //클릭 이벤트 리스너 청결 등록
		rateC.addEventListener('click',function(e){
			let elem = e.target;
			if(elem.classList.contains('rate_radio')){
				rating.setRate(elem.parentElement, parseInt(elem.value)); // setRate() 에 ".rating" 요소를 첫 번째 파라메터로 넘김
                storeC.push(elem.value);
            }
		});
	

    //클릭 이벤트 리스너 주차장 등록
		rateP.addEventListener('click',function(e){
			let elem = e.target;
			if(elem.classList.contains('rate_radio')){
				rating.setRate(elem.parentElement, parseInt(elem.value)); // setRate() 에 ".rating" 요소를 첫 번째 파라메터로 넘김
                storeP.push(elem.value);
            }
		});

    //서비스 스크롤 박스 추가, 숨김
    const btnSearch = document.querySelector('#btn-searchService');
    const serviceBlock = document.querySelector('.service-sel');
    
    // Search 눌렀을때 active클래스 추가
    btnSearch.addEventListener('click',function(){
        const reqService = returnJson();  //service json 반환

        // API 엔드포인트와 파라미터를 조합하여 URL 생성     
        const apiUrl = `http://localhost:8080/api/service`;
        const address = addQueryParams(apiUrl,reqService);

        //서비스 조회
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
                var cardTemp ="";
                const contentArray = data.content;

                for(i=0; i<contentArray.length; i++){
                    cardTemp += `<button type="button" value="${contentArray[i].id}" class="list-group-item list-group-item-action one-service-sel">${contentArray[i].name}</button>`;
                }
                if(contentArray.length == 0){
                    const emptyService = `<button type="button" class="list-group-item list-group-item-action" style="height:124px; text-align: center">검색 결과가 없습니다.</button>`;
                    $('.service-sel').empty();  
                    $('.service-sel').append(emptyService); //append
                }
                else{
                    $('.service-sel').empty();  
                    $('.service-sel').append(cardTemp); //append
                }
                serviceBlock.classList.add('show-selBox');
            
                const selService = document.querySelectorAll('.one-service-sel');
                const searchInput = document.querySelector('.search-text');

                //서비스 눌렀을때 창 닫기 + 서비스 데이터 저장
                for(let i=0; i<selService.length; i++){
                    selService[i].addEventListener('click',function(){
                        const serviceName = selService[i].innerHTML;
                        searchInput.value = serviceName;
                        serviceBlock.classList.remove('show-selBox');
                        serviceID = parseInt(selService[i].value)
                    })
                }
            })      
            .catch(error => {
                console.log(error);
            })
    })

    //저장 전송전 필드 체크 이벤트 리스너
    document.querySelector('#submit').addEventListener('click', function(e){

        //별점 선택 안했으면 메시지 표시
        if(storeK.length < 1 || storeC.length < 1 || storeP.length < 1){
            resetFacilityReview();
            alert("별점을 선택해주세요.");
            return false;
        }
        else if(Number.isInteger(serviceID) == false){
            resetFacilityReview();
            alert("이용한 서비스를 선택해주세요.");
            return false;
        }
        //리뷰 5자 미만이면 메시지 표시
        else if(document.querySelector('#exampleFormControlTextarea1').value.length < 5){
            resetFacilityReview();
            alert("내용을 5글자 이상 입력해주세요.");
            return false;
        }
        else{
            //폼 서밋
            const reviewT = document.querySelector('#exampleFormControlTextarea1').value; //review text
            const kindness = storeK.pop();  //kindess rate
            const clean = storeC.pop();     //clean rate
            const parking = storeP.pop();   //parking rate
            
            //리뷰 생성
            createReview(facilityInfoId, serviceID, clean, kindness, parking, reviewT);
            
            //초기화
            resetFacilityReview();
        }
    });
});

//연령 요소 추가
let ageTemp ="";
ageTemp +="<option value=''>연령</option>";
for(let i=1; i<101; i++){
    ageTemp += "<option value='"+i+"'>"+i+"</option>";
}
$('#age').empty();  
$('#age').append(ageTemp);

//별점 마킹 모듈 프로토타입으로 생성
function Rating(){};
Rating.prototype.rate = 0;
Rating.prototype.setRate = function(rateobj, newrate){
    //별점 마킹 - 클릭한 별 이하 모든 별 체크 처리
    
    this.rate = newrate;
	let checks = null;
	//요소가 파라메터로 넘어오면 별점 클릭, 없으면 저장 후 전체 초기화
	if(rateobj){
		rateobj.querySelector('.ratefill').style.width = parseInt(newrate * 35) + 'px'; // 현재 별점 갯수 채색
		checks = rateobj.querySelectorAll('.rate_radio'); // 넘어온 요소 하위의 라디오버튼만 선택
	}else{
		//전체 별점 채색 초기화
		const rateFills = document.querySelectorAll('.ratefill');
		rateFills.forEach(function(item){
			item.style.width = parseInt(newrate * 35) + 'px';
		});
		//전체 라디오 버튼 초기화
		checks = document.querySelectorAll('.rate_radio');
	}
	//별점 체크 라디오 버튼 처리
	if(checks){
		checks.forEach(function(item, idx){
			if(idx < newrate){
				item.checked = true;
			}else{
				item.checked = false;
			}
		});		
	}
}

let rating;
rating = new Rating();//별점 인스턴스 생성

//리뷰 작성 초기화 함수
function resetFacilityReview(){
	document.querySelector('#exampleFormControlTextarea1').value = '';
    document.getElementById('locality').value = '';
    document.getElementById('age').value = '';
    document.querySelector('.search-text').value = '';
    serviceID = "";
    storeK = [];
    storeC = [];
    storeP = [];
    rating.setRate(null, 0);
}


//리뷰 생성 함수
function createReview(facilityID, benefitID, cleanRate, kindnessRate, parkingRate, contents){
    const create = {
        "facilityId": parseInt(facilityID),  
        "benefitId": parseInt(benefitID),
        "clean": parseInt(cleanRate),
        "kindness": parseInt(kindnessRate),
        "parking": parseInt(parkingRate),
        "content": contents
      }

    fetch("http://localhost:8080/api/facility/review/create"
    , {
        method: "POST",
        headers: {
            'Origin': 'http://localhost:8000',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTUwNTE0MDAsInN1YiI6ImFjY2Vzcy10b2tlbiIsImh0dHBzOi8vbG9jYWxob3N0OjgwODAiOnRydWUsInVzZXJpZCI6Inl1bnNlb25nMDIiLCJyb2xlIjoiUk9MRV9VU0VSIn0.DekL-ckZ1ZF3mCu2ZNj2WYDYEIV80pk5KV4yPliziaYYYGWVm8CKR6KooA8hTg_h8U5R6wC90BYxbGvYoC7ubA'
        },
        body : JSON.stringify(create)
    })
    .then(data => {
        console.log(data);
        alert("리뷰가 저장되었습니다.");
        addReview(); //리뷰 조회
    })  
    .catch(error => {
        console.log(error);
    })
    
}

//검색 값 받아서 요청값 생성하는 함수
function returnJson(){
    //지역, 연령, 키워드 받아오기
    const localityEl = document.getElementById('locality'); //지역 선택요소
    const ageEl = document.getElementById('age'); //연령 선택요소

    const localityValue = localityEl.options[localityEl.selectedIndex].value;
    const ageValue = parseInt(ageEl.options[ageEl.selectedIndex].value);
    const keyword = document.querySelector('.search-text').value; //검색창 텍스트 받아오기

    //요청 값
    const serviceAr = {
        "locality": localityValue,
        "age": ageValue,
        "keyword": keyword
    };

    // //object json으로 변환
    return(serviceAr);
}

// 쿼리 매개변수를 URL에 추가하기 위한 함수
function addQueryParams(url, params) {    
    const queryString = new URLSearchParams(params).toString();
    return url + (url.includes('?') ? '&' : '?') + queryString;
  }


//시설 리뷰 조회 함수
function addReview(){
    fetch(`http://localhost:8080/api/facility/review/${facilityInfoId}`
    ,{
        method: "GET",
        headers: {
            'Origin': 'http://localhost:8000',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(async data =>{
        console.log(data);
        let facilityTemp = "";
        for(let i=0; i<data.length; i++){
            const reviewServiceID = await searchServiceId(data[i].benefitId);

            facilityTemp += `<div class="card mb-3 review-card">
                                <div class="card-body ">
                                    <div class="write-date">
                                        <span class="write-day">${(data[i].modifiedAt).slice(0,10)}</span>
                                    </div>
                                    <div class="person">
                                        <img  class="profile" src="/프론트엔드/image/bokgido_logo.jpg">
                                        <span class="person-name">${data[i].userId}</span>
                                    </div>
                                    <div class="block-btn review-service">
                                        <button href="" class="btn review-serviceName">
                                            ${reviewServiceID}
                                        </button>
                                    </div>
                                    <div class="review-stars">
                                        <!-- 리뷰-친절 -->
                                        <div class="menu-starRate review-starRate">
                                            <div class="review-menu">
                                                <img src="/프론트엔드/image/kindness_icon.svg"><span id="menu-title1">친절</span>
                                            </div>
                                            <div class="stars" >
                                                <div class="star-fill" style="width: calc(${data[i].kindness}*30px);">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                                <div class="star-base">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                            </div>    
                                        </div>
                                        <!-- 리뷰-청결 -->
                                        <div class="menu-starRate review-starRate">
                                            <div class="review-menu">
                                                <img src="/프론트엔드/image/clean._icon.svg"><span id="menu-title1">청결</span>
                                            </div>
                                            <div class="stars" >
                                                <div class="star-fill" style="width: calc(${data[i].clean}*30px);">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                                <div class="star-base">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                            </div>    
                                        </div>
                                        <!-- 리뷰-주차장 -->
                                        <div class="menu-starRate review-starRate">
                                            <div class="review-menu">
                                                <img src="/프론트엔드/image/car_icon.svg"><span id="menu-title2">주차장</span>
                                            </div>
                                            <div class="stars" >
                                                <div class="star-fill" style="width: calc(${data[i].parking}*30px);">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                                <div class="star-base">
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                    <span class="review-star">★</span>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    
                                    <p class="review-content">${data[i].content}</p>
                                </div>
                            </div>`
        }
        $('.row-review').empty();  
        $('.row-review').append(facilityTemp); //append
    })
    .catch(error=>{
        console.log(error);
    })
}

//id로 서비스 단일 조회 함수
async function searchServiceId(id){
    try{
        const response = await fetch(`http://localhost:8080/api/service/${id}`, {
            method: "GET",
            headers: {
                'Origin': 'http://localhost:8000'
            }
        });
        const data = await response.json();
        return data.name;
    }
    catch (error) {
        console.log(error);
    }
}