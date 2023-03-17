import { IFilterParams, IParameters } from "../types/page";

function buildFilterParams(filter: Partial<IFilterParams>): string {
    const {pageIndex, pageSize, sort, direction, title, author, genre, year, status} = filter
    const paramsMap = new Map<IParameters, string>()
    let params = ""

    if (pageIndex != null) {
        paramsMap.set("page", String(pageIndex))
    }
    if (pageSize != null) {
        paramsMap.set("size", String(pageSize))
    }
    if (sort != null) {
        paramsMap.set("sort", sort + ',' + direction ?? '')
    }
    if (title != null && title !== "") {
        paramsMap.set("title", String(title))
    }
    if (author != null && author !== "") {
        paramsMap.set("author", String(author))
    }
    if (genre != null && genre !== "") {
        paramsMap.set("genre", String(genre))
    }
    if (year != null && year) {
        paramsMap.set("year", String(year))
    }
    if (status != null && status !== "") {
        paramsMap.set("status", String(status))
    }

    paramsMap.forEach((value, key) => {
        if (params === "") {
            params = "?" + key + "=" + value
        } else {
            params += "&" + key + "=" + value
        }
    })

    return params;
}


export default buildFilterParams