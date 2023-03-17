import { IFilterParams, IPage, IPageRequest } from "../types/page";
import axios, { AxiosPromise } from "axios";
import buildFilterParams from "./restUtil";
import { ICheckout } from "../types/checkout";

const baseUrl = `http://localhost:8080/api/checkout`

function getCheckouts(filter: Partial<IFilterParams>): AxiosPromise<IPage<ICheckout>> {
    const url = baseUrl + '/getCheckouts'
    const params = buildFilterParams(filter)
    return axios.get(url + params)
}

function getCheckout(checkoutId: string): AxiosPromise<ICheckout> {
    const url = baseUrl + '/getCheckout'
    const params = `?checkOutId=${checkoutId}`
    return axios.get(url + params)
}

function saveCheckout(checkout: any): AxiosPromise<void> {
    const url = baseUrl + '/checkout'
    return axios.post(url, checkout)
}

function deleteCheckout(checkOutId: string): AxiosPromise<void> {
    const url = baseUrl + '/checkout'
    const params = `?checkOutId=${checkOutId}`
    return axios.delete(url + params)
}

export {
    getCheckouts,
    getCheckout,
    saveCheckout,
    deleteCheckout
}