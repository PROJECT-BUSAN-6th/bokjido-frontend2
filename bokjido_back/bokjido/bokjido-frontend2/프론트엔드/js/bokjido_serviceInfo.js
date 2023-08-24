//저장 전송전 필드 체크 이벤트 리스너
document.querySelector('#submit').addEventListener('click', function(e){
   
    if(document.querySelector('#exampleFormControlTextarea1').value.length < 5){
        alert("5글자 이상 입력해주세요.");
        return false;
    }
     
    //폼 서밋
    //리뷰를 'reviewText' 키로 저장
    const reviewT = document.querySelector('#exampleFormControlTextarea1').value;
    localStorage.setItem('reviewText', reviewT); 
    console.log(localStorage.getItem('reviewText')); 
    
    //날짜 저장
    date = new Date().toLocaleDateString();
    localStorage.setItem('date', date);
    console.log(localStorage.getItem('date'));
    
    alert("리뷰가 저장되었습니다.");
    //초기화
    document.querySelector('#exampleFormControlTextarea1').value = '';
});





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