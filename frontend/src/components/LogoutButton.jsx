import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { IoLogOutOutline } from "react-icons/io5";
const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Отлично", "Вы успешно вышли", "success");
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Button
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
        onClick={handleLogout}
      >
        <IoLogOutOutline />
        Выйти
      </Button>
    </div>
  );
};

export default LogoutButton;
