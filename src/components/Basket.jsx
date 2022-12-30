/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useMediaQuery } from "@chakra-ui/react";
import {
  decLengthByOne,
  subtractPrice,
  sumProductPrices,
  updateBasket,
  updateLength,
  updateProductsQuantity,
} from "../feature/basketSlice";
const Basket = () => {
  const [windowScrollY, setWindowScrollY] = useState();
  const media = useMediaQuery("(max-width: 771px)")[0];
  let checkoutBtn = document.querySelector(".btn-checkout-container");
  let summary = document.querySelector(".summary");
  const optionArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dispatch = useDispatch();
  const productsSum = useSelector((state) => state.basket.sum);
  const basketProducts = useSelector((state) => state.basket.basketProducts);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setWindowScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      const getUserProducts = (async () => {
        const res = await fetch("http://localhost:5000/user/cart/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: JSON.parse(sessionStorage.getItem("user")),
          }),
        });
        const json = await res.json();
        dispatch(updateProductsQuantity(json.foundUser.cart));
        dispatch(updateLength(json.basketProducts.length));
        dispatch(updateBasket(json.basketProducts));

        if (json.basketProducts.length > 0) {
          const sum = json.basketProducts
            ?.map((product) => {
              const price = product.price.split("$").join("");
              return price;
            })
            ?.reduce((a, b) => Number(a) + Number(b));
          const val = Number(sum).toFixed(2);
          dispatch(sumProductPrices(Number(val)));
        }
      })();
      // getUserProducts();
    }
  }, [dispatch]);

  if (media) {
    if (
      checkoutBtn &&
      windowScrollY >= summary.offsetTop + summary.offsetHeight
    ) {
      checkoutBtn.classList.add("fixed");
    } else if (
      checkoutBtn &&
      summary &&
      windowScrollY <= summary.offsetTop + summary.offsetHeight
    ) {
      checkoutBtn.classList.remove("fixed");
    }
  } else if (checkoutBtn && !media) {
    checkoutBtn.classList.remove("fixed");
  }

  const deleteBasketProduct = async (e) => {
    const res = await fetch("http://localhost:5000/user/cart/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: JSON.parse(sessionStorage.getItem("user")),
        productName: e.target.parentElement.parentElement.parentElement.id,
      }),
    });
    const json = await res.json();
    dispatch(updateBasket(json));
    const value = Number(
      e.target.parentElement.previousElementSibling.previousElementSibling.innerText
        .split("$")
        .join("")
    );
    const sub = value.toFixed(2);
    dispatch(subtractPrice(sub));
    dispatch(decLengthByOne());
  };

  const checkout = async () => {
    const res = await fetch("http://localhost:5000/user/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: basketProducts,
      }),
    });
    const json = await res.json();
    window.open(json, "_blank");
  };

  return (
    <div className="home mobile">
      <div className="productContainer">
        <ListGroup>
          {sessionStorage.getItem("isLoggedIn") ? (
            basketProducts && basketProducts.length > 0 ? (
              basketProducts?.map((prod) => (
                <ListGroup.Item id={prod.name} key={prod._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={prod.image} alt={prod.name} fluid rounded />
                    </Col>
                    <Col md={2}>
                      <span>
                        {prod.name[0].toUpperCase() + prod.name.slice(1, -1)}
                      </span>
                    </Col>
                    <Col md={2}>
                      <span>{prod.size}</span>
                    </Col>
                    <Col md={2}>{prod.price}</Col>

                    <Col md={2}>
                      <Form.Control
                        as="select"
                        defaultValue={prod.quantity}
                        onChange={(e) => e.target.value}
                      >
                        {optionArray.map((x, index) => (
                          <option style={{ height: "20px" }} key={index}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        onClick={(e) => {
                          deleteBasketProduct(e);
                        }}
                        type="button"
                        variant="light"
                      >
                        <AiFillDelete
                          fontSize="20px"
                          style={{ pointerEvents: "none" }}
                        />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <h3 className="empty-cart">Your cart is empty!</h3>
            )
          ) : (
            <h3 className="login-first">Login to add items to cart.</h3>
          )}
        </ListGroup>
      </div>
      <div className="filters summary">
        <span className="title">Subtotal ({}) items</span>
        <span style={{ fontWeight: 700, fontSize: 20 }}>
          Total: $
          {sessionStorage.getItem("isLoggedIn") &&
            productsSum &&
            Number(productsSum).toFixed(2)}
        </span>
        <div className="btn-checkout-container">
          <Button
            className="btn-checkout"
            type="button"
            onClick={() => {
              if (sessionStorage.getItem("user")) {
                checkout();
              } else {
                toast.error("Login to proceed to checkout!");
              }
            }}
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Basket;
