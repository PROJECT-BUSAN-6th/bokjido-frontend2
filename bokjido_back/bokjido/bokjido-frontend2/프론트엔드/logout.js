document.addEventListener("DOMContentLoaded", function() {
  // 이벤트 리스너 추가하여 문서가 로드될 때 실행

  // 세션 상태 확인
  function checkSessionStatus() {
      // 이 부분에서 서버로 세션 상태를 확인하는 요청을 보내고,
      // 로그인 상태에 따라 버튼을 조작해야 합니다.
      // 서버 응답에 따라 아래의 코드를 수정하면 됩니다.

      var isLoggedIn = flase; // 예시로 로그인 상태로 설정

      if (isLoggedIn) {
          document.getElementById("loginButton").style.display = "none";
          document.getElementById("mypageButton").style.display = "inline-block";
          document.getElementById("signUpButton").style.display = "none";
          document.getElementById("logoutButton").style.display = "inline-block";
      } else {
          document.getElementById("loginButton").style.display = "inline-block";
          document.getElementById("mypageButton").style.display = "none";
          document.getElementById("signUpButton").style.display = "inline-block";
          document.getElementById("logoutButton").style.display = "none";
      }
  }

  checkSessionStatus(); // 페이지 로드 시 세션 상태 확인
});