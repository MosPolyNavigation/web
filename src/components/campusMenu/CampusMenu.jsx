import React, { useEffect, useState } from "react";

//components
import CampusList from "../campusList/CampusList";
import Button from "../button/Button";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";

//images
import heartIcon from "../../images/heartIcon.svg";
import closeLargeIcon from "../../images/closeLargeIcon.svg";

//plans B
import planBOne from "../../plansBs/B/B-1.svg";
import planBTwo from "../../plansBs/B/B-2.svg";
import planBThree from "../../plansBs/B/B-3.svg";
import planBFour from "../../plansBs/B/B-4.svg";

//plans N
import planNZero from "../../plansBs/N/N-0.svg";
import planNOne from "../../plansBs/N/N-1.svg";
import planNTwo from "../../plansBs/N/N-2.svg";
import planNThree from "../../plansBs/N/N-3.svg";
import planNFour from "../../plansBs/N/N-4.svg";
import planNFive from "../../plansBs/N/N-5.svg";

//plans V
import planVOne from "../../plansBs/V/V-1.svg";
import planVTwo from "../../plansBs/V/V-2.svg";
import planVThree from "../../plansBs/V/V-3.svg";
import planVFour from "../../plansBs/V/V-4.svg";
import planVFive from "../../plansBs/V/V-5.svg";

//plans A
import planAZero from "../../plansBs/А/A-0.svg";
import planAOne from "../../plansBs/А/A-1.svg";
import planATwo from "../../plansBs/А/A-2.svg";
import planAThree from "../../plansBs/А/A-3.svg";
import planAFour from "../../plansBs/А/A-4.svg";

//plans
import NavData from "https://mospolynavigation.github.io/navigationData/NavData.js";

