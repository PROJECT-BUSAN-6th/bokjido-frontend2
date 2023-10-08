var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(35.1796, 129.0756), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

var map = new kakao.maps.Map(mapContainer, mapOption);  // 지도를 생성합니다    
var markers  = [];  // 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var customOverlays = [];    // 지도에 표시된 오버레이 객체를 가지고 있을 배열입니다

//복지 시설 전체 조회
const searchBtn = document.getElementById('button-addon2');
searchBtn.addEventListener('click', async () => {
    const keyLocation = await searchLocation();
    const keyCategory = await searchCategory();
    const keyKeyword = await searchKeyword();
    const keyTemp = [];
    const searchData = [];
    let count = 0;
    var positions = []; //마커위치 객체배열
     
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

    //검색 결과가 없을시
    if(searchData.length == 0){
        const emptyMessage = `<div class="emptyResult">
                                <h6 style="margin: 0 auto">검색 결과가 없습니다.</h6>
                            </div>`
        $('.div-facility-card').empty();
        $('.div-facility-card').append(emptyMessage);
        return;
    }

    let tempFacilityInfo = "";

    for(let i=0; i<searchData.length; i++){
        //마커 객체 생성
        positions[i] = {
            title: searchData[i].name, 
            latlng: new kakao.maps.LatLng(parseFloat(searchData[i].longitude), parseFloat(searchData[i].latitude)),
            id: searchData[i].id
        }
        tempFacilityInfo += `<div class="facility-card" value="${searchData[i].id}">
                                <div>
                                    <h4 class="facility-name" >${searchData[i].name}</h4>
                                    <h6 class="facility-type">${searchData[i].category}</h6>
                                </div>
                                <a class="btn facility-seeMore" onclick="event.stopPropagation(); oneFacilitySetBounds(${searchData[i].longitude}, ${searchData[i].latitude})" role="button">위치</a>
                            </div>`
    }

    createMarker(positions); //마커 생성 함수 호출

    $('.div-facility-card').empty();
    $('.div-facility-card').append(tempFacilityInfo);
    
    //시설카드 클릭 시
    const facilityCards = document.querySelectorAll('.facility-card');
    for(let i=0; i<facilityCards.length; i++){
        facilityCards[i].addEventListener('click',()=>{
            const facilityDataID = facilityCards[i].getAttribute('value');
            localStorage.setItem("facilityID", facilityDataID);
            window.location.href = "/프론트엔드/html/bokjido_facilityInfo.html";
        })
    }
})

//지역을 이용한 시설 조회 함수
async function searchLocation(){
    const location = document.getElementById('sel-region').value;

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
        nullMessage();
    }
}


//카테고리를 이용한 시설 조회 함수
async function searchCategory(){
    const category = document.getElementById('sel-facility').value;

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
        nullMessage();
    }
}

//키워드를 이용한 시설 조회 함수
async function searchKeyword(){
    const keyword = document.querySelector('.search-facility').value;

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
        nullMessage();
    }
}

function createMarker(positions){
    removeMarkers();  //마커 제거

    var imageSrc = "/프론트엔드/image/pin.png";     // 마커 이미지의 이미지 주소입니다
    var imageSize = new kakao.maps.Size(56, 60);  // 마커 이미지의 이미지 크기 입니다   
    var imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.   
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);  // 마커 이미지를 생성합니다 
    var bounds = new kakao.maps.LatLngBounds(); //지도를 재설정할 범위정보를 저장하는 객체

    for (var i = 0; i < positions.length; i ++) {
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image : markerImage // 마커 이미지 
        });
        //marker.setMap(map);
        markers.push(marker);
        bounds.extend(positions[i].latlng);  //LatLngBounds 객체에 좌표 추가

        //커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        var content = `<div class="customoverlay">
                            <a class="overlayContainer" onclick="setFacilityId(${positions[i].id})" href="/프론트엔드/html/bokjido_facilityInfo.html"> 
                                <span class="title">${positions[i].title}</span>
                            </a> 
                        </div>`;


        // 커스텀 오버레이를 생성합니다
        var customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: positions[i].latlng,
            content: content,
            yAnchor: 1 
        });

        customOverlays.push(customOverlay);
    }
    setBounds(bounds);

}

//마커, 오버레이 제거 함수
function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        customOverlays[i].setMap(null);
    }            
}

//오버레이 클릭 시 시설 아이디 localStorage에 저장
function setFacilityId(positionsId){
    localStorage.setItem("facilityID", positionsId);
} 

// LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정
function setBounds(bounds) {
    map.setBounds(bounds);
}


//단일 위치 조회
function oneFacilitySetBounds(longitude, latitude){
    const onelatlng = new kakao.maps.LatLng(parseFloat(longitude), parseFloat(latitude));
    const oneBound = new kakao.maps.LatLngBounds(); //클릭한 시설의 좌표 저장 객체
    oneBound.extend(onelatlng); //객체에 좌표 추가
    setBounds(oneBound);
}

//검색 결과 없음을 나타내는 함수
function nullMessage(){
    const emptyMessage = `<div class="emptyResult">
                                <h6 style="margin: 0 auto">검색 결과가 없습니다.</h6>
                            </div>`
    $('.div-facility-card').empty();
    $('.div-facility-card').append(emptyMessage);
    return;
}