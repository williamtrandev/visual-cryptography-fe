import { useState, useEffect } from "react";
import useImage from "use-image";
import { Image } from "react-konva";

const DraggableImage = ({ src, width, stageWidth }) => {
    const [image] = useImage(src);
    const [position, setPosition] = useState({ x: width + 10, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (image) {
            // Khi ảnh đã tải xong, lấy kích thước của nó
            setImageSize({ width: image.width, height: image.height });
        }
    }, [image]);

    const handleDragMove = (e) => {
        const { x } = e.target.position();
        setPosition({ x, y: 0 });
    };

    return (
        <Image
            image={image}
            x={position.x}
            y={position.y}
            draggable
            onDragMove={handleDragMove}
            dragBoundFunc={(pos) => {
                const newX = Math.max(0, Math.min(pos.x, stageWidth - width));
                return {
                    x: newX,
                    y: 0
                };
            }}
            height={width * imageSize.height/imageSize.width}
            width={width}
        />
    );
};

export default DraggableImage
