import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import AddTrackButton from "@/frontend/components/AddTrackButton.vue";
import "@testing-library/jest-dom";
import axios from "axios";
import VueRouter from "vue-router";

jest.mock("axios");

describe("AddTrackButton Component Tests", () => {
    const vueToastedMock = {
        show: jest.fn(),
    };

    function renderWithRouteAndToastedMock() {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });

        router.push("/play/testUser/testMusicSession");

        render(AddTrackButton, { routes: router }, (vue) => {
            vue.prototype.$toasted = vueToastedMock;
        });
    }

    it("should render add icon on initial render", () => {
        render(AddTrackButton);
        expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    it("should show spinner after click", async () => {
        renderWithRouteAndToastedMock();
        axios.post.mockResolvedValueOnce();

        await fireEvent.click(screen.getByTestId("add-button"));

        await waitFor(() => {
            expect(screen.getByTestId("spinner")).toBeVisible();
        });
    });

    it("should make request to add track after click", async () => {
        renderWithRouteAndToastedMock();
        axios.post.mockResolvedValueOnce();

        await fireEvent.click(screen.getByTestId("add-button"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
    });

    it("should show success notification after click and successful response", async () => {
        renderWithRouteAndToastedMock();
        axios.post.mockResolvedValueOnce();

        await fireEvent.click(screen.getByTestId("add-button"));

        await waitFor(() => {
            expect(vueToastedMock.show).toHaveBeenCalledWith(
                expect.stringContaining(""),
                expect.objectContaining({ type: "success" })
            );
        });
    });

    it("should show error notification after click and response 429", async () => {
        renderWithRouteAndToastedMock();
        axios.post.mockRejectedValueOnce({ response: { status: 429 } });

        await fireEvent.click(screen.getByTestId("add-button"));

        await waitFor(() => {
            expect(vueToastedMock.show).toHaveBeenCalledWith(
                expect.stringContaining(""),
                expect.objectContaining({ type: "error" })
            );
        });
    });
});
