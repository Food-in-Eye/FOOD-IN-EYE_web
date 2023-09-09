import MenuBar from "../components/MenuBar";
import Order from "../css/OrderManage.module.css";
import Button from "../css/Button.module.css";
import OrdersHistoryTable from "../components/OrderTable.module";
import { getOrderHistory } from "../components/API.module";
import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import "../css/Paging.css";
import useTokenRefresh from "../components/useTokenRefresh";

function OrderManagePage() {
  useTokenRefresh();

  const sID = localStorage.getItem("s_id");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;
  const [orderHistoryList, setOrderHistoryList] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [isRecentSortClicked, setRecentSortClicked] = useState(false);
  const [isLastSortClicked, setLastSortClicked] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePageChange = (newPageNumber) => {
    setCurrentPage(newPageNumber);
  };

  const getHistory = (sID, batch) => {
    getOrderHistory(`dates?s_id=${sID}&batch=${batch}`).then((res) => {
      setPageCount(res.data.max_batch);

      setOrderHistoryList(res.data.order_list);
    });
  };

  useEffect(() => {
    getHistory(sID, currentPage);
  }, [currentPage]);

  /**현재 페이지에 해당하는 주문 목록만 렌더링 */
  const renderOrderList = () => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    // const endIndex = startIndex + ordersPerPage;

    return orderHistoryList.map((order, index) => (
      <li
        key={`order_${startIndex + index}`}
        onClick={(e) => handleOrderClick(e, order.date, startIndex + index)}
        className={
          selectedOrderIndex === startIndex + index ? Order.selectedOrder : null
        }
      >
        <span>{order.date}</span>
        <span>{order.total_price}원</span>
      </li>
    ));
  };

  /** 정렬을 위한 string->Date */
  const tStringToTime = (tString) => {
    const [hours, minutes, seconds] = tString.split(":");
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  };

  const handleDateRecent = (e) => {
    e.preventDefault();

    if (!isRecentSortClicked) {
      const sortedOrderHistory = [...orderHistory].sort(
        (a, b) => tStringToTime(b["orderTime"]) - tStringToTime(a["orderTime"])
      );
      setOrderHistory(sortedOrderHistory);

      setRecentSortClicked(true);
      setLastSortClicked(false);
    }
  };

  const handleDateLast = (e) => {
    e.preventDefault();

    if (!isLastSortClicked) {
      const sortedOrderHistory = [...orderHistory].sort(
        (a, b) => tStringToTime(a["orderTime"]) - tStringToTime(b["orderTime"])
      );
      setOrderHistory(sortedOrderHistory);
      setRecentSortClicked(false);
      setLastSortClicked(true);
    }
  };

  const fetchOrderDetails = async (date) => {
    const res = await getOrderHistory(`date?s_id=${sID}&date=${date}`);
    const orderDetails = res.data.order_list;
    const orderData = orderDetails.map((data) => ({
      orderTime: data.date.slice(11, 19),
      // DELETE LATER: 이전 주문 중 f_name이 없는 data를 위한 f_id 남겨놓은 상태
      orderMenus: `${
        data.detail[0].f_name ? data.detail[0].f_name : data.detail[0].f_id
      } ${data.detail[0].count}개`,
      orderPrice: data.detail[0].price * data.detail[0].count,
    }));

    return orderData;
  };

  const handleOrderClick = async (e, date, index) => {
    e.preventDefault();

    const orderData = await fetchOrderDetails(date);
    setOrderHistory(orderData);
    setSelectedOrderIndex(index);

    setRecentSortClicked(true);
    setLastSortClicked(false);
  };

  const handleDateRange = async (e) => {
    e.preventDefault();

    setSelectedOrderIndex(null);
    setOrderHistory([]);

    const res = await getOrderHistory(
      `dates?s_id=${sID}&start_date=${startDate}&end_date=${endDate}`
    );
    setOrderHistoryList(res.data.order_list);
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <section className={Order.body}>
        <div className={Order.historyHead}>
          <h3>누적 주문 내역</h3>
          <form onSubmit={handleDateRange}>
            <div className={Order.CheckDate}>
              <label>
                시작일
                <input
                  type="date"
                  name="dates"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                종료일
                <input
                  type="date"
                  name="dates"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <button type="submit" className={Order.submitCheckedDate}>
                조회
              </button>
            </div>
          </form>
        </div>
        <div className={Order.historyBody}>
          <div className={Order.historyBodyTop}>
            <section className={Order.sortButtons}>
              <button
                onClick={handleDateRecent}
                className={
                  isRecentSortClicked
                    ? Button.activeSortBtn
                    : Button.inactiveSortBtn
                }
              >
                최신순
              </button>
              <button
                onClick={handleDateLast}
                className={
                  isLastSortClicked
                    ? Button.activeSortBtn
                    : Button.inactiveSortBtn
                }
              >
                날짜순
              </button>
            </section>
          </div>
          <div className={Order.historyBodyBottom}>
            <section className={Order.leftHBody}>
              <div className={Order.orderList}>
                <ul className={Order.orderUl}>{renderOrderList()}</ul>
                <div className={Order.pageFooter}>
                  {pageCount >= 1 && (
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={ordersPerPage}
                      totalItemsCount={pageCount * ordersPerPage}
                      pageRangeDisplayed={5}
                      prevPageText={"<"}
                      nextPageText={">"}
                      onChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
              <div className={Order.verticalLine}></div>
            </section>
            <section className={Order.rightHBody}>
              <OrdersHistoryTable data={orderHistory} />
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderManagePage;
