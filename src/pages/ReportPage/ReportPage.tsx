import React, { useState, useMemo, useEffect } from "react";
import cl from "./ReportPage.module.scss";
import axios from "axios";
import { useDataStore } from "../../store/useDataStore";
import { useReviewStore } from "../../store/reviewStore";
import Button from "../../components/buttons/LargeButton/Button";
import { Color } from "../../constants/enums";
import { Link } from "react-router-dom";
import { IconLink } from "../../constants/IconLink";
import IconButton from "../../components/buttons/IconButton/IconButton";

const ReportPage: React.FC = () => {
    const [problemType, setProblemType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedBuilding, setSelectedBuilding] = useState<string>("");
    const [selectedFloor, setSelectedFloor] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const [userId, setUserId] = useState<string | null>(null);
    const [isLoadingUserId, setIsLoadingUserId] = useState(true);

    useEffect(() => {
        const cached = localStorage.getItem("user_id");
        if (cached) {
            setUserId(cached);
            setIsLoadingUserId(false);
        } else {
            setIsLoadingUserId(true);
            axios.get("/api/get/user-id")
                .then(res => {
                    setUserId(res.data.user_id);
                    localStorage.setItem("user_id", res.data.user_id);
                })
                .catch(() => {
                    alert("Ошибка получения user_id, попробуйте перезагрузить страницу.");
                })
                .finally(() => {
                    setIsLoadingUserId(false);
                });
        }
    }, []);

    const fetchData = useDataStore((state) => state.fetchData);
    const corpuses = useDataStore((state) => state.corpuses);
    const plans = useDataStore((state) => state.plans);

    useEffect(() => {
        if (corpuses.length === 0 || plans.length === 0) {
            fetchData();
        }
    }, [corpuses.length, plans.length, fetchData]);

    const isLoading = corpuses.length === 0 || plans.length === 0;
    const buildings = useMemo(
        () => [...new Set(corpuses.map((corpus) => corpus.title.trim()))],
        [corpuses]
    );
    const filteredFloors = useMemo(() => {
        if (!selectedBuilding) return [];
        const floors = plans
            .filter((plan) => plan.corpus.title === selectedBuilding)
            .map((plan) => plan.floor.toString());
        return [...new Set(floors)];
    }, [plans, selectedBuilding]);

    const { isSending, succeeded, error, sendReview } = useReviewStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            alert("Нет user_id, попробуйте перезагрузить страницу");
            return;
        }
        if (
            !problemType ||
            !description ||
            (problemType === "plan" &&
                (!selectedBuilding || !selectedFloor))
        ) {
            alert("Заполните все обязательные поля");
            return;
        }
        let text = description;
        if (problemType === "plan") {
            text += ` (Корпус: ${selectedBuilding}, Этаж: ${selectedFloor})`;
        }
        await sendReview({
            image,
            user_id: userId,
            problem: problemType,
            text,
        });
    };

    useEffect(() => {
        if (succeeded) {
            alert("Проблема отправлена!");
            setProblemType("");
            setDescription("");
            setSelectedBuilding("");
            setSelectedFloor("");
            setImage(null);
        }
    }, [succeeded]);

    if (isLoading || isLoadingUserId)
        return <div className={cl.reportPage}>Загрузка данных...</div>;

    return (
        <div className={cl.reportPage}>
            <div className={cl.header}>
                <Link to="/" className={cl.backButton}>
                    <IconButton iconLink={IconLink.BACK} color={Color.C4} />
                    <span>Назад</span>
                </Link>
            </div>
            <h1>Сообщить о проблеме</h1>
            <form className={cl.form} encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className={cl.formGroup}>
                    <label>В чем проблема?</label>
                    <select
                        value={problemType}
                        onChange={e => setProblemType(e.target.value)}
                        required
                    >
                        <option value="">Выберите тип проблемы</option>
                        <option value="plan">Неточность на плане</option>
                        <option value="work">Работа приложения</option>
                        <option value="way">Неправильный маршрут</option>
                        <option value="other">Другое</option>
                    </select>
                </div>
                {problemType === "plan" && (
                    <>
                        <div className={cl.formGroup}>
                            <label>Корпус</label>
                            <select
                                value={selectedBuilding}
                                onChange={e => setSelectedBuilding(e.target.value)}
                                required
                            >
                                <option value="">Выберите корпус</option>
                                {buildings.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div className={cl.formGroup}>
                            <label>Этаж</label>
                            <select
                                value={selectedFloor}
                                onChange={e => setSelectedFloor(e.target.value)}
                                required
                                disabled={!selectedBuilding || filteredFloors.length === 0}
                            >
                                <option value="">Выберите этаж</option>
                                {filteredFloors.map((floor) => (
                                    <option key={floor} value={floor}>{floor}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                <div className={cl.formGroup}>
                    <label>Опишите проблему</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Введите описание проблемы..."
                        required
                    />
                </div>
                <div className={cl.formGroup}>
                    <label>Фото (необязательно)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target.files?.[0] || null)}
                    />
                </div>
                <div className={cl.actions}>
                    <Button
                        color={Color.BLUE}
                        text={isSending ? "Отправка..." : "Отправить"}
                        type="submit"
                        className={cl.submitButton}
                        disabled={isSending}
                    />
                </div>
                {error && <div style={{ color: "red", marginTop: 8 }}>Ошибка: {error}</div>}
            </form>
        </div>
    );
};

export default ReportPage;
