import { reactive } from 'vue';


interface LoggedUser {
    token?: string;
    username?: string;
    id?: string;
    foto_profilo?: string;
}


const loggedUser = reactive<LoggedUser>({
    token: undefined,
    username: undefined,
    id: undefined,
    foto_profilo: undefined
});


function setLoggedUser(data: LoggedUser): void {
    loggedUser.token = data.token;
    loggedUser.username = data.username;
    loggedUser.id = data.id;
    loggedUser.foto_profilo = data.foto_profilo;
}


function clearLoggedUser(): void {
    loggedUser.token = undefined;
    loggedUser.username = undefined;
    loggedUser.id = undefined;
    loggedUser.foto_profilo = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser };
