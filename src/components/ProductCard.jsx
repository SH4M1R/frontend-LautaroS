import { Card, Button } from "react-bootstrap";

const ProductCard = ({ producto }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Img variant="top" src={producto.img} alt={producto.nombre} style={{ height: "200px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {producto.categoria}
        </Card.Subtitle>
        <Card.Text>{producto.descripcion}</Card.Text>
        <h5 className="text-primary">S/ {producto.precio.toFixed(2)}</h5>
        <Button variant="dark">Agregar</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
