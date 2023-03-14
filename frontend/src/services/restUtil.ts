import { IPageRequest, IParameters } from "../types/page";

function buildFilterParams(filter: Partial<IPageRequest>): string {
    const {pageIndex, pageSize, sort, direction} = filter
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