# <img width="18" src="https://user-images.githubusercontent.com/99275134/196400858-fee3d238-c3f1-42cf-b75d-34e13432ee2e.png"/> 문화충전 


> 5조 세미 프로젝트<br>
  2022.10.07 ~ 2022.10.17
  
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white" align="right"/><img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white" align="right"/><img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=Sass&logoColor=white" align="right"/><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white" align="right"/><img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" align="right"/><br><img src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=github&logoColor=white" align="right"/><img src="https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" align="right"/><img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" align="right" />




## Team
 - [박다윗](https://github.com/daxxx00), [하가영](https://github.com/sian20), [장윤신](https://github.com/yunsinjang)


## About
 - 유저데이터를 이용해 맞춤정보 또는 직접 검색을 통해 공연정보를 제공
 
   - 데이터 : 날짜, 지역, 선호장르, 검색어(제목or공연장)

## API
 - [Kakao map](https://apis.map.kakao.com/)
 - [KOPIS_공연목록](https://www.culture.go.kr/data/openapi/openapiView.do?id=422&category=A&keyword=%EA%B3%B5%EC%97%B0&searchField=all&gubun=A#/default/%EC%9A%94%EC%B2%AD%EB%A9%94%EC%8B%9C%EC%A7%80_Get)

## Problems
 - KOPIS API 서버 하루 1000회 제한으로 인해 많은 양을 검색하거나 무한스크롤 구현시 서버가 막힘.
 
   - API 검색시 페이지 40정도로 제한을 둠.
  
   - 검색결과 없을시에 출력할 텍스트 추가

<br>

## Output
> ### index.html 
>
>  - <img width="670" alt="image" src="https://user-images.githubusercontent.com/99275134/196382930-b306852a-7477-4564-8ba0-14998c00136b.png">
> <hr>
> 
> ### form.html
>  
>  - form1
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196386163-e4163079-f42f-47ed-a65a-b9a1ad3eb4d8.png">
>  
>  - form2
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196381344-0b719ff4-c016-41bf-9f86-e4620c349ad5.png">
>  
>  - form3
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196381397-3ab75538-6b01-4dd9-b8b7-70d923563e6c.png">
> <hr>
> 
> ### rec.html
>
>  - results 
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196381477-5bd3d2f7-c399-4ece-820a-2d9e2cad4c3a.png">
>  
>  - No results found
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196385913-18cc28a3-45b8-4162-9578-d0e642092be5.png">
> <hr>
> 
> ### search.html
>  
>  - results
>   
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196380853-a21ff41b-454d-44b1-87ce-7bd5bc713086.png">
>   
>  - No results found
>  
>    <img width="669" alt="image" src="https://user-images.githubusercontent.com/99275134/196385778-7d2b2d69-3dd1-4bdf-80f6-2d7556e54882.png">
