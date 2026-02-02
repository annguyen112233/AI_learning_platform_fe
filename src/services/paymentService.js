import api from "./api";

export const createPaymentMomo = (subscriptionPlan, amount, orderInfo) => {
    return api.post(`/identity/payment/create`, {
        subscriptionPlan,
        amount,
        orderInfo
    });
}

export const createPaymentVnpay = (subscriptionPlan, amount, orderInfo) => {
    return api.post(`/identity/payment/vnpay/create`, {
        subscriptionPlan,
        amount,
        orderInfo
    });
}

export const getMyPayments = () => {
  return api.get("/identity/payment/my-payments");
};