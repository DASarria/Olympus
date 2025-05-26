const API = "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net";
const APIUser = "https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net";

const endPointUser = {
    login: '/authentication/login',
    findUsers: '/user/query'
}

const endPointActivity = {
    update: '/api/activity/update',
    create: '/api/activity/',
    find: '/api/activity/find/options',
    all: '/api/activity/all',
    delete: '/api/activity/activities'
}

const endPointAssistance = {
    confirm: '/api/assistance/update/confirm',
    confirmAll: '/api/assistance/confirm/all',
    createTeacher: '/api/assistance/newAssistance',
    createStudent: '/api/assistance/newAssistance/student',
    find: '/api/assistance/find/options',
    delete: '/api/assistance/delete'
}

export {API, APIUser, endPointUser, endPointActivity, endPointAssistance};