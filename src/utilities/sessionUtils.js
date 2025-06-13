const ROLE_ID = "roleId"
const FIRST_NAME = "firstName";
const EMAIL_ID = "emailid"
const ID = "id";
const ROLE_NAME = "roleName";
const LOGIN = "login"

const getSessionValue = key => sessionStorage.getItem(key);

const setSessionValue = (key, value) => sessionStorage.setItem(key, value);

export const firstName = getSessionValue(FIRST_NAME);
export const roleId = getSessionValue(ROLE_ID);
export const emailId = getSessionValue(EMAIL_ID);
export const roleName = getSessionValue(ROLE_NAME)
export const id = getSessionValue(ID)
export const login = getSessionValue(LOGIN);

export const setFirstName = val => setSessionValue(FIRST_NAME, val);
export const setRoleId = val => setSessionValue(ROLE_ID, val);
export const setEmailId = val => setSessionValue(EMAIL_ID, val);
export const setRoleName = val => setSessionValue(ROLE_NAME, val);
export const setId = val => setSessionValue(ID, val);
export const setLogin = val => setSessionValue(LOGIN, val);
