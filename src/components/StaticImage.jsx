import { useState, useEffect } from "react";
import useImage from "use-image";
import { Image } from "react-konva";

const StaticImage = ({ src, width }) => {
    const [image] = useImage(src);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (image) {
            // Khi ảnh đã tải xong, lấy kích thước của nó
            setImageSize({ width: image.width, height: image.height });
        }
    }, [image]);

    return (
        <Image
            image={image}
            x={0}
            y={0}
            height={width * imageSize.height/imageSize.width}
            width={width}
        />
    );
};

export default StaticImage
