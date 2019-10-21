$(() => {
  /*************************************************************/
  //INITIATION
  // array of all of the vocabulary in the selected HSK level (level 1 through level 6)
  const fullArray = [];

  // array of cards to be studied this session based on the number of cards the user wants to study
  const currentStudyArray = [];

  // array of cards to study again
  const studyAgain = [];

  //array of cards retired for this session
  const retired = [];

  // user input number of cards want to study this session
  let studyCardQuantity = 0;

  // card front will either be Chinese or English based on user input
  let cardFront = "";

  // card back will be either Chinese or English base don user input
  let cardBack = "";

  /*************************************************************/
  // FUNCTION
  // Create Study List
  const getStudyList = data => {
    // make an array of every vocabulary word in the selected HSK level
    for (let i = 0; i < data.length; i++) {
      fullArray.push(data[i]);
    }
    // create an array of cards to study for current session based on user input
    for (let i = 0; i < studyCardQuantity; i++) {
      // random number used to access random index in the array of all the vocab for selected HSK level
      const randomCard = Math.round(Math.random() * (fullArray.length - 1));
      // checks for redundancy in this sessions card deck
      if (currentStudyArray.includes(fullArray[randomCard])) {
        i--;
      } else {
        // places non-redundant cards in this session's study deck
        currentStudyArray.push(fullArray[randomCard]);
      }
    }
  };
  // FUNCTION
  // get audio mp3 from forvo.com API and place it in phonetic's button
  const getAudio = data => {
    for (let i = 0; i < data.items.length; i++) {
      if (data.items[i].langname === "Mandarin Chinese") {
        $("#audio").attr("src", data.items[i].pathmp3);
      }
    }
  };

  // FUCNTION
  // change card to a new word
  const cardSwitch = () => {
    if (
      $("#language")
        .val()
        .toUpperCase() === "ENGLISH"
    ) {
      // get front and back of card from local json filesand set correct font type
      $("#frontTitle").text(currentStudyArray[0][cardFront][0]);
      $("#backTitle").text(currentStudyArray[0][cardFront][0]);
      $("#back").text(currentStudyArray[0][cardBack]);
    } else {
      $("#frontTitle").text(currentStudyArray[0][cardFront]);
      $("#backTitle").text(currentStudyArray[0][cardFront]);
      $("#back").text(currentStudyArray[0][cardBack]);
    }
    $("#pinyin").text(currentStudyArray[0]["pinyin"]);
    // set the pronunciation audio for the first card from Forvo's API
    $.ajax({
      type: "GET",
      url: `https://apifree.forvo.com/action/word-pronunciations/format/json/word/${
        currentStudyArray[0]["hanzi"]
      }/order/rate-desc/key/50cc8c901d98b50a741856ded1071131/`,
      data: "data",
      dataType: "jsonp"
    }).then(getAudio);
  };

  /*************************************************************/
  // EVENT
  // initiate session

  $("#initiation-modal").on("submit", e => {
    e.preventDefault();
    // ensures a value greater than 0 is entered before progressing
    if ($("#quantity").val() > 0) {
      // set the number of cards to study this session based on user input
      studyCardQuantity = $("#quantity").val();
      // access local json file with HSK vocab lists based on level user chooses to study from
      $.ajax({
        type: "GET",
        url: "/json/hsk-level-1.json",
        data: "data"
      }).then(getStudyList);
      // switch from the card count modal to the language selection modal
      $("#initiation-modal").css("display", "none");
      $("#language-modal").css("display", "block");
    }
  });

  // EVENT
  // after the user inputs a language option set up the deck to display the chosen language on the front of the card
  $("#language-modal").on("submit", e => {
    e.preventDefault();
    if (
      $("#language")
        .val()
        .toUpperCase() === "ENGLISH" ||
      $("#language")
        .val()
        .toUpperCase() === "CHINESE"
    ) {
      if (
        $("#language")
          .val()
          .toUpperCase() === "ENGLISH"
      ) {
        // get front and back of card from local json filesand set correct font type
        cardFront = "translations";
        cardBack = "hanzi";
        $("#frontTitle").addClass("english");
        $("#backTitle").addClass("english");
        $("#back").addClass("chinese");
      } else {
        cardFront = "hanzi";
        cardBack = "translations";
        $("#frontTitle").addClass("chinese");
        $("#backTitle").addClass("chinese");
        $("#back").addClass("english");
      }
      // hide the language selection modal
      $("#language-modal").css("display", "none");
      // set the pronunciation audio for the first card from Forvo's API
      cardSwitch();
    }
  });

  //EVENT
  // when user clicks "show answer" button, show card back and play pronunciation audio
  $("#pronunciation").on("click", e => {
    console.log($("#audio").attr("src"));
    $("#pronunciation").text(currentStudyArray[0]["pinyin"]);
    $(".answer-text").css("display", "block");
  });

  $("#again").on("click", e => {
    cardSwitch();
  });

  //EVENT
  // hide/show how-to modal
  $(".close").on("click", () => {
    $("#howModal").css("display", "none");
  });

  $("#howBtn").on("click", () => {
    $("#howModal").css("display", "block");
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
