$(() => {
  const getAudio = data => {
    $(".study-card")
      .children("button")
      .remove();
    const $pronincuationButton = $("<button>")
      .attr("class", "pronunciaion")
      .attr("href", `${data.items[0].pathmp3}`)
      .text(`${data.items[0].word}`);
    $(".study-card").append($pronincuationButton);
  };

  $(".pronunciaion").on("click", () => {
    $.ajax({
      // type: "GET",
      url:
        "https://apifree.forvo.com/key/50cc8c901d98b50a741856ded1071131/format/json/action/standard-pronunciation/word/cat",
      data: "data",
      dataType: "jsonp"
    }).then(getAudio);
  });

  const getPinYin = data => {
    console.log(data[0]);
    console.log(data[0].hanzi);
    console.log(data[0].pinyin);
    console.log(data[0].translations[0]);
  };

  $.ajax({
    type: "GET",
    url: "/hanyu-shuiping-kaoshi/json/hsk-level-1.json",
    data: "data"
  }).then(getPinYin);

  // modal pops up giving directions
  // modal pops up asking how many cards to study
  // set variable equal to number of cards
  // ask which language to show English or Chinese
  // select first card randomly and display in selected language
  // user can click SHOW ANSWER button to show other language and give audio and phonetic informaton
  // when user decides they know or not, user can hit the arrow key left or right (eventually swipe) to which deck of cards (left unknown/ right known)
  // if known, removed from word array
  // if unknown kept in word array
  //Next card appears randomly in the language chosen
  // process continues until the study deck is empty
  // go through process again with only cards in unknown deck
});
