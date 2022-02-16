import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { nanoid } from "nanoid";
import VueRouter from "vue-router";

import MusicSessionList from "@/frontend/components/MusicSessionList";
import axios from "axios";

jest.mock("axios");

describe("MusicSession Component Tests", () => {
    const fakeUserId = "testUser";

    const fakeMusicSessions = [
        {
            id: nanoid(21),
            playlistName: "testPlaylist",
            status: "active",
            createdAt: new Date(),
        },
        {
            id: nanoid(21),
            playlistName: "testPlaylist2",
            status: "active",
            createdAt: new Date(),
        },
    ];

    it("should show playlist name and status", () => {
        const router = new VueRouter({ mode: "abstract", routes: [] });
        router.push("/host");

        render(MusicSessionList, {
            routes: router,
            props: {
                spotifyUserId: fakeUserId,
                musicSessions: fakeMusicSessions,
            },
        });

        fakeMusicSessions.forEach((musicSession) => {
            expect(screen.getByText(musicSession.playlistName)).toBeVisible();
        });

        screen.getAllByText("Aktiv").forEach((statusText) => {
            expect(statusText).toBeVisible();
        });
    });

    it("should reload status display after musicSession deactivation", async () => {
        const router = new VueRouter({ mode: "abstract", routes: [] });
        router.push("/host");

        render(MusicSessionList, {
            routes: router,
            props: {
                spotifyUserId: fakeUserId,
                musicSessions: fakeMusicSessions,
            },
        });

        axios.patch.mockResolvedValueOnce({ data: { musicSession: { ...fakeMusicSessions[0], status: "inactive" } } });

        await fireEvent.click(screen.getAllByTestId("deactivate-session")[0]);

        await waitFor(() => {
            expect(screen.getByText("Inaktiv")).toBeVisible();
        });
    });
});
