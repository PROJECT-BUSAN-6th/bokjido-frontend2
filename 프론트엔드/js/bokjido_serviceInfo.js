//상세정보 페이지
const id = localStorage.getItem('valueID');
console.log(id);  //서비스 아이디

fetch(`http://localhost:8080/api/service/${id}`
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
        document.querySelector('.service-ex').innerHTML = data.content;
        document.getElementById('serviceName').innerHTML = data.name;
        document.getElementById('serviceTarget').innerHTML = data.applyTarget;
        document.getElementById('serviceContent').innerHTML = data.content;
        document.getElementById('serviceApply').innerHTML = data.howToApply;

    })  
    .catch(error => {
        console.log(error);
    })

//리뷰
searchReview(); //load review
let usedfacility = "" //시설 아이디 저장
const btnSearch = document.querySelector('#btn-searchService');

// Search 눌렀을때 active클래스 추가
btnSearch.addEventListener('click',async () => {
    const serviceBlock = document.querySelector('.service-sel');
    const facilityInServiceReview = await searchServiceFacility();
    let tempFacilityName = "";

    if(facilityInServiceReview.length < 1){
        const emptyfacility = `<button type="button" class="list-group-item list-group-item-action" style="height:124px; text-align: center">검색 결과가 없습니다.</button>`
        $('.service-sel').empty();  
        $('.service-sel').append(emptyfacility); //append

    }
    else{
        for(i=0; i<facilityInServiceReview.length; i++){
            tempFacilityName += `<button type="button" value="${facilityInServiceReview[i].id}" class="list-group-item list-group-item-action one-service-sel">${facilityInServiceReview[i].name}</button>`
        }
        $('.service-sel').empty();  
        $('.service-sel').append(tempFacilityName); //append
    }
    serviceBlock.classList.add('show-selBox');

    const facilityNameCards = document.querySelectorAll('.one-service-sel');
    const searchInput = document.querySelector('.search-text');

    //서비스 눌렀을때 창 닫기 + 서비스 데이터 저장
    for(let i=0; i<facilityNameCards.length; i++){
        facilityNameCards[i].addEventListener('click',function(){
            searchInput.value = facilityNameCards[i].innerHTML;
            serviceBlock.classList.remove('show-selBox');
            usedfacility = parseInt(facilityNameCards[i].value);
            
        })
    }
})

//전송버튼 눌렀을때 리뷰 생성
document.querySelector('#submit').addEventListener('click', function(e){
        if(Number.isInteger(usedfacility) == false){
            reset();
            alert("이용한 시설을 선택해주세요.");
            return;
        }
        else if(document.querySelector('#exampleFormControlTitle').value.length < 1){
            reset();
            alert("제목을 입력해주세요.");
            return;
        }
        else if(document.querySelector('#exampleFormControlTextarea1').value.length < 5){
            reset();
            alert("내용을 5글자 이상 입력해주세요.");
            return;
        }
        else{
            //폼 서밋
            //리뷰 제목, 리뷰 내용, 날짜 저장
            const reviewTitle = document.querySelector('#exampleFormControlTitle').value;
            const reviewContent = document.querySelector('#exampleFormControlTextarea1').value;

            const create = {
                "serviceId": parseInt(id),
                "facilityId": parseInt(usedfacility),
                "title": reviewTitle,
                "content": reviewContent
            }

            //리뷰 생성
            fetch("http://localhost:8080/api/user/review/service/create"
            , {
                method: "POST",
                headers: {
                    'Origin': 'http://localhost:8000',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTUwNTE0MDAsInN1YiI6ImFjY2Vzcy10b2tlbiIsImh0dHBzOi8vbG9jYWxob3N0OjgwODAiOnRydWUsInVzZXJpZCI6Inl1bnNlb25nMDIiLCJyb2xlIjoiUk9MRV9VU0VSIn0.DekL-ckZ1ZF3mCu2ZNj2WYDYEIV80pk5KV4yPliziaYYYGWVm8CKR6KooA8hTg_h8U5R6wC90BYxbGvYoC7ubA'
                },
                body : JSON.stringify(create)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                //초기화
                reset();
                alert("리뷰가 저장되었습니다.");
                searchReview();
            })  
            .catch(error => {
                console.log(error);
            })
        }
});



