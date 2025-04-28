import { create } from "zustand";
import axios from "axios";

type ReviewData = {
    image?: File | null;
    user_id: string;
    problem: string;
    text: string;
};

type State = {
    isSending: boolean;
    succeeded: boolean;
    error: string | null;
    sendReview: (review: ReviewData) => Promise<void>;
};

export const useReviewStore = create<State>((set) => ({
    isSending: false,
    succeeded: false,
    error: null,
    async sendReview(review) {
        set({ isSending: true, succeeded: false, error: null });
        try {
            const formData = new FormData();
            formData.append("user_id", review.user_id);
            formData.append("problem", review.problem);
            formData.append("text", review.text);
            if (review.image) {
                formData.append("image", review.image);
            }

            await axios.post("/api/review/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({ isSending: false, succeeded: true, error: null });
        } catch (e) {
            set({ isSending: false, succeeded: false, error: e.message || "Ошибка отправки" });
        }
    }
}));