const CampusMenu = ({
  setCurrCorpus,
  currentLocateInfo,
  setIsShowCampusMenu,
  setIsShowAddInfo,
  setIsShowSearch,
  isShowAddInfo,
  floors,
  setFloors,
  floorsImages,
  setFloorsImages,
  isActive,
  setIsActive,
}) => {
  // const [campuses] = useState([
  //   {
  //     name: "на Большой Семеновской",
  //     notation: "БС",
  //     address: "ул. Большая Семеновская, д. 38",
  //     buildings: ["А", "Б", "В", "Н", "НД"],
  //   },
  //   {
  //     name: "на Автозаводской",
  //     notation: "Ав",
  //     address: "ул. Автозаводская, д. 16",
  //     buildings: ["1", "2", "3", "4", "5"],
  //   },
  //   {
  //     name: "на Павла Корчагина",
  //     notation: "Пк",
  //     address: "ул. Павла Корчагина, д. 22",
  //     buildings: ["1", "2", "3", "4", "5"],
  //   },
  //   {
  //     name: "на Прянишникова",
  //     notation: "Пр",
  //     address: "ул. Прянишникова, д. 2А",
  //     buildings: ["1", "2", "3"],
  //   },
  //   {
  //     name: "на Михалковской",
  //     notation: "М",
  //     address: "ул. Михалковская, 7",
  //     buildings: ["1", "2"],
  //   },
  // ]);

  const [plans, setPlans] = useState([]);

  class Data {
    campuses = new Map();
    plans = new Map();
    status = false;
    importedVertexes = [];

    constructor() {}

    async getData() {
      function concatVertexesFromAllPlans(plans) {
        let vertexes = [];
        for (const planData of plans.values()) {
          vertexes.push(...planData.graph);
        }
        return vertexes;
      }

      await NavData.loadCampusesDataAsync().then((resultData) => {
        this.plans = resultData.plans;
        this.campuses = resultData.campuses;
        this.#addPlansNamesToEveryVertexes();
        this.importedVertexes = concatVertexesFromAllPlans(this.plans);
        this.status = true;
        // this.campuses.set("PR", {
        //   id: "ПР",
        //   rusName: "ПР",
        //   rusFullName: "на Прянишникова",
        //   address: "ул. Прянишникова, д. 2А",
        //   corpuses: {
        //     B: { rusName: "Б", planLinks: [mapOne, mapOne, mapOne] },
        //     A: { rusName: "А", planLinks: [mapTwo, mapOne, mapTwo] },
        //     G: { rusName: "Г", planLinks: [mapTwo, mapOne, mapTwo] },
        //   },
        // });
        this.campuses.set("BS", {
          id: "БС",
          rusName: "БС",
          rusFullName: "на Большой Семеновской",
          address: "ул. Большая Семеновская, д. 38",
          corpuses: {
            B: {
              rusName: "Б",
              planLinks: [planBOne, planBTwo, planBThree, planBFour],
            },
            N: {
              rusName: "Н",
              planLinks: [
                planNZero,
                planNOne,
                planNTwo,
                planNThree,
                planNFour,
                planNFive,
              ],
            },
            V: {
              rusName: "В",
              planLinks: [planVOne, planVTwo, planVThree, planVFour, planVFive],
            },
            A: {
              rusName: "А",
              planLinks: [planAZero, planAOne, planATwo, planAThree, planAFour],
            },
          },
        });
        // this.campuses.set("AV", {
        //   id: "АВ",
        //   rusName: "АВ",
        //   rusFullName: "на Автозаводской",
        //   address: "ул. Автозаводская, д. 16",
        //   corpuses: {
        //     C: { rusName: "С", planLinks: [mapOne, mapTwo, mapTwo] },
        //     F: { rusName: "Ф", planLinks: [mapTwo, mapTwo, mapTwo] },
        //     E: { rusName: "Е", planLinks: [mapTwo, mapOne, mapTwo] },
        //   },
        // });
        // console.log("Данные загружены", this);
      });
    }

    #addPlansNamesToEveryVertexes() {
      for (const [planName, planData] of this.plans) {
        // console.log("Добавляю в общий граф", planName, planData.graph);
        for (const importedVertex of planData.graph) {
          importedVertex.planName = planName;
        }
      }
    }

    getPlan(planName = "") {
      return this.plans.get(planName);
    }
  }

  // let data = new Data();
  // let testData = data.getData();
  // console.log(testData);

  // import NavData from "http://127.0.0.1:5500/NavData.js"

  // class Data {
  //   campuses = new Map();
  //   plans = new Map();
  //   status = false;
  //   importedVertexes = [];

  //   constructor() {}

  //   async getData() {
  //     function concatVertexesFromAllPlans(plans) {
  //       let vertexes = [];
  //       for (const planData of plans.values()) {
  //         vertexes.push(...planData.graph);
  //       }
  //       return vertexes;
  //     }

  //     await NavData.loadCampusesDataAsync().then((resultData) => {
  //       this.plans = resultData.plans;
  //       this.campuses = resultData.campuses;
  //       this.#addPlansNamesToEveryVertexes();
  //       this.importedVertexes = concatVertexesFromAllPlans(this.plans);
  //       this.status = true;
  //       console.log('Данные загружены', this)
  //     });
  //   }

  //   #addPlansNamesToEveryVertexes() {
  //     for (const [planName, planData] of this.plans) {
  //       // console.log('Добавляю в общий граф', planName, planData.graph)
  //       for (const importedVertex of planData.graph) {
  //         importedVertex.planName = planName;
  //       }
  //     }
  //   }

  //   getPlan(planName = "") {
  //     return this.plans.get(planName);
  //   }
  // }

  let data = new Data();

  // let dataTest = new Data()

  // dataTest.getData().then((result) => {
  //   console.log(result);
  // });

  useEffect(() => {
    data.getData().then(() => {
      for (let currCampus of data.campuses) {
        let currCampusObj = {};
        currCampusObj = {
          name: currCampus[1].rusFullName,
          notation: currCampus[1].rusName,
          address: currCampus[1].address,
          buildings: Object.values(currCampus[1].corpuses).map(
            (building) => building.rusName
          ),
          maps: Object.values(currCampus[1].corpuses).map(
            (obj) => obj.planLinks
          ),
        };

        setPlans((prevPlans) => [...prevPlans, currCampusObj]);
      }
      console.log(plans);
    });
  }, []);

  return (
    <div className="CampusMenu__content">
      <div className="CampusMenu__block">
        <CampusList
        setCurrCorpus={setCurrCorpus}
          campuses={plans}
          currentLocateInfo={currentLocateInfo}
          floors={floors}
          setFloors={setFloors}
          floorsImages={floorsImages}
          setFloorsImages={setFloorsImages}
          isActive={isActive}
          setIsActive={setIsActive}
          setIsShowCampusMenu={setIsShowCampusMenu}
        ></CampusList>
      </div>

      <div className="CampusMenu__buttons">
        <div
          onClick={() => setIsShowAddInfo((prev) => !prev)}
          className="CampusMenu__button"
        >
          <Button icon={heartIcon} />
        </div>
        <div
          className="searchPsevdoInput_wrapper"
          onClick={() => setIsShowSearch((prev) => !prev)}
        >
          <SearchPsevdoInput />
        </div>
        <div
          className="CampusMenu__button"
          onClick={() => setIsShowCampusMenu((prev) => !prev)}
        >
          <Button icon={closeLargeIcon} />
        </div>
      </div>
      <div
        className={`additionalInfo__wrapper ${
          isShowAddInfo ? "showAddInfo" : "hideAddInfo"
        }`}
      >
        <AdditionalInfo
          isShowAddInfo={isShowAddInfo}
          setIsShowAddInfo={setIsShowAddInfo}
          nameAudience={"Н405 - Аудитория"}
          descAudience={"Корпус Н, 4-й этаж"}
        />
      </div>
    </div>
  );
};

export default CampusMenu;
