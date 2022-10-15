import { KOPIS_KEY } from "./key.js";

/** 검색
 * queryKeyword : 유저가 입력한 검색어
 * chooseDate : 유저가 원하는 날짜
 * gerenField : 유저가 선택한 장르의 배열
 * count : 현재 출력된 검색 결과의 수
 * currentPage : 현재 검색한 API의 page (1페이지당 1000개의 data)
 */

async function search(queryKeyword, chooseDate, genreField, count, currentPage) {
  document.querySelector("#loading").classList.add("active"); // 로딩창 띄우기
  document.querySelector("#footer").style.display = "none"; // 검색시 푸터 제거

  let json = null;

  try {
    const response = await axios.get("http://api.kcisa.kr/openapi/service/rest/meta16/getkopis01", {
      params: {
        serviceKey: KOPIS_KEY,
        numOfRows: 1000,
        pageNo: currentPage,
      },
      header: {
        accept: "application/json",
      },
    });
    json = response.data.response.body.items.item;
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

  json.forEach((v, i) => {
    const period = v.temporalCoverage.split("~");

    const choosed = new Date(chooseDate);
    const startDate = new Date(period[0]);
    startDate.setFullYear(startDate.getFullYear() + 3);
    const endDate = new Date(period[1]);
    endDate.setFullYear(endDate.getFullYear() + 3);

    let A = parseInt(("" + choosed.getTime()).substring(0, 6));
    let B = parseInt(("" + startDate.getTime()).substring(0, 6));
    let C = parseInt(("" + endDate.getTime()).substring(0, 6));

    /**
     * 검색 조건에 따라 필터링
     */
    // 제목, 공연장 검색 구분
    let titleSearch = null;
    let stageSearch = null;
    let titleFilter = null;
    // 제목과 공연장 중 어떤 검색인지
    if (searchType.value == "titleSearch") {
      v.title.includes(queryKeyword) ? (titleFilter = true) : (titleFilter = false);
    } else {
      v.spatialCoverage.includes(queryKeyword) ? (titleFilter = true) : (titleFilter = false);
    }

    // 장르
    if (genreField.includes(v.subjectCategory)) {
      // 날짜 && 출력수 && 검색어
      if (A >= B && A <= C && count <= 40 && titleFilter) {
        document.querySelector("#loading").classList.remove("active"); // 로딩바 닫기

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
        let plusThreeYear = v.temporalCoverage.replaceAll("2022", "2025").replaceAll("2021", "2024").replaceAll("2020", "2023").replaceAll("2019", "2022").replaceAll("2018", "2021").replaceAll("2017", "2020");
        p.innerHTML = plusThreeYear;

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

  // 결과 최대 40개까지만 출력
  if (count < 40) {
    currentPage++;
    console.log("현재 " + count + "개의 검색 결과를 찾았으며 다음 페이지 검색을 시작합니다. page : " + currentPage + "/10");

    // 10페이지 까지만 검색 (1페이지당 1000개의 데이터이며 서버 과부화 방지)
    if (currentPage >= 10) {
      document.querySelector(".span4").innerHTML = count ? count + "개의 공연을 찾았습니다." : "";
      document.querySelector("#loading").classList.remove("active"); // 로딩바 닫기
      console.log(currentPage + "페이지까지 검색했지만 결과가 나오지 않아 검색을 중단합니다.");
      return;
    }
    search(queryKeyword, chooseDate, genreField, count, currentPage);
  }
}

export default search;
