import React, { useReducer } from "react";
import styled from "styled-components";
import { fruits } from "../utils/constants/fruits";

const initialState = {
  newProducts: [],
  fruits: fruits,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        newProducts: state.newProducts.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "decrement":
      return {
        ...state,
        newProducts: state.newProducts.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        ),
      };

    case "delete":
      return {
        ...state,
        newProducts: state.newProducts.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "addProduct":
      const filteredObject = state.fruits.filter((item) => {
        return item.id === action.payload
          ? {
              ...item,
              completed: !item.completed,
            }
          : null;
      });
      return {
        ...state,
        newProducts: [...state.newProducts, ...filteredObject],
      };
    case "update":
      return {
        ...state,
        fruits: state.fruits.map((item) =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        ),
      };
    default:
      return state;
  }
};

export const MainContent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { newProducts, fruits } = state;

  const handleDecrement = (id) => {
    dispatch({ type: "decrement", payload: id });
  };
  const handleIncrement = (id) => {
    dispatch({ type: "increment", payload: id });
  };
  const handleDelete = (id) => {
    dispatch({ type: "delete", payload: id });
    dispatch({ type: "update", payload: id });
  };

  const handleAddProduct = (id) => {
    dispatch({ type: "addProduct", payload: id });
    dispatch({ type: "update", payload: id });
  };

  return (
    <StyledSection>
      <StyledArticle>
        {fruits.map((item) => (
          <ProductCard key={item.id}>
            <StyledImg src={item.imgURL} alt="" />
            <p>
              {item.title} - ${item.price}
            </p>
            <AddButton
              onClick={() => handleAddProduct(item.id)}
              disabled={item.completed}
            >
              {item.completed ? "Added" : "Add"}
            </AddButton>
          </ProductCard>
        ))}
      </StyledArticle>

      <StyledTable>
        <StyledHeader>
          <p>#</p>
          <p>Product</p>
          <p>Product Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Remove</p>
        </StyledHeader>
        {newProducts.length === 0 && <EmptyMessage>Click on add to add a product</EmptyMessage>}
        {newProducts?.map((item, index) => (
          <ListStyled key={item.id}>
            <span>{index + 1}</span>
            <StyledImg src={item.imgURL} alt={item.title} />
            <p>{item.title}</p>
            <p>${item.price}</p>
            <StyledInnerDuoBtn>
              <QuantityButton
                onClick={() => handleDecrement(item.id)}
                disabled={item.quantity === 1}
              >
                -
              </QuantityButton>
              <p>{item.quantity}</p>
              <QuantityButton onClick={() => handleIncrement(item.id)}>
                +
              </QuantityButton>
            </StyledInnerDuoBtn>
            <RemoveButton onClick={() => handleDelete(item.id)}>
              Remove
            </RemoveButton>
          </ListStyled>
        ))}
      </StyledTable>

      <TotalPrice>
        TOTAL: $
        {newProducts.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )}
      </TotalPrice>
    </StyledSection>
  );
};
const StyledSection = styled.section`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const StyledArticle = styled.article`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
`;

const ProductCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 150px;
`;

const StyledImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  background: ${(props) => (props.disabled ? "#a5d6a7" : "#66bb6a")};
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: 0.3s;
  &:hover {
    background: ${(props) => (props.disabled ? "#a5d6a7" : "#388e3c")};
  }
`;

const StyledTable = styled.ul`
  width: 80%;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 10px;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
`;

const ListStyled = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid #ddd;
`;

const QuantityButton = styled.button`
  background: #42a5f5;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #1e88e5;
  }
`;

const RemoveButton = styled.button`
  background: #e57373;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #d32f2f;
  }
`;

const StyledInnerDuoBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TotalPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;
const EmptyMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #757575;
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  border: 2px dashed #bdbdbd;
  border-radius: 10px;
  background-color: #f5f5f5;
`;
