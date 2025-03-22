import React, { useState, useMemo, useEffect } from "react";
import cl from "./ReportPage.module.scss";
import { useDataStore } from "../../store/useDataStore";
import Button from "../../components/buttons/LargeButton/Button";
import { Color } from "../../constants/enums";
import { Link } from "react-router-dom";
import { IconLink } from "../../constants/IconLink";
import IconButton from "../../components/buttons/IconButton/IconButton";

const ReportPage: React.FC = () => {
    const [problemType, setProblemType] = useState<string>(""); // Тип проблемы
    const [description, setDescription] = useState<string>(""); // Описание проблемы
    const [selectedBuilding, setSelectedBuilding] = useState<string>(""); // Выбранный корпус
    const [selectedFloor, setSelectedFloor] = useState<string>(""); // Выбранный этаж

    // useEffect(() => {
    //     useDataStore.getState().fetchData();
    // }, []);

    const corpuses = useDataStore((state) => state.corpuses);

    const plans = useDataStore((state) => state.plans);

    const isLoading = corpuses.length === 0 || plans.length === 0;

    const buildings = useMemo(() => {
        return corpuses.map((corpus) => corpus.title);
    }, [corpuses]);

    const filteredFloors = useMemo(() => {
        if (!selectedBuilding) return [];
        return plans
            .filter((plan) => plan.corpus.title === selectedBuilding)
            .map((plan) => plan.floor.toString());
    }, [plans, selectedBuilding]);

    const handleSubmit = () => {
        console.log({
            problemType,
            description,
            selectedBuilding,
            selectedFloor,
        });
        // TODO: API
        alert("Проблема отправлена!");
    };

    if (isLoading) {
        return <div className={cl.loading}>Загрузка данных...</div>;
    }

    return (
        <div className={cl.reportPage}>
            <header className={cl.header}>
                <Link to="/" className={cl.backButton}>
                    <IconButton iconLink={IconLink.BACK} color={Color.C4} />
                    <span>Назад</span>
                </Link>
            </header>
            <h1>Сообщить о проблеме</h1>

            <div className={cl.formGroup}>
                <label>В чем проблема?</label>
                <select
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                >
                    <option value="">Выберите тип проблемы</option>
                    <option value="inaccuracy">Неточность на плане</option>
                    <option value="app">Работа приложения</option>
                    <option value="route">Неправильный маршрут</option>
                    <option value="other">Другое</option>
                </select>
            </div>

            {/* Выбор корпуса и этажа (если проблема связана с планом) */}
            {problemType === "inaccuracy" && (
                <>
                    <div className={cl.formGroup}>
                        <label>Корпус</label>
                        <select
                            value={selectedBuilding}
                            onChange={(e) =>
                                setSelectedBuilding(e.target.value)
                            }
                        >
                            <option value="">Выберите корпус</option>
                            {buildings.length > 0 ? (
                                buildings.map((building) => (
                                    <option key={building} value={building}>
                                        {building}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Нет доступных корпусов</option>
                            )}
                        </select>
                    </div>

                    <div className={cl.formGroup}>
                        <label>Этаж</label>
                        <select
                            value={selectedFloor}
                            onChange={(e) => setSelectedFloor(e.target.value)}
                            disabled={
                                !selectedBuilding || filteredFloors.length === 0
                            }
                        >
                            <option value="">Выберите этаж</option>
                            {filteredFloors.length > 0 ? (
                                filteredFloors.map((floor) => (
                                    <option key={floor} value={floor}>
                                        {floor}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Нет доступных этажей</option>
                            )}
                        </select>
                    </div>
                </>
            )}

            <div className={cl.formGroup}>
                <label>Опишите проблему</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание проблемы..."
                />
            </div>

            <Button
                color={Color.BLUE}
                text="Отправить"
                onClick={handleSubmit}
            />
        </div>
    );
};

export default ReportPage;
