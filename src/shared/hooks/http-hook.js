import { useState, useCallback, useRef } from "react"

export const useHttpClient = (event) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback(async (
        url,
        method = 'GET',
        body = null,
        headers = {}
    ) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl)
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response.ok) {
                throw new Error(responseData.error || responseData.errors[0].msg);
            };

            setIsLoading(false);
            return responseData
        } catch (error) {
            console.log(error)
            setError(error.message)
            setIsLoading(false);
            throw error
        }
    }, []);

    const clearError = (event) => {
        // event.preventDefault();
        setError(null);
    }

    // useEffect(() => {
    //     return () => {
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    //         activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    //     };
    // }, []);

    return { isLoading, error, sendRequest, clearError };
};
