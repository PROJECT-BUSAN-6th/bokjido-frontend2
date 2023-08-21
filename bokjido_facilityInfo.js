document.addEventListener('DOMContentLoaded', function(){
    //별점선택 이벤트 리스너
    // const rateForms = document.querySelectorAll('.rating'); /* 별점 선택 템플릿을 모두 선택 */
    const rateK = document.querySelector('#rating-kindness');  /*친절 별점 선택 템플릿*/
    const rateC = document.querySelector('#rating-clean');  /* 별점 선택 템플릿*/
    const rateP = document.querySelector('#rating-parking');  /* 별점 선택 템플릿*/
    // 각 항목별 점수 저장 변수
    let storeK=[];
    let storeC=[];
    let storeP=[];

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
	



    //저장 전송전 필드 체크 이벤트 리스너
    document.querySelector('#submit').addEventListener('click', function(e){
        //별점 선택 안했으면 메시지 표시
        if(rating.rate == 0){
            rating.showMessage('rate');
            return false;
        }
        //리뷰 5자 미만이면 메시지 표시
        if(document.querySelector('#exampleFormControlTextarea1').value.length < 5){
            rating.showMessage('review');
            return false;
        }
        
        //폼 서밋
		//리뷰를 'reviewText' 키로 저장
		const reviewT = document.querySelector('#exampleFormControlTextarea1').value;
        localStorage.setItem('reviewText', reviewT); 
        console.log(localStorage.getItem('reviewText')); 

        //localStorge에 항목별 점수 저장
        localStorage.setItem('kindness', storeK.pop());                   
        localStorage.setItem('clean', storeC.pop());         
        localStorage.setItem('parking', storeP.pop());     
            
        //확인용 나중에 삭제
        const k = localStorage.getItem('kindness');     
        const c = localStorage.getItem('clean');                   
        const p = localStorage.getItem('parking');                   
        console.log(k, c, p);
        
        //날짜 저장
        date = new Date().toLocaleDateString();
        localStorage.setItem('date', date);
        console.log(localStorage.getItem('date'));
        
        alert("리뷰가 저장되었습니다.");
        //초기화
        storeK = [];
        storeC = [];
        storeP = [];
		rating.setRate(null, 0);
		document.querySelector('#exampleFormControlTextarea1').value = '';
    });
});


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

Rating.prototype.showMessage = function(type){//경고메시지 표시
    switch(type){
        case 'rate':
            //안내메시지 표시
            document.querySelector('.review_rating .warning_msg').style.display = 'block';
            //지정된 시간 후 안내 메시지 감춤
            setTimeout(function(){
                document.querySelector('.review_rating .warning_msg').style.display = 'none';
            },1000);            
            break;
        case 'review':
            //안내메시지 표시
            document.querySelector('.review_contents .warning_msg').style.display = 'block';
            //지정된 시간 후 안내 메시지 감춤
            setTimeout(function(){
                document.querySelector('.review_contents .warning_msg').style.display = 'none';
            },1000);    
            break;
    }
}

let rating;
rating = new Rating();//별점 인스턴스 생성


//서비스 스크롤 박스 추가, 숨김
//Search 버튼 받아오기
const btnSearch = document.querySelector('#btn-searchService');
// 서비스 블럭 받아오기
const serviceBlock = document.querySelector('.service-sel');
//서비스 받아오기
const selService = document.querySelectorAll('.one-service-sel');
//검색창 input 받아오기
const searchInput = document.querySelector('.search-text');


// Search 눌렀을때 active클래스 추가
btnSearch.addEventListener('click',function(){
    serviceBlock.classList.add('show-selBox');
})


//서비스 눌렀을때 창 닫기 + 서비스 데이터 저장
for(let i=0; i<selService.length; i++){
    selService[i].addEventListener('click',function(){
        serviceBlock.classList.remove('show-selBox');
        localStorage.setItem('useService',selService[i].value);  //이용서비스 localStorage에 저장
        //서비스 이름 받아오는거 수정해야함
        
        searchInput.value= localStorage.getItem('useService'); //검색창에 서비스명 입력
    })
}

//리뷰 박스에 날짜 불러오기
const reviewDate = document.querySelectorAll('.write-day');

