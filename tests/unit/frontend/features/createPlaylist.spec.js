import { createPlaylist } from "@/frontend/features/Playlists/createPlaylist";
import axios from "axios";

jest.mock("axios");

describe("createPlaylist Module tests", () => {
  it("should not create playlist if no name is passed", async () => {
    axios.post.mockResolvedValueOnce();

    await createPlaylist("test_access_token", "test_user");

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should call spotify api if name is passed", async () => {
    axios.post.mockResolvedValueOnce();

    await createPlaylist("test_access_token", "test_user", "new_playlist");

    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
