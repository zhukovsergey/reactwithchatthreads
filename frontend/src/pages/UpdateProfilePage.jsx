import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const fileRef = useRef();

  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
    bio: user.bio,
    profilePic: user.profilePic,
  });
  const [updating, setUpdating] = useState(false);
  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      setLoading(true);
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Ошибка", data.error, "error");
        return;
      }
      showToast("Успешно", "Ваш профиль был успешно обновлен", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      setLoading(false);
    } catch (e) {
      showToast("Ошибка", e, "error");
      setLoading(false);
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  boxShadow={"md"}
                  size="xl"
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Сменить аватар
                </Button>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Полное имя</FormLabel>
            <Input
              placeholder="Полное имя"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Имя пользователя (никнейм)</FormLabel>
            <Input
              placeholder="Имя пользователя (никнейм)"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Почта</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>О себе</FormLabel>
            <Input
              placeholder="Информация о себе"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Пароль</FormLabel>
            <Input
              placeholder="Пароль"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Link to={`/${user.username}`}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Отмена
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={updating}
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
            >
              {loading ? "Загрузка..." : "Обновить профиль"}
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
