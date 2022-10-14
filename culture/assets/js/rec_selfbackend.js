// 로딩창 띄워줌
document.querySelector("#loading").classList.add("active");

// form에서 유저가 선택했던 데이터를 가져옴
const date = window.localStorage.getItem("date"); // 날짜
const lat = window.localStorage.getItem("lat"); // 위도
const lon = window.localStorage.getItem("lon"); // 경도
const add = window.localStorage.getItem("add"); // 위치
const type = window.localStorage.getItem("type"); // 문화종류
console.log(date); // 일자
console.log(lat); // 위도
console.log(lon); // 경도
console.log(add); // 주소
console.log(type); // 장르

// 어떤 키워드로 검색중인지 알려주는 타이틀
const h2 = document.createElement("h2");
const span1 = document.querySelector(".span1");
span1.innerHTML = date ? date : "";
const span2 = document.querySelector(".span2");
span2.innerHTML = add ? add + " 근처의" : "";
const span4 = document.querySelector(".span4");
span4.innerHTML = type ? type + "(을)를 찾을게요." : "";

setTimeout(() => {
  document.querySelector("#title2").style.opacity = "1";
}, 2000);

// 검색 결과를 count
let count = 1;

// 검색 실행
search();

// 검색 시작후 10초후에 검색 결과가 없을 경우 출력할 텍스트, search.html로 연결
setTimeout(() => {
  if (document.querySelector(".row_container").children.length == 0) {
    document.querySelector("#title2").style.opacity = "0";
    setTimeout(() => {
      console.log("맞춤 추천 결과가 없습니다.");
      title2.classList.add("animate__animated");
      title2.classList.add("animate__fadeInUp");
      title2.innerHTML = "😢 앗! 맞춤 추천 결과가 없는 것 같아요.<br> <a href='search.html' id='text_link'><h2 id='title3'>상세 검색페이지를 이용해 보세요!</h2></a>";
      // 로딩바 닫기
      document.querySelector("#loading").classList.remove("active");
      document.querySelector("#title3").classList.add("animate__animated");
      setInterval(() => {
        document.querySelector("#title3").classList.toggle("animate__pulse");
      }, 1000);
    }, 1000);
  }
}, 10000);

// 검색 함수
async function search() {
  let json = null;

  try {
    const response = await axios.get("http://localhost:3002/response");
    // const response = await axios.get("http://api.kcisa.kr/openapi/service/rest/meta16/getkopis01", {
    //   params: {
    //     serviceKey: `0197b556-2aa3-44b3-ad89-6eeb90f6a185`,
    //     numOfRows: 1000,
    //     pageNo: 1,
    //   },
    //   header: {
    //     accept: `application/json`,
    //   },
    // });
    json = response.data.response.body.items.item;
    console.log(json);
  } catch (e) {
    console.error(e);
    alert("요청을 처리하는데 실패했습니다.");
    return;
  }

  json.forEach((v, i) => {
    // console.log(v.temporalCoverage);
    const period = v.temporalCoverage.split("~");
    // console.log(period);
    const choosed = new Date(date);
    const startDate = new Date(period[0]);
    startDate.setFullYear(startDate.getFullYear() + 3);
    const endDate = new Date(period[1]);
    endDate.setFullYear(endDate.getFullYear() + 3);

    let A = BigInt(choosed.getTime());
    // console.log(A);
    let B = BigInt(startDate.getTime());
    let C = BigInt(endDate.getTime());
    const A1 = ("" + A).substring(0, 6);
    const B1 = ("" + B).substring(0, 6);
    const C1 = ("" + C).substring(0, 6);
    // console.log(A1);
    // console.log(B1);
    // console.log(C1);

    A = parseInt(A1); // 선택
    B = parseInt(B1); // 시작
    C = parseInt(C1); // 엔드

    /**
     * 검색 조건에 따라 필터링
     */
    // if (true) {
    if (type.includes(v.subjectCategory)) {
      // 장르선택
      if (A >= B && A <= C && count <= 30) {
        // 로딩바 닫기
        document.querySelector("#loading").classList.remove("active");
        // if (count <= currentImg) {
        // 날짜선택
        // console.log("시작일" + startDate.getTime());
        // console.log("선택일" + choosed.getTime());
        // console.log("마감일" + endDate.getTime());
        // console.log(v.subjectCategory);
        const div = document.createElement("div");
        div.classList.add("rec_container");
        div.classList.add("animate__animated");
        div.classList.add("animate__fadeInUp");
        div.style.setProperty("--animate-duration", count * 100 + 1000 + "ms");
        count++;

        const img = document.createElement("img");
        img.classList.add("hvr-grow");
        const h3 = document.createElement("h3");
        const h4 = document.createElement("h4");
        const p1 = document.createElement("p");
        const p = document.createElement("p");

        img.setAttribute("src", v.referenceIdentifier);
        h3.innerHTML = v.title;
        h4.innerHTML = v.spatialCoverage;

        p1.innerHTML = v.subjectCategory;

        /** api가 대부분 과거의 공연정보 이기 때문에 공연 기간에 임시로 3년을 더해서 표현합니다. */
        let plusThreeYear = v.temporalCoverage.replaceAll("2020", "2023").replaceAll("2019", "2022").replaceAll("2018", "2021").replaceAll("2017", "2020");
        p.innerHTML = plusThreeYear;
        // 원래 공연기간
        // p.innerHTML = v.temporalCoverage;
        div.addEventListener("click", (e) => {
          window.open(v.url);
        });

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(h4);
        div.appendChild(p1);
        div.appendChild(p);

        document.querySelector(".row_container").appendChild(div);
      }
    }
  });
}
