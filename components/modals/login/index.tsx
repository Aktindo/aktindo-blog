import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { auth, githubProvider, googleProvider } from "../../../firebase";

export interface LoginModalProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onOpen, onClose, isOpen }) => {
  const toast = useToast();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={5} className="font-inter">
        <ModalBody className="mt-2">
          <div className="mb-5">
            <p className="text-xl font-poppins">
              OwO, so you've finally decided to login.
            </p>
            <p className="text-gray-600">
              Get access to post comments, like your favorite blogs and much
              more!
            </p>
          </div>
          <div className="grid justify-center">
            <button
              className="btn bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 font-inter"
              onClick={() =>
                auth
                  .signInWithPopup(googleProvider)
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Logged in successfully.",
                      status: "success",
                      duration: 5 * 1000,
                      isClosable: true,
                      position: "top",
                    });
                  })
                  .catch((e) =>
                    toast({
                      title: "Uh oh! An error occured.",
                      description: e.message,
                      position: "top",
                      duration: 5 * 1000,
                      status: "error",
                    })
                  )
              }
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-1" /> Login with
              google
            </button>
          </div>
        </ModalBody>

        <ModalFooter>
          <p className="mr-auto text-sm">
            By signing in, you agree to Aktindo Inc's{" "}
            <a href="/" className="link link-hover">
              privacy policy
            </a>
            .
          </p>
          <button className="btn btn-error ml-5" onClick={onClose}>
            Close
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { LoginModal };
