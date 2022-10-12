/**
 * @ File Name: logo-animation.js
 * @ Author: 박다윗 (daxxx2030@gail.com)
 * @ Last Update: 2022-10-10 17:05:00
 * @ Description: header 좌측 배터리 모양 로고 슬라이드 애니메이션
 */
"use strict";

// header logo 애니메이션 클래스
class logoAnimation {
    // header logo mouseover
    logoOver() {
        document.querySelector('#battery').addEventListener('mouseover', e => {
            // header logo title display inline-block
            document.querySelector('#cc').style.display = 'inline-block';
            // 애니메이션 이름 변경
            document.querySelector('#header_logo').style.animationName = 'over';
        });
    }
    // header logo mouseout
    logoOut() {
        document.querySelector('#battery').addEventListener('mouseout', e => {
            // 애니메이션 이름 변경
            document.querySelector('#header_logo').style.animationName = 'out';
            // header logo title display none
            document.querySelector('#cc').style.display = 'none';
        });
    }
}

export default new logoAnimation();