//서비스 리뷰 조회 함수
async function searchReview(){
    fetch(`http://localhost:8080/api/user/review/service/${id}`
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

        const reviewArray = data.content;
        let reviewTemp = "";

        for(i=0; i<reviewArray.length; i++) {
            const reviewFacilityName = await getFacilityName(reviewArray[i].facilityId);

            reviewTemp += `<div class="card mb-3 review-card">
            <div class="card-body ">
                <div class="write-date">
                    <span class="write-day">${(reviewArray[i].modifiedAt).slice(0,10)}</span>
                </div>
                <div class="person">
                    <img  class="profile" src="/프론트엔드/image/bokgido_logo.jpg">
                    <span class="person-name">${reviewArray[i].userId}</span>
                </div>
                <div class="block-btn review-service">
                    <button href="" class="btn review-serviceName">
                    ${reviewFacilityName}
                    </button>
                </div>
                <p class="review-content">${reviewArray[i].content}</p>
            </div>
        </div>`
        };
        $('.row-review').empty();  
        $('.row-review').append(reviewTemp); //append


    })
    .catch(error =>{
        console.log(error);
    })
}

//복지 시설 조회 함수
async function searchServiceFacility() {
    const keyLocation = await searchLocationInService();
    const keyCategory = await searchCategoryInService();
    const keyKeyword = await searchKeywordInService();
    const keyTemp = [];
    const searchData = [];
    let count = 0;

    for(let i=0; i<keyLocation.length; i++){
        for(let k=0; k<keyCategory.length; k++){
            if(JSON.stringify(keyLocation[i]) === JSON.stringify(keyCategory[k])){
                keyTemp[count] = keyLocation[i];
                count++;
            }
        }
    }
    count = 0;
    for(let i=0; i<keyTemp.length; i++){
        for(let k=0; k<keyKeyword.length; k++){
            if(JSON.stringify(keyTemp[i]) === JSON.stringify(keyKeyword[k])){
                searchData[count] = keyTemp[i];
                count++;
            }
        }
    }
    return searchData;
}

//지역 시설 조회 함수
async function searchLocationInService(){
    const location = document.getElementById('selectRegion').value;

    try{
        const response = await fetch(`http://localhost:8080/api/facility/search/location/${location}`, {
            method: "GET",
            headers: {
                'Origin': 'http://localhost:8000'
            }
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

//카테고리 시설 조회 함수
async function searchCategoryInService(){
    const category = document.getElementById('selectCategory').value;

    try{
        const response = await fetch(`http://localhost:8080/api/facility/search/category/${category}`, {
            method: "GET",
            headers: {
                'Origin': 'http://localhost:8000'
            }
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.log(error);
    }
}

//키워드를 이용한 시설 조회 함수
async function searchKeywordInService(){
    const keyword = document.querySelector('.search-text').value;

    try{
        const response = await fetch(`http://localhost:8080/api/facility/search/name/${keyword}`, {
            method: "GET",
            headers: {
                'Origin': 'http://localhost:8000'
            }
        });
        const data = await response.json();
        return  data;
    }
    catch(error){
        console.log(error);
    }
}

//시설명 조회 함수
async function getFacilityName(facilityId){
    try{
        const response = await fetch(`http://localhost:8080/api/facility/${facilityId}`, {
            method: "GET",
            headers: {
                'Origin': 'http://localhost:8000'
            }
        });
        const data = await response.json();
        console.log(data.name);
        return data.name;
    }
    catch (error) {
        console.log(error);
    }
}

//초기화 함수
function reset(){
    usedfacility = "";
    document.getElementById('selectRegion').value = "";
    document.getElementById('selectCategory').value = '';
    document.querySelector('.search-text').value = '';
    document.querySelector('#exampleFormControlTitle').value = '';
    document.querySelector('#exampleFormControlTextarea1').value = '';
}