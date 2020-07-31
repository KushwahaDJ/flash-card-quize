import React, { useState, useEffect, useRef } from "react";
import FlashCardList from "./FlashCardList";
import "./App.css";
import axios from "axios";
import { get } from "https";

function App() {
  const [flashCards, setFlashCard] = useState([]);
  const [categories, setCategory] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then(res => {
      // console.log(res.data);
      setCategory(res.data.trivia_categories);
    });
  }, []);

  // useEffect(() => {}, []);

  function decodeString(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then(res => {
        setFlashCard(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map(a => decodeString(a)),
              answer
            ];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5)
            };
          })
        );
        // console.log(res);
      });
  }

  return (
    <div>
      <form className="header" onClick={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Numner of questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashCardList flashCards={flashCards} />
      </div>
    </div>
  );
}
export default App;
