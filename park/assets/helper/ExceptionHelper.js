class BadRequestException extends Error {
    
    #statusCode;

    #selector;

    constructor(msg = '잘못된 요청 입니다.', selector = null) {
        super(msg);
        super.name = 'BadRequestException';
        this.#statusCode = 400;

        this.#selector = selector;
    }

    get statusCode() {
        return this.#statusCode;
    }

    get selector() {
        return this.#selector;
    }
}

export { BadRequestException };