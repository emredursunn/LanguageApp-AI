import { api } from "./api";

export const register = async ({
  name,
  surname,
  email,
  phone,
  username,
  password,
  password2,
}: {
  name: string;
  surname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  password2: string;
}) => {
  const response = await api.post("/auth/register", {
    name,
    surname,
    email,
    phone,
    username,
    password,
    password2,
  });

  return response.data;
};

export const registerResendVerify = async ({ email }: { email: string }) => {
  const response = await api.post("/auth/register-resend-verify", {
    email,
  });

  return response.data;
};

export const registerVerify = async ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  const response = await api.post("/auth/register-verify", {
    email,
    code,
  });

  return response.data;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const loginWithToken = async () => {
  const response = await api.post("/auth/login-with-token");
  return response.data;
};

export const forgetPasswordEmailVerification = async ({
  email,
}: {
  email: string;
}) => {
  const response = await api.post("/auth/forget-password-email-verification", {
    email,
  });

  return response.data;
};

export const forgetPasswordResendVerify = async ({
  email,
}: {
  email: string;
}) => {
  const response = await api.post("/auth/forget-password-resend-verify", {
    email,
  });

  return response.data;
};

export const forgetPasswordVerify = async ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  const response = await api.post("/auth/forget-password-verify", {
    email,
    code,
  });

  return response.data;
};

export const forgetPasswordResetPassword = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) => {
  const response = await api.post("/auth/forget-password-reset-password", {
    email,
    newPassword,
  });

  return response.data;
};

export const passwordUpdate = async ({
  newPassword,
}: {
  newPassword: string;
}) => {
  const response = await api.put("/auth/password-update", {
    newPassword,
  });

  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const deactive = async () => {
  const response = await api.post("/auth/deactive");
  return response.data;
};