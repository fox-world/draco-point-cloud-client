import { request } from './axios_tools';

export const loadDataInfo = async (url) => {
    try {
        const { data: response } = await request.get(url);
        return response;
    } catch (error) {
        console.log(error);
    }
}