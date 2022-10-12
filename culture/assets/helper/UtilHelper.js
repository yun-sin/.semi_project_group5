class UtilHelper {
    /** 싱글톤 객체 */
    static #current = null;

    /**
     * 싱글톤 객체를 생성 후 반환한다.
     * 
     * @returns CookieHelper 타입의 객체
     */
    static getInstance() {
        if (UtilHelper.#current === null) {
            UtilHelper.#current = new UtilHelper();
        }

        return UtilHelper.#current;
    }

    getUrlParams() {
        // querystring을 객체로 변환
        const query = new URLSearchParams(location.search);

        // 생성된 객체를 JSON으로 변환
        const params = Object.fromEntries(query);

        return params;
    }
}

export default UtilHelper.getInstance();