// 로그인 및 회원가입 버튼 클릭 시 호출되는 함수
function onSignInOrSignUp() {
  // '나의정보' 버튼을 나타나도록 스타일 변경
  document.getElementById('mypageButton').style.display = 'inline-block';

  // '로그인' 및 '회원가입' 버튼을 숨김 처리
  document.getElementById('loginButton').style.display = 'none';
  document.getElementById('signUpButton').style.display = 'none';

  // 로그아웃 버튼 나타나게 함
  document.getElementById('logoutButton').style.display = 'inline-block';
}

// 로그아웃 버튼 클릭 시 호출되는 함수
function onSignOut() {
  // '나의정보' 버튼을 숨김 처리
  document.getElementById('mypageButton').style.display = 'none';

  // '로그인' 및 '회원가입' 버튼 나타나게 함
  document.getElementById('loginButton').style.display = 'inline-block';
  document.getElementById('signUpButton').style.display = 'inline-block';

  // 로그아웃 버튼 숨김 처리
  document.getElementById('logoutButton').style.display = 'none';
}

// 로그인 또는 회원가입 시 호출되는 함수
function onLoginOrSignUp() {
  // 여기에 로그인 또는 회원가입 성공시 호출되어야 할 코드를 추가
  onSignInOrSignUp(); // 예시로 로그인/회원가입이 성공하면 버튼 변경 함수 호출
}

// '로그인' 버튼 클릭 시 호출되는 함수
document.getElementById('loginButton').addEventListener('click', function() {
  onLoginOrSignUp();
});

// '회원가입' 버튼 클릭 시 호출되는 함수
document.getElementById('signUpButton').addEventListener('click', function() {
  onLoginOrSignUp();
});

// '로그아웃' 버튼 클릭 시 호출되는 함수
document.getElementById('logoutButton').addEventListener('click', function() {
  onSignOut();
});


document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search");
  const searchResultsContainer = document.getElementById("searchResults");

  searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase();
    searchResultsContainer.innerHTML = ""; // 이전 검색 결과를 지웁니다.

    // 여기에 검색 로직을 추가하세요.
    const services = [
      { name: "서비스 1", link: "bokjido_serviceInfo.html" },
      { name: "서비스 2", link: "bokjido_serviceInfo.html" },
      // ...
    ];

    const matchingServices = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm)
    );

    matchingServices.forEach(service => {
      const serviceLink = document.createElement("a");
      serviceLink.textContent = service.name;
      serviceLink.href = service.link;
      serviceLink.classList.add("service-link");
      searchResultsContainer.appendChild(serviceLink);
    });
  });
});