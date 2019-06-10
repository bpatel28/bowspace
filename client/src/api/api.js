const GetUserAuth = (Email, Username, Password) => {
    const Url = "http://localhost:5000/rest/auth";
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const Data = {
        Email, Username, Password,
    };
    const RequestOptions = {
        method: "Post",
        headers: headers,
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'error',
        body: JSON.stringify(Data)
    }
    return (Promise.resolve()).then(() => fetch(Url, RequestOptions)).then(response => response.json());
}

const GetUserList = (token) => {
    const Url = "http://localhost:5000/rest/user"
    const headers = new Headers({
        'Content-Type': 'application/json',
        'x-access-token' : token
    });
    const RequestOptions = {
        method: 'GET',
        mode: 'cors',
        cache: "no-cache",
        credentials: 'omit',
        headers: headers
    };
    return (Promise.resolve()).then(() => fetch(Url, RequestOptions)).then(response => response.json());
}

module.exports = { GetUserAuth, GetUserList }