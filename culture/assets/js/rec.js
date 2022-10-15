import search from "./rec_search.js";

// 로딩 열기
document.querySelector("#loading").classList.add("active");

/**
 * form에서 유저가 선택했던 데이터를 가져옴
 */
const userData = {
  date: window.localStorage.getItem("date"), // 날짜
  lat: window.localStorage.getItem("lat"), // 위도
  lon: window.localStorage.getItem("lon"), // 경도
  add: window.localStorage.getItem("add"), // 주소
  type: window.localStorage.getItem("type"), // 장르
};
console.log(userData);

/** 검색 실행
 *
 * currentPage : 현재 검색한 API의 page (1페이지당 1000개의 data)
 * targetPage : 원하는 결과의 수를 못채웠을때 API의 몇페이지 까지 검색할지
 * count : 현재 출력된 검색 결과의 수
 * currentImg : 원하는 결과의 수
 *
 */
let count = 0;
// search(userData, currentPage, targetPage, count, currentImg);
search(userData, 1, 20, count, 5);

/**
 * 어떤 키워드로 검색중인지 알려주는 텍스트
 */
const h2 = document.createElement("h2");
const span1 = document.querySelector(".span1");
span1.innerHTML = userData.date ? userData.date : "";
const span2 = document.querySelector(".span2");
span2.innerHTML = userData.add ? userData.add + " 근처의" : "";
const span3 = document.querySelector(".span3");
span3.innerHTML = userData.type ? userData.type + "(을)를 찾을게요." : "";
setTimeout(() => {
  document.querySelector("#title2").style.opacity = "1";
}, 1000);

/**
 * 검색 시작후 10초후에 검색 결과가 없을 경우 출력할 텍스트, search.html로 연결
 */
setTimeout(() => {
  if (document.querySelector(".row_container").children.length == 0) {
    document.querySelector("#title2").style.opacity = "0";
    setTimeout(() => {
      // 로딩 닫기
      document.querySelector("#loading").classList.remove("active");
      console.log("맞춤 추천 결과가 없습니다.");
      title2.classList.add("animate__animated");
      title2.classList.add("animate__fadeInUp");
      title2.innerHTML = "😢 앗! 맞춤 추천 결과가 없는 것 같아요.<br> <a href='search.html' id='text_link'><h2 id='title3'>상세 검색페이지를 이용해 보세요!</h2></a>";
      document.querySelector("#title3").classList.add("animate__animated");
      setInterval(() => {
        document.querySelector("#title3").classList.toggle("animate__pulse");
      }, 1000);
    }, 1000);
  }
}, 10000);
