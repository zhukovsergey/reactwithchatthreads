import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        console.log(data);
        setUser(data.user);
        if (data.error) {
          showToast("Ошибка", data.error, "error");
        }
      } catch (e) {
        showToast("Ошибка", e, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);
  return { user, loading };
};

export default useGetUserProfile;
