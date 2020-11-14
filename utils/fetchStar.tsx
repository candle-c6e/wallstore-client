import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

export const fetchStar = (rating: number) => {
  let round = Math.round(rating * 2) / 2;
  const star = [];
  for (let i = 0; i < 5; i++) {
    if (round >= 1) {
      star.push(<BsStarFill key={i} />);
    } else if (round === 0.5) {
      star.push(<BsStarHalf key={i} />);
    } else {
      star.push(<BsStar key={i} />);
    }
    round--;
  }
  return star;
};
