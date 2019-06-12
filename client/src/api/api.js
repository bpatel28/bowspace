const GetUserAuth = (Email, UserName, Password) => {
    const Url = "http://localhost:5000/rest/auth";
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const Data = {
        Email, UserName, Password,
    };
    const RequestOptions = {
        method: "POST",
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
    const Url = "http://localhost:5000/rest/user";
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

const GetPosts = (token, ReceiverId) => {
    const Url = "http://localhost:5000/rest/post?";
    const headers = new Headers({
        'Content-Type': 'application/json',
        'x-access-token': token
    });
    const RequestOptions = {
        method: 'GET',
        mode: 'cors',
        cache: "no-cache",
        credentials: 'omit',
        headers: headers
    };
    const params = `ReceiverId=${ReceiverId}`;
    return (Promise.resolve()).then(() => fetch(Url + params, RequestOptions)).then(response => response.json());
}

const SendPost = (token, SenderId, ReceiverId, PostHtml) => {
    const Url = "http://localhost:5000/rest/post";
    const headers = new Headers({
        'Content-Type': 'application/json',
        'x-access-token': token
    });
    const Data = {
        SenderId,
        ReceiverId,
        PostHtml
    }
    const RequestOptions = {
        method: "PUT",
        headers: headers,
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'error',
        body: JSON.stringify(Data)
    }
    return (Promise.resolve()).then(() => fetch(Url, RequestOptions)).then(response => response.json());
}

const RegisterUser = (data) => {
    const Url = "http://localhost:5000/rest/register-user";
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const RequestOptions = {
        method: "PUT",
        headers: headers,
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'error',
        body: JSON.stringify(data)
    }
    return (Promise.resolve()).then(() => fetch(Url, RequestOptions)).then(response => response.json());
}

module.exports = { GetUserAuth, GetUserList, GetPosts, SendPost, RegisterUser }