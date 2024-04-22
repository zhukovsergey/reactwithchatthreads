import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
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
      }
    };
    getUser();
  }, [username, showToast]);
  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        postTitle="Заголовок"
        postImg="/post1.png"
        likes="23412"
        replies="2353"
      />
      <UserPost
        postTitle="Заголовок2"
        postImg="/post2.png"
        likes="412"
        replies="233"
      />
      <UserPost
        postTitle="Заголовок3"
        postImg="/post3.png"
        likes="2312"
        replies="253"
      />
    </>
  );
};

export default UserPage;
