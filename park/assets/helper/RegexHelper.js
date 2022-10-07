import { BadRequestException } from "./ExceptionHelper.js";

class RegexHelper {
    static #current = null;

    static getInstance() {
        if (RegexHelper.#current === null) {
            RegexHelper.#current = new RegexHelper();
        }

        return RegexHelper.#current;
    }

    /**
     * 
     * @param {HTMLElement} field
     * @param {string} msg
     * @returns 
     */
    value(field, msg) {
        const content = field.value;

        if (content == undefined || content == null || (typeof content == 'string' && content.trim().length === 0)) {
            throw new BadRequestException(msg, field);
        }

        return true;
    }

    /**
     * 
     * @param {HTMLElement} field
     * @param {int} len
     * @param {string} msg
     * @returns 
     */
    maxLength(field, len, msg) {
        this.value(field, msg);
        const content = field.value;
        
        if (content.trim().length > len) {
            throw new BadRequestException(msg, field);
        }

        return true;
    }

    /**
     * 
     * @param {HTMLElement} field
     * @param {int} len 
     * @param {string} msg 
     * @returns 
     */
    minLength(field, len, msg) {
        this.value(field, msg);
        let content = field.value;

        if (content.trim().length < len) {
            throw new BadRequestException(msg, field);
        }

        return true;
    }

    /**
     * 
     * @param {string} origin 
     * @param {string} compare 
     * @param {string} msg 
     * @returns 
     */
    compareTo(origin, compare, msg) {
        this.value(origin, msg);
        this.value(compare, msg);

        var src = origin.trim();
        var dsc = compare.trim();

        if (src != dsc) {
            throw new BadRequestException(msg, origin);
        }

        return true;
    }

    /**
     * 
     * @param {NodeList} field 
     * @param {string} msg 
     */
    check(field, msg) {
        const checkedItem = Array.from(field).filter((v, i) => v.checked);

        if (checkedItem.length === 0) {
            throw new BadRequestException(msg, field[0]);
        }
    }

    /**
     * 
     * @param {NodeList} field 
     * @param {*} len 
     * @param {string} msg 
     */
    checkMin(field, len, msg) {
        const checkedItem = Array.from(field).filter((v, i) => v. checked);

        if (checkedItem.length < len) {
            throw new BadRequestException(msg, field[0]);
        }
    }

    /**
     * 
     * @param {NodeList} field 
     * @param {*} len 
     * @param {string} msg 
     */
    checkMax(field, len, msg) {
        const checkedItem = Array.from(field).filter((v, i) => v. checked);

        if (checkedItem.length > len) {
            throw new BadRequestException(msg, field[0]);
        }
    }

    /**
     * 
     * @param {HTMLElement} field  
     * @param {string} msg 
     * @param {object} regexExpr 
     * @returns 
     */
    field(field, msg, regexExpr) {
        this.value(field, msg);

        if (!regexExpr.test(field.value.trim())) {
            throw new BadRequestException(msg, field);
        }

        return true;
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    num(field, msg) {
        return this.field(field, msg, /^[0-9]*$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    eng(field, msg) {
        return this.field(field, msg, /^[a-zA-Z]*$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    kor(field, msg) {
        return this.field(field, msg, /^[ㄱ-ㅎ가-힣]*$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    engNum(field, msg) {
        return this.field(field, msg, /^[a-zA-Z0-9]*$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    korNum(field, msg) {
        return this.field(field, msg, /^[ㄱ-ㅎ가-힣0-9]*$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    email(field, msg) {
        return this.field(field, msg, /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    cellphone(field, msg) {
        return this.field(field, msg, /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    telphone(field, msg) {
        return this.field(field, msg, /^\d{2,3}\d{3,4}\d{4}$/);
    }

    /**
     * 
     * @param {HTMLElement} field 
     * @param {string} msg 
     * @returns 
     */
    phone(field, msg) {
        this.value(field, msg);
        const content = field.value.trim();

        var check1 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        var check2 = /^\d{2,3}\d{3,4}\d{4}$/;

        if (!check1.test(content) && !check2.test(content)) {
            throw new BadRequestException(msg, field);
        }
        return true;
    }
}

export default RegexHelper;