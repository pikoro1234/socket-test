export const customFetch = async (method, uri, headers, body) => {

    try {

        const response = await fetch(uri, {
            method,
            headers,
            ...(method !== "GET" && { body: JSON.stringify(body) }),
        })

        const result = await response.json();

        return {
            status: response.status,
            success: response.ok,
            data: result,
        };

    } catch (error) {
        console.log("Error al obtener los workspace");
        console.log(error);
        return {
            status: 500,
            success: false,
            data: { message: "Error comm Client/Server" },
        };
    }
}