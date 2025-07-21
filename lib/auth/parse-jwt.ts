export const parseJwt = (token: string): { nickslug?: string; sponsor?: string; sub?: string } => {
    let parsedToken = {};
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        parsedToken = JSON.parse(jsonPayload);
    } catch (e) {
        console.log(e);
    }
    return parsedToken;
} 