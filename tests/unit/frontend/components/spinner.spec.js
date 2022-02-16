import { cleanup, render, screen } from "@testing-library/vue";
import Spinner from "@/frontend/components/Spinner";
import "@testing-library/jest-dom";

describe("Spinner tests", () => {
    it("should show when isLoading is true", () => {
        render(Spinner, { props: { isLoading: true } });

        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("should not show isLoading is false", () => {
        render(Spinner, { props: { isLoading: false } });
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();

        cleanup();

        render(Spinner, { props: { isLoading: undefined } });
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });
});
