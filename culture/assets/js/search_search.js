import { KOPIS_KEY } from "./key.js";

async function search(userData, currentPage, targetPage, count, currentImg) {
  const list = document.querySelector("#show_list");

  // 로딩창 띄우기
  document.querySelector("#loading").classList.add("active");
  // 검색시 이전 검색 결과 제거
  document.querySelector(".row_container").innerHTML = "";
  // 검색시 푸터 제거
  document.querySelector("#footer").style.display = "none";

  let json = null;

  try {
    const response = await axios.get("http://api.kcisa.kr/openapi/service/rest/meta16/getkopis01", {
      params: {
        serviceKey: KOPIS_KEY,
        numOfRows: 5,
        pageNo: currentPage,
      },
      header: {
        accept: "application/json",
      },
    });
    json = response.data.response.body.items.item;
    console.log(json);
  } catch (error) {
    console.error(`[Error Code] ${error.code}`);
    console.error(`[Error Message] ${error.message}`);
    let alertMsg = error.message;

    if (error.response !== undefined) {
      const errorMsg = `${error.response.status} error - ${error.response.statusText}`;
      console.error(`[HTTP Status] ${errorMsg}`);
      alertMsg += `\n${errorMsg}`;
    }
    alert(alertMsg);
    return;
  }
  console.log(json);

  // 변수
  console.log("queryKeyword : " + queryKeyword + "\nchooseDate : " + chooseDate + "\ngenreField : " + genreField);
  // 검색어 : queryKeyword
  // 선택 날짜 : chooseDate
  // 선택 장르 : genreField

  json.forEach((v, i) => {
    // console.log(v.temporalCoverage);
    const period = v.temporalCoverage.split("~");
    // console.log(period);
    const choosed = new Date(chooseDate);
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
    // if (count <= currentImg) {
    // 날짜선택
    // console.log("시작일" + startDate.getTime());
    // console.log("선택일" + choosed.getTime());
    // console.log("마감일" + endDate.getTime());
    // console.log(v.subjectCategory);

    let titleFilter = null;
    const searchType = document.querySelector("#searchType");
    console.log(searchType.value == "titleSearch");

    if (searchType.value == "titleSearch") {
      // console.log("제목으로 검색합니다.");
      v.title.includes(queryKeyword) ? (titleFilter = true) : (titleFilter = false);
    } else {
      // console.log("공연장 이름으로 검색합니다.");
      v.spatialCoverage.includes(queryKeyword) ? (titleFilter = true) : (titleFilter = false);
    }

    if (genreField.includes(v.subjectCategory)) {
      // console.log(v.subjectCategory);
      // 장르선택
      // if (A >= B && A <= C && count <= 30) {
      if (A >= B && A <= C && count <= 40 && titleFilter) {
        document.querySelector("#loading").classList.remove("active");

        console.log(v.temporalCoverage);
        console.log("title: " + v.title + " , stage : " + v.spatialCoverage);
        // 검색어

        console.log("공연장 이름으로 검색합니다.");

        // if (v.title.includes(queryKeyword) || v.spatialCoverage.includes(queryKeyword)) {
        const div = document.createElement("div");
        div.classList.add("rec_container");
        div.classList.add("animate__animated");
        div.classList.add("animate__fadeInUp");
        div.style.setProperty("--animate-duration", count * 100 + 1000 + "ms");
        count++;
        // console.log(count);

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

export default search;
