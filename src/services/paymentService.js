import api from "./api";

export const createPaymentMomo = (subscriptionPlan, amount, orderInfo,courseId = null) => {
    return api.post(`/identity/payment/create`, {
        subscriptionPlan,
        amount,
        orderInfo,
        courseId
    });
}

export const createPaymentVnpay = (subscriptionPlan, amount, orderInfo,courseId = null) => {
    return api.post(`/identity/payment/vnpay/create`, {
        subscriptionPlan,
        amount,
        orderInfo,
        courseId
    });
}