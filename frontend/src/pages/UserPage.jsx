import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
