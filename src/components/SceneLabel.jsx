import { Text } from "@react-three/drei";

export default function SceneLabel({ position, text, size = 0.5, color = "#000000", fontSize = 1 }) {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      maxWidth={200}
      textAlign="center"
      font="/fonts/inter-var.woff" // hoặc font mặc định
      outlineWidth={0.005}
      outlineColor="#FFFFFF"
    >
      {text}
    </Text>
  );
}