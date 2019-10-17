$(() => {
  // const getAudio = data => {
  //   $(".study-card")
  //     .children("button")
  //     .remove();
  //   const $pronincuationButton = $("<button>")
  //     .attr("class", "pronunciaion")
  //     .attr("href", `${data.items[0].pathmp3}`)
  //     .text(`${data.items[0].word}`);
  //   $(".study-card").append($pronincuationButton);
  // };
  // $(".pronunciaion").on("click", () => {
  //   $.ajax({
  //     // type: "GET",
  //     url:
  //       "https://apifree.forvo.com/key/50cc8c901d98b50a741856ded1071131/format/json/action/standard-pronunciation/word/cat",
  //     data: "data",
  //     dataType: "jsonp"
  //   }).then(getAudio);
  // });
  // const getPinYin = data => {
  //   console.log(data[0]);
  //   console.log(data[0].hanzi);
  //   console.log(data[0].pinyin);
  //   console.log(data[0].translations[0]);
  // };
  // $.ajax({
  //   type: "GET",
  //   url: "/json/hsk-level-1.json",
  //   data: "data"
  // }).then(getPinYin);
  // modal pops up asking how many cards to study
  const fullArray = [];
  const currentStudyArray = [];
  let studyCardQuantity = 0;

  const getStudyList = data => {
    for (let i = 0; i < data.length; i++) {
      fullArray.push(data[i]);
    }
    for (let i = 0; i <= studyCardQuantity; i++) {
      const randomCard = Math.round(Math.random() * (fullArray.length - 1));
      if (currentStudyArray.includes(fullArray[randomCard])) {
      } else {
        currentStudyArray.push(fullArray[randomCard]);
      }
    }
  };

  $(`#initiation-modal`).on("submit", () => {
    studyCardQuantity = $("#quantity").val();
    $.ajax({
      type: "GET",
      url: "/json/hsk-level-1.json",
      data: "data"
    }).then(getStudyList);
    $("#initiation-modal ").css("display", "none");
    $("#language-modal").css("display", "block");
    $;
  });

  $("#language-modal").on("submit", () => {
    //write code to set language on front of card
  });

  $(".close").on("click", () => {
    $(".how-to-modal").css("display", "none");
  });

  $("#how-to").on("click", () => {
    $(".how-to-modal").css("display", "block");
  });

  // modal pops up giving directions
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
