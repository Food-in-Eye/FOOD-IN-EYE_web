import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import CalculateHeight from "../components/CalculateScreensHeight.module";
import gazeData from "../data/gaze_data.json";
import fixData from "../data/fixation data.json";
import heatmap from "heatmap.js";
import axios from "axios";

import { useState, useEffect } from "react";
import { getFilteredGaze } from "../components/API.module";
import { getGaze } from "../components/API.module";

function VisualizeGazePage() {
  const pages = ["store_list", "store_menu", "menu_detail"];
  const [fileList, setFileList] = useState([]);
  const [divHeights, setDivHeights] = useState([]);
  const [gazeData, setGazeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getJsonFiles = async () => {
      try {
        const response = await getGaze(`?prefix=C_0714&extension=.json`);
        console.log(response.data);
        setFileList(response.data);
      } catch (error) {
        console.error("Error getting file names from api: ", error);
      }
    };

    getJsonFiles();
  }, []);

  const handleInputValues = async (event) => {
    event.preventDefault();

    const key = document.getElementById("key").value;
    const winSize = document.getElementById("winSize").value;
    const fixDist = document.getElementById("fixDist").value;

    try {
      await getFilteredGaze(
        `?key=${key}&win_size=${winSize}&fix_dist=${fixDist}`
      ).then((res) => {
        setFilteredData(res);
      });
    } catch (error) {
      console.error("Error getting data from anlyz:", error);
    }

    try {
      await getGaze(`/gaze?key=${key}`).then((res) =>
        setGazeData(res.data.response)
      );
    } catch (error) {
      console.error("Error fetching data from S3:", error);
    }
  };

  /**TODO: gazeData 형식 확인 후 다시 체크 */

  useEffect(() => {
    const heights = pages.map((page) => {
      const pageFilteredData = gazeData.filter((item) => item.page === page);
      if (pageFilteredData && pageFilteredData.length > 0) {
        const calculatedHeight = CalculateHeight(pageFilteredData);
        // console.log(calculatedHeight);
        return calculatedHeight;
      } else {
        return 0;
      }
    });

    setDivHeights(heights);
  }, [gazeData]);

  return (
    <div>
      <MenuBar />
      <div>
        <section className={VisualizeGaze.head}>
          <h1>화면별 gaze-plot</h1>
          <div className={VisualizeGaze.inputs}>
            <label>
              key: <input id="key" type="text" name="key" required />
            </label>
            <label>
              window-size:{" "}
              <input id="winSize" type="text" name="window-size" required />
            </label>
            <label>
              fixation-distance:{" "}
              <input
                id="fixDist"
                type="text"
                name="fixation-distance"
                required
              />
            </label>
            <button id="submit" onClick={handleInputValues}>
              Submit
            </button>
          </div>
        </section>

        <section className={VisualizeGaze.screensBeforeFilter}>
          {divHeights.map((divHeight, index) => {
            const filteredGazeData = gazeData
              .filter((item) => item.page === pages[index])
              .flatMap((item) =>
                item.gaze.filter(
                  (point) =>
                    point.x >= 0 &&
                    point.x <= 643.2 &&
                    point.y >= 0 &&
                    point.y <= divHeight
                )
              );

            return (
              <div
                key={index}
                className={`${VisualizeGaze.gazePlot} ${VisualizeGaze.gazePlotRow}`}
                style={{ height: divHeight }}
              >
                <div className={VisualizeGaze.gazeScreenName}>
                  {pages[index]}
                </div>
                {filteredGazeData.map((point, idx) => (
                  <div
                    key={`${idx}`}
                    className={VisualizeGaze.gazePoint}
                    style={{
                      left: `${(point.x / 643.2) * 100}%`,
                      top: `${(point.y / divHeight) * 100}%`,
                    }}
                    title={pages[index]}
                  ></div>
                ))}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default VisualizeGazePage;
