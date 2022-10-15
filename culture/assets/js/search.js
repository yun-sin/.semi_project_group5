import search from "./search_search.js";
import { KOPIS_KEY } from "./key.js";

// 변수
let currentPage = 1;
let searchGenre = null;
let searchArea = null;
let queryKeyword = "";
const genreField = [];
let chooseDate = null;
var Lat = 0;
var Lng = 0;
var doLat = 0;
var doLng = 0;

// 달력 today placeholder
const nowDate = new Date();
document.querySelector("#startDay").valueAsDate = new Date(nowDate);

/**
 * 양식 submit시 변수 할당과 search(), setCenter() 실행
 */
document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelectorAll(".btn1").forEach((v, i) => {
    if (v.classList.contains("choiced")) {
      v.classList.add("animate__animated");
      v.classList.add("animate__pulse");

      console.log(v.dataset.genre);
      genreField.push(v.dataset.genre);
    }
  });

  if (genreField.length == 0) {
    alert("장르를 선택하세요. (복수선택 가능)");
  } else {
    chooseDate = document.querySelector("#startDay").value;
    console.log("chooseDate : " + chooseDate);

    const queryField = document.querySelector("#query");
    queryKeyword = queryField.value.trim();

    /**
     * 검색 실행
     */
    let count = 0;
    document.querySelector(".row_container").innerHTML = ""; // 검색시 이전 검색 결과 제거
    search(queryKeyword, chooseDate, genreField, count, currentPage);

    // 검색시 출력부분으로 스크롤 이동
    setTimeout(() => {
      document.querySelector("#output_container").scrollIntoView({ behavior: "smooth" });
    }, 1000);

    // 검색후 10초이후에도 검색결과가 없으면 출력
    setTimeout(() => {
      if (document.querySelector(".row_container").children.length == 0) {
        document.querySelector("#title2").style.opacity = "0";
        setTimeout(() => {
          console.log("맞춤 추천 결과가 없습니다.");
          title2.classList.add("animate__animated");
          title2.classList.add("animate__fadeInUp");
          document.querySelector("#loading").classList.remove("active"); // 로딩바 닫기
          title2.innerHTML = "😢 앗! 원하시는 공연을 찾을 수 없어요.<br> <a href='#top' id='text_link'><h2 id='title3'>다른 키워드를 이용해 검색해보세요!</h2></a>";
          document.querySelector("#title3").classList.add("animate__animated");
          setInterval(() => {
            document.querySelector("#title3").classList.toggle("animate__pulse");
          }, 1000);
        }, 1000);
      }
    }, 10000);
  }
});

function buttonClick(value) {
  let locationS = value.split(",");
  Array.from(locationS);
  Lat = locationS[0];
  Lng = locationS[1];
  setCenter();
}

function buttonClickDo(valueDo) {
  let locationS = valueDo.split(",");
  Array.from(locationS);
  doLat = locationS[0];
  doLng = locationS[1];
  setCenterOut();
}

/**
 * 지도 이동시키기
 */
// 시 지역 줌 레벨 7
function setCenter() {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(Lat, Lng);
  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
  // 줌 레벨 설정
  zoomIn();
}
// 도 지역 줌 레벨 10
function setCenterOut() {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(doLat, doLng);
  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
  // 줌 레벨 설정
  zoomOut();
}

// /**
//  * json data api * 데이터 장소명을 중복없이 배열로 처리 * search_map 함수 호출을 통해 지도에 표시
//  */
// (async () => {
//   let json = null;

//   // 로딩창 띄우기
//   document.querySelector("#loading").classList.add("active");

//   try {
//     // API JSON ------------- 수정
//     const response = await axios.get("http://api.kcisa.kr/openapi/service/rest/meta16/getkopis01", {
//       params: {
//         serviceKey: KOPIS_KEY,
//         numOfRows: 100,
//         pageNo: 1,
//       },
//       header: {
//         accept: "application/json",
//       },
//     });
//     json = response.data.response.body.items.item;
//   } catch (e) {
//     console.error(e);
//     alert("요청을 처리하는데 실패했습니다.");
//     return;
//   } finally {
//     document.querySelector("#loading").classList.remove("active");
//   }

//   // data의 장소 이름을 배열로 만듬
//   let placeArray = [];
//   json.forEach((v, i) => {
//     placeArray.push(v.spatialCoverage);
//   });
//   // console.log(placeArray);

//   // data의 장소 이름을 중복없는 배열로 만듬
//   let placeName = Array.from(new Set(placeArray));
//   // console.log("지도에 표시한 장소");
//   // console.log(placeName);

