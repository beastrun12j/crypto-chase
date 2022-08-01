import { styled } from "@mui/system";

const SelectButton = (props) => {
  const Button = styled("span")({
    border: "1px solid gold",
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Montserrat",
    cursor: "pointer",
    backgroundColor: props.selected ? "gold" : "",
    color: props.selected ? "black" : "",
    fontWeight: props.selected ? 700 : 500,
    textAlign: "center",
    "&:hover": {
      backgroundColor: "gold",
      color: "black",
    },
    width: "22%",
  });

  return <Button onClick={props.onClick}>{props.children}</Button>;
};

export default SelectButton;
