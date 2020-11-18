import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

export const fetchStar = (
  rating: number,
  ratingOver: number | null,
  setRatingOver: (index: number | null) => void,
  ratingSelected: number | null,
  handleSelectedRating: (index: number | null) => void
) => {
  const star = [];
  let style = null;

  let round = Math.round(rating * 2) / 2;

  for (let i = 0; i < 5; i++) {
    if (
      (ratingSelected && ratingSelected >= i) ||
      (ratingSelected === 0 && ratingSelected >= i)
    ) {
      style = "#0472dc";
    } else if (
      (!ratingSelected && ratingOver && ratingOver >= i) ||
      (!ratingSelected && ratingOver === 0 && ratingOver >= i)
    ) {
      style = "#0472dc";
    } else {
      style = "";
    }

    if (round >= 1) {
      star.push(
        <BsStarFill
          color="#0472dc"
          style={{
            fill: style,
          }}
          onMouseOver={() => setRatingOver && setRatingOver(i)}
          onClick={() => handleSelectedRating && handleSelectedRating(i)}
          key={i}
        />
      );
    } else if (round === 0.5) {
      star.push(
        <BsStarHalf
          color="#0472dc"
          style={{
            fill: style,
          }}
          onMouseOver={() => setRatingOver && setRatingOver(i)}
          onClick={() => handleSelectedRating && handleSelectedRating(i)}
          key={i}
        />
      );
    } else {
      star.push(
        <BsStar
          color={style}
          onMouseOver={() => setRatingOver && setRatingOver(i)}
          onClick={() => handleSelectedRating && handleSelectedRating(i)}
          key={i}
        />
      );
    }
    round--;
  }
  return star;
};
