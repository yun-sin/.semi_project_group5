/**
 * @ File Name: include.js
 * @ Author: 박다윗 (daxxx2030@gail.com)
 * @ Last Update: 2022-10-10 17:05:00
 * @ Description: header, footer => html ajax
 */
Array.from(document.querySelectorAll("*[data-include]")).map(async (v, i) => {
    const include = v.dataset.include;
    let html = null;

    try {
        const response = await axios.get(include);
        html = response.data;
    } catch (e) {
        console.error(e);
    }

    if (html != null) {
        v.outerHTML = html;
    }
});