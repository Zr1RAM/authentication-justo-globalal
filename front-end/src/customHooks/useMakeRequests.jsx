import { useCallback, useEffect, useState } from "react"
import { makeRequest } from "../axios";

export const useAxios = (url, method = 'GET', requestData = null, axiosInstance = makeRequest) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance({
                method,
                url,
                data: requestData
            });
            setResponse(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [url, method, requestData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { response, error, loading, refetch: fetchData };

}

export const makeRequests = async (url, method = 'GET', requestData = null, axiosInstance = makeRequest) => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data: requestData
        });
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};