//   // placeName 반복을 검색 함수 파라미터로 보냄
//   placeName.forEach((v, i) => {
//     // search_map 함수 호출을 통해 지도에 표시
//     search_map(v);
//   });
// })();

// /**
//  * 지도 표시!!
//  */
// // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
// var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// var mapContainer = document.getElementById("map"), // 지도를 표시할 div
//   mapOption = {
//     center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
//     level: 8, // 지도의 확대 레벨
//   };

// // 지도를 생성합니다
// var map = new kakao.maps.Map(mapContainer, mapOption);

// /**
//  * 지도 검색 및 마커 표시
//  * placeName에서 이름을 가져와 지도에 검색 후 마커
//  */
// function search_map(queryKeyword) {
//   // 장소 검색 객체를 생성합니다
//   var ps = new kakao.maps.services.Places();

//   // 키워드로 장소를 검색합니다
//   ps.keywordSearch(queryKeyword, placesSearchCB);

//   // 키워드 검색 완료 시 호출되는 콜백함수 입니다
//   function placesSearchCB(data, status, pagination) {
//     if (status === kakao.maps.services.Status.OK) {
//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
//       // LatLngBounds 객체에 좌표를 추가합니다
//       var bounds = new kakao.maps.LatLngBounds();

//       for (var i = 0; i < data.length; i++) {
//         displayMarker(data[0]);
//         bounds.extend(new kakao.maps.LatLng(data[0].y, data[0].x));
//       }

//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
//       map.setBounds(bounds);
//     }
//   }

//   // 지도에 마커를 표시하는 함수입니다
//   function displayMarker(place) {
//     // 마커를 생성하고 지도에 표시합니다
//     var marker = new kakao.maps.Marker({
//       map: map,
//       position: new kakao.maps.LatLng(place.y, place.x),
//     });

//     // 마커에 클릭이벤트를 등록합니다
//     kakao.maps.event.addListener(marker, "click", function () {
//       // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//       infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + "</div>");
//       infowindow.open(map, marker);
//     });
//   }
// }

// /**
//  * 지도 확대 수준
//  */
// // 지도 레벨은 지도의 확대 수준을 의미합니다
// // 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
// function zoomIn() {
//   // 현재 지도의 레벨을 얻어옵니다
//   var level = map.getLevel();

//   // 지도를 1레벨 내립니다 (지도가 확대됩니다)
//   map.setLevel(7);
// }

// function zoomOut() {
//   // 현재 지도의 레벨을 얻어옵니다
//   var level = map.getLevel();

//   // 지도를 1레벨 올립니다 (지도가 축소됩니다)
//   map.setLevel(10);
// }

// /**
//  * 지도 확대, 축소 가능 여부
//  */
// // 버튼 클릭에 따라 지도 확대, 축소 기능을 막거나 풀고 싶은 경우에는 map.setZoomable 함수를 사용합니다
// function setZoomable(zoomable) {
//   // 마우스 휠로 지도 확대,축소 가능여부를 설정합니다
//   map.setZoomable(zoomable);
// }

//////////////////////////////////////////////////////////////////////////////////////

// 장르 선택시 배경색 변경
document.querySelectorAll(".btn1").forEach((v, i) => {
  v.addEventListener("click", (e) => {
    v.classList.toggle("choiced");
    // 다음 단계 안내를 위한 색 변경
    document.querySelector("#genre_category_title").classList.remove("stepColor");

    setTimeout(() => {
      document.querySelector(".submitBtn").classList.add("stepColor");
    }, 2000);
  });
});

// 헤더 돋보기 클릭시 같은 페이지로 이동이므로 검색창에 포커스 줌
document.querySelector("#mag_glass").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#query").focus();
});

// 지역 선택시 가장 마지막에 선택한 지역 배경색 변경
document.querySelectorAll(".btnJ").forEach((v, i) => {
  v.addEventListener("click", (e) => {
    document.querySelectorAll(".btnJ").forEach((v2, i2) => {
      v2.classList.remove("choiced2");
    });
    v.classList.add("choiced2");
  });
});

// 지역 목록 열기
document.querySelector(".map-category-title").addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("folding");
  if (e.currentTarget.classList.contains("folding")) {
    e.currentTarget.style.transform = "translate(50px, 0)";
    document.querySelector("#map-button-container").style.transform = "translate(50px, 0)";
  } else {
    e.currentTarget.style.transform = "translate(0, 0)";
    document.querySelector("#map-button-container").style.transform = "translate(0, 0)";
  }
});

// 상단 이동 숨김
window.addEventListener("scroll", (e) => {
  if (window.scrollY > 200) {
    document.querySelector("#going_up").style.opacity = 1;
  } else {
    document.querySelector("#going_up").style.opacity = 0;
  }
});
