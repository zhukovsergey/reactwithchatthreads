import { Button, useColorModeValue } from "@chakra-ui/react";
import { IoCreateOutline } from "react-icons/io5";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  Text,
  Input,
  Flex,
  Image,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
const MAX_CHAR = 500;

const CreatePost = () => {
  const showToast = useShowToast();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      setPosts([data, ...posts]);
      if (data.error) {
        showToast("Ошибка", data.error, "error");
      }
      showToast("Успешно", "Ваша запись была успешно создана", "success");
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (e) {
      showToast("Ошибка", e, "error");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        onClick={onOpen}
        position={"fixed"}
        bottom={"10px"}
        right={"5px"}
        size={{ base: "sm", md: "md" }}
        leftIcon={<IoCreateOutline />}
        bg={useColorModeValue("gray.300", "gray.dark")}
      >
        Создать запись
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Создать запись</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Напишите что-нибудь"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"semibold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800 "}
              >
                {remainingChar}/500
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                onClick={() => imageRef.current.click()}
                style={{ cursor: "pointer", marginLeft: "5px" }}
                size={20}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="selected-img" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={0}
                  right={0}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Опубликовать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
