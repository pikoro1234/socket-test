export const getEntorno = () => {
    return process.env.NODE_ENV === "production";
}