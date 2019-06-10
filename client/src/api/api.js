const GetUserAuth = (Email, Username, Password) => {
    const Url = "http://localhost:5000/rest/auth";
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const Data = {
        Email, Username, Password,
    };
    return (Promise.resolve())
                .then(() => {
                    const RequestOptions = {
                        method: "Post", headers: headers, cache: 'no-cache', mode: 'cors', credentials: 'omit', redirect: 'error', body: JSON.stringify(Data)
                    }
                    return fetch(Url, RequestOptions);
                }).then(response => response.json());
}

module.exports = { GetUserAuth }