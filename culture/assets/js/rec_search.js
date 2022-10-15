import { KOPIS_KEY } from "./key.js";

async function search(userData, currentPage, targetPage, count, currentImg) {
  let json = null;
  // console.log(userData);

  try {
    const response = await axios.get("http://api.kcisa.kr/openapi/service/rest/meta16/getkopis01", {
      params: {
        serviceKey: KOPIS_KEY,
        numOfRows: 1000,
        pageNo: currentPage,
      },
      header: {
        accept: `application/json`,
      },
    });
    json = response.data.response.body.items.item;
  } catch (e) {
    console.error(e);
    alert("요청을 처리하는데 실패했습니다.");
    return;
  }
  // console.log(json);

  json.forEach((v, i) => {
    const period = v.temporalCoverage.split("~");

    const choosed = new Date(userData.date);
    const startDate = new Date(period[0]);
    startDate.setFullYear(startDate.getFullYear() + 3);
    const endDate = new Date(period[1]);
    endDate.setFullYear(endDate.getFullYear() + 3);

    let A = BigInt(choosed.getTime());
    let B = BigInt(startDate.getTime());
    let C = BigInt(endDate.getTime());
    const A1 = ("" + A).substring(0, 6);
    const B1 = ("" + B).substring(0, 6);
    const C1 = ("" + C).substring(0, 6);

    A = parseInt(A1); // 선택
    B = parseInt(B1); // 시작
    C = parseInt(C1); // 끝

    /** 검색 조건에 따라 필터링*/
    // 장르선택
    if (userData.type.includes(v.subjectCategory)) {
      // 날짜 && 출력갯수
      if (A >= B && A <= C && count <= currentImg) {
        const div = document.createElement("div");
        div.classList.add("rec_container");
        div.classList.add("animate__animated");
        div.classList.add("animate__fadeInUp");
        count++;
        div.style.setProperty("--animate-duration", count * currentImg + 1000 + "ms");

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

  if (count < currentImg) {
    currentPage++;

    console.log("검색 결과가 부족합니다. 다음 페이지 검색을 시작합니다. page : " + currentPage);
    if (currentPage >= targetPage) {
      document.querySelector(".span4").innerHTML = count ? count + "개의 공연을 찾았습니다." : "";
      // 로딩바 닫기
      document.querySelector("#loading").classList.remove("active");
      console.log(currentPage + "페이지까지 검색했지만 결과가 나오지 않아 검색을 중단합니다.");
      return;
    }
    search(userData, currentPage, targetPage, count, currentImg);
  } else {
    console.log("[검색완료] " + currentPage + "페이지 까지 검색하여 " + count + "개의 공연을 찾았습니다.");
    // 로딩바 닫기
    document.querySelector("#loading").classList.remove("active");
    document.querySelector(".span4").innerHTML = count ? count + "개의 공연을 찾았습니다." : "";
  }
}

export default search;
