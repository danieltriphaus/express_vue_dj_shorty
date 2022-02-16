import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { nanoid } from "nanoid";
import VueRouter from "vue-router";

import MusicSession from "@/frontend/components/MusicSession";

describe("MusicSession Component Tests", () => {
    const fakeUserId = "testUser";

    const fakeMusicSession = {
        id: nanoid(21),
        playlistName: "testPlaylist",
        status: "active",
        createdAt: new Date(),
    };

    it("should show playlist name and status", () => {
        const router = new VueRouter({ mode: "abstract", routes: [] });
        router.push("/host");

        render(MusicSession, {
            routes: router,
            props: {
                spotifyUserId: fakeUserId,
                musicSession: fakeMusicSession,
            },
        });

        expect(screen.getByText(fakeMusicSession.playlistName)).toBeVisible();
        expect(screen.getByText("Aktiv")).toBeVisible();
    });

    it("should generate and show music session link", () => {
        const router = new VueRouter({ mode: "abstract", routes: [] });
        router.push("/host");

        render(MusicSession, {
            routes: router,
            props: {
                spotifyUserId: fakeUserId,
                musicSession: fakeMusicSession,
            },
        });

        expect(
            screen.getByDisplayValue("/play/" + fakeUserId + "/" + fakeMusicSession.id, { exact: false })
        ).toBeVisible();
    });

    it("should share link on click on share button", async () => {
        const router = new VueRouter({ mode: "abstract", routes: [] });
        router.push("/host");

        render(MusicSession, {
            routes: router,
            props: {
                spotifyUserId: fakeUserId,
                musicSession: fakeMusicSession,
            },
        });

        let shareDataResult = {};

        navigator.share = jest.fn((shareData) => {
            shareDataResult = shareData;
        });

        await fireEvent.click(screen.getByTestId("share-button"));

        await waitFor(() => {
            expect(shareDataResult).toMatchObject({
                url: expect.stringContaining("/play/" + fakeUserId + "/" + fakeMusicSession.id),
            });
        });
    });
});
