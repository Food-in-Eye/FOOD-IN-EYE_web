import axios from "axios";

const STORE_URL = "/api/v2/stores";
const FOODS_URL = "/api/v2/foods";
const ORDER_URL = "/api/v2/orders";
const MENUS_URL = "/api/v2/menus";

/** GET 메서드 */
//가게 ID에 따라 URL을 동적으로 구성하는 getStore() 함수
export const getStore = (s_id) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;
  return axios.get(requestUrl);
};

//메뉴 ID에 따라 URL을 동적으로 구성하는 getFoods() 함수
export const getFoods = (s_id) => {
  const requestUrl = `${FOODS_URL}/q?s_id=${s_id}`;
  return axios.get(requestUrl);
};

export const getFood = (f_id) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;
  return axios.get(requestUrl);
};

export const getOrders = (query) => {
  const requestUrl = `${ORDER_URL}/q${query}`;
  return axios.get(requestUrl);
};

export const getMenus = (query) => {
  const requestUrl = `${MENUS_URL}${query}`;
  return axios.get(requestUrl);
};

/** PUT 메서드 */
//가게 ID에 따라 URL을 동적으로 구성하는 putStore() 함수
export const putStore = (s_id, data) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

//메뉴 ID에 따라 URL을 동적으로 구성하는 putFoods() 함수
export const putFoods = (f_id, data) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

// 주문 status 값 업데이트
export const putOrderStatus = (o_id) => {
  const requestUrl = `${ORDER_URL}/order/status?id=${o_id}`;

  return axios.put(requestUrl);
};

//특정 가게에 새로운 음식 추가하는 postFood() 함수
export const postFood = (s_id, data) => {
  const requestUrl = `${FOODS_URL}/food?s_id=${s_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
