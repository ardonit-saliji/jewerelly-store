import { useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setLoginMessage,
  setProfileImage,
  updateBasket,
  updateLength,
} from "../feature/basketSlice";

export function useAuth() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Check if the user is already logged in

    if (sessionStorage.getItem("user")) {
      setUser(JSON.parse(sessionStorage.getItem("user")));
    }
  }, []);

  async function setLogin(user) {
    // Perform login request to server
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (res.status === 200) {
      sessionStorage.setItem("loginNtf", JSON.stringify(res.ok));
      sessionStorage.setItem("isLoggedIn", JSON.stringify(json.auth));

      setUser(json.user);
      if (json.profileImage) {
        dispatch(
          setProfileImage(`data:image/jpeg;base64,${json.profileImage}`)
        );
      } else {
        dispatch(setProfileImage("/images/user.webp"));
      }
      sessionStorage.setItem("user", JSON.stringify(json.user));
      dispatch(updateBasket(json.basketProducts));
      dispatch(updateLength(json.basketProducts.length));
      window.location.reload();
    } else {
      dispatch(setLoginMessage(json.message));
    }

    sessionStorage.setItem("loginNtf", JSON.stringify(res.ok));
    // throw new Error("Login failed");
  }

  return { user, setLogin };
}
