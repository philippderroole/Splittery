import { Image } from "@chakra-ui/react";

export default function Logo() {
    return (
        <>
            <Image
                //src="gibbresh.png"
                fallbackSrc="https://via.placeholder.com/150"
                width={150}
                height={100}
            />
        </>
    );
}
