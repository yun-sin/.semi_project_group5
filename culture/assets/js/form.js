document.cookie = "safeCookie2=foo";
const wrap = document.querySelector("#wrap");

/**
 * Page 1
 * 언제 공연을 찾으시나요?
 */
const calender = document.querySelector("#calender");
calender.valueAsDate = new Date();
const now = new Date();
// 미래만 선택 가능하므로 오늘 날짜까지 선택 가능하게 하기 위해 기준점을 출력시점의 하루 전날로 잡음
const now2 = new Date();
now.setDate(now.getDate() - 1);

// 날짜 옆 체크버튼 클릭시 이벤트
document.querySelector("#dateCheck").addEventListener("click", (e) => {
  e.preventDefault();
  const chooseDate = new Date(calender.value);

  if (!calender.value) {
    alert("날짜를 선택해주세요.");
  } else if (chooseDate.getTime() < now.getTime()) {
    alert("[" + now2.toLocaleDateString() + "] 이후의 날짜를 선택해주세요.");
  } else {
    document.querySelector(".i1").classList.remove("choose");
    document.querySelector(".i2").classList.add("choose");
    document.querySelector(".map_wrap").style.bottom = "60%";
    wrap.style.transform = "translate(-700px)";
    window.localStorage.setItem("date", calender.value);
  }
});

/**
 * Page 2
 * 어디서 공연을 찾으시나요?
 */

/**
 * KAKAO MAP API
 */
let LAT = null;
let LOG = null;

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
  };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다
if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude, // 위도
      lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition, message);
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
    message = "geolocation을 사용할수 없어요..";

  displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {
  map.setCenter(locPosition);
}

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(); // 클릭한 위치를 표시할 마커입니다
infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
// searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var detailAddr = !!result[0].road_address ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>" : "";
      detailAddr += "<div>지번 주소 : " + result[0].address.address_name + "</div>";

      var content = '<div class="bAddr">' + '<span class="title">법정동 주소정보</span>' + detailAddr + "</div>";

      // 마커를 클릭한 위치에 표시합니다
      marker.setPosition(mouseEvent.latLng);
      marker.setMap(map);

      // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
      infowindow.open(map, marker);
      document.querySelector(".map_text").innerHTML = '<div class="bAddr">' + '<span class="title">선택 위치</span>' + detailAddr + "</div>";
      document.querySelector("#chooseLoc").innerHTML = '<i class="fa-solid fa-location-dot"></i> <span> ' + " 선택 위치 : " + result[0].address.address_name + "</span>";
      document.querySelector("#chooseLoc").dataset.lat = mouseEvent.latLng.Ma;
      document.querySelector("#chooseLoc").dataset.lon = mouseEvent.latLng.La;
      document.querySelector("#chooseLoc").dataset.add = result[0].address.address_name;

      infowindow.close();
    }
  });
});

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", function () {
  searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
  // 좌표로 법정동 상세 주소 정보를 요청합니다
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    var infoDiv = document.getElementById("centerAddr");

    for (var i = 0; i < result.length; i++) {
      // 행정동의 region_type 값은 'H' 이므로
      if (result[i].region_type === "H") {
        infoDiv.innerHTML = result[i].address_name;
        break;
      }
    }
  }
}

/** 현재 위치 찾기 버튼 클릭시 주소 출력 이벤트 */
document.querySelector("#userLoc").addEventListener("click", (e) => {
  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도

      var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

      // 마커와 인포윈도우를 표시합니다
      displayMarker(locPosition, message);
      marker.setPosition(locPosition);

      var geocoder = new kakao.maps.services.Geocoder();

      var coord = new kakao.maps.LatLng(lat, lon);
      var callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          document.querySelector(".map_text").innerHTML = '<div class="bAddr">' + '<span class="title">현재 위치</span>' + result[0].address.address_name + "</div>";
          document.querySelector("#userLoc").innerHTML = '<i class="fa-solid fa-location-crosshairs"></i><span> ' + " 현재 위치 : " + result[0].address.address_name + "</span>";
          document.querySelector("#userLoc").dataset.lat = lat;
          document.querySelector("#userLoc").dataset.lon = lon;
          document.querySelector("#userLoc").dataset.add = result[0].address.address_name;
        }
      };

      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    });
  } else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
      message = "geolocation을 사용할수 없어요..";

    displayMarker(locPosition, message);
  }
});
/**
 * ↑↑↑↑↑↑↑↑↑↑↑↑↑
 * KAKAO MAP API
 */

/** 현재 위치 찾기 오른쪽 체크 버튼 클릭시 이벤트 */
document.querySelector(".ulCheck").addEventListener("click", (e) => {
  e.preventDefault();
  const userLoc = document.querySelector("#userLoc");
  if (!userLoc.dataset.lat) {
    alert("위치를 찾을 수 없습니다. \n현재 위치 찾기를 시도해보세요.");
  } else {
    e.preventDefault();
    document.querySelector(".i2").classList.remove("choose");
    document.querySelector(".i3").classList.add("choose");
    wrap.style.transform = "translate(-1400px)";
    window.localStorage.setItem("lat", userLoc.dataset.lat);
    window.localStorage.setItem("lon", userLoc.dataset.lon);
    window.localStorage.setItem("add", userLoc.dataset.add);
  }
});

/** 지도에서 직접 위치 선택후 체크 클릭시 이벤트 */
document.querySelector(".clCheck").addEventListener("click", (e) => {
  e.preventDefault();
  const chooseLoc = document.querySelector("#chooseLoc");
  if (!chooseLoc.dataset.lat) {
    alert("위치를 선택해주세요.");
  } else {
    e.preventDefault();
    document.querySelector(".i2").classList.remove("choose");
    document.querySelector(".i3").classList.add("choose");
    wrap.style.transform = "translate(-1400px)";
    window.localStorage.setItem("lat", chooseLoc.dataset.lat);
    window.localStorage.setItem("lon", chooseLoc.dataset.lon);
    window.localStorage.setItem("add", chooseLoc.dataset.add);
  }
});

/**
 *
 *
 * Page 3
 *
 * 어떤 장르를 찾으시나요? (복수선택 가능)
 *
 *
 *
 */

/** 장르 선택시 버튼배경색 변경 */
document.querySelectorAll(".btn1").forEach((v, i) => {
  v.addEventListener("click", (e) => {
    v.classList.toggle("choiced");
    document.querySelector(".chooseEnd").classList.add("cango");
  });
});

/** 장르 선택후 제출 버튼 */
document.querySelector(".chooseEnd").addEventListener("click", (e) => {
  const choArr = [];
  Array.from(document.querySelectorAll(".btn1")).forEach((v, i) => {
    if (v.classList.contains("choiced")) {
      choArr.push(v.dataset.genre);
    }
  });
  if (choArr.length == 0) {
    alert("장르를 선택해주세요.");
  } else {
    window.localStorage.setItem("type", choArr);
    window.location.href = "rec.html";
  }
});
