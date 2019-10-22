$(() => {
  /*************************************************************/
  //INITIATION
  // array of all of the vocabulary in the selected HSK level (level 1 through level 6)
  const fullArray = [];

  // array of cards to be studied this session based on the number of cards the user wants to study
  const currentStudyArray = [];

  //array of cards retired for this session
  const retire = [];

  // user input number of cards want to study this session
  let studyCardQuantity = 0;

  // card front will either be Chinese or English based on user input
  let cardFront = "";

  // card back will be either Chinese or English base don user input
  let cardBack = "";

  // HSK level value
  let hskLevel = 0;

  //check review or study new cards
  let study = "";

  /*************************************************************/
  //FUNCTION
  // put retired vocabulary into the retired array so that when the new local sotrage data is set retired cards from previous sessions remain retired
  const getPreviouslyRetiredCards = () => {
    if (JSON.parse(localStorage.getItem(`hsk${hskLevel}`)) !== null) {
      const previousList = JSON.parse(localStorage.getItem(`hsk${hskLevel}`));
      for (let i = 0; i < previousList.length; i++) {
        retire.push(previousList[i]);
      }
    }
  };

  //FUCNTION
  // compare full array of vocabulary with vocabulary stored in local storage (vocab already studied), so that the vocab list is always new vocabulary and doesn't include retired vocabulary
  const compare = otherArr => {
    return currentArr => {
      return (
        otherArr.filter(other => {
          return other.hanzi == currentArr.hanzi;
        }).length == 0
      );
    };
  };

  // FUNCTION
  // Create Study List
  const getStudyList = data => {
    let newCardArray = [];
    // make an array of every vocabulary word in the selected HSK level
    for (let i = 0; i < data.length; i++) {
      fullArray.push(data[i]);
    }

    if (localStorage.getItem(`hsk${hskLevel}`) !== null) {
      const oldList = JSON.parse(localStorage.getItem(`hsk${hskLevel}`));
      newCardArray = fullArray
        .filter(compare(oldList))
        .concat(oldList.filter(compare(fullArray)));
    } else {
      newCardArray = fullArray;
    }

    // make sure studyCardQuantity not greater than the number of available vocabulary words
    if (JSON.parse(localStorage.getItem(`hsk${hskLevel}`)) !== null) {
      if (
        studyCardQuantity >
        newCardArray.length -
          JSON.parse(localStorage.getItem(`hsk${hskLevel}`)).length
      ) {
        studyCardQuantity =
          newCardArray.length -
          JSON.parse(localStorage.getItem(`hsk${hskLevel}`)).length;
      }
    }

    // create an array of cards to study for current session based on user input
    for (let i = 0; i < studyCardQuantity; i++) {
      // random number used to access random index in the array of all the vocab for selected HSK level
      const randomCard = Math.round(Math.random() * (newCardArray.length - 1));
      // checks for redundancy in this sessions card deck
      if (currentStudyArray.includes(newCardArray[randomCard])) {
        i--;
      } else {
        // places non-redundant cards in this session's study deck
        currentStudyArray.push(newCardArray[randomCard]);
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
  // show the directions to the user before getting input from the user
  $("#howModal").on("submit", e => {
    e.preventDefault();
    $("#begin").remove();
    $("#howModal").css("display", "none");
    $("#close").css("display", "block");
    $("#initiation-modal").css("display", "block");
    $("#quantity").trigger("select");
  });

  //EVENT
  // initiate session
  $("#initiation-modal").on("submit", e => {
    e.preventDefault();
    // ensures a value greater than 0 is entered before progressing
    if ($("#quantity").val() > 0) {
      // set the number of cards to study this session based on user input
      studyCardQuantity = $("#quantity").val();

      // switch from the card count modal to the language selection modal
      $("#initiation-modal").css("display", "none");
      $("#hsk-level").css("display", "block");
      $("#lvl").trigger("select");
    } else {
      $("#quantity").trigger("select");
    }
  });

  $("#hsk-level").on("submit", e => {
    e.preventDefault();
    if ($("#lvl").val() > 0 && $("#lvl").val() <= 6) {
      hskLevel = $("#lvl").val();
      getPreviouslyRetiredCards();
      // access local json file with HSK vocab lists based on level user chooses to study from
      $.ajax({
        type: "GET",
        url: `/json/hsk-level-${hskLevel}.json`,
        data: "data"
      }).then(getStudyList);
      $("#hsk-level").css("display", "none");
      $("#language-modal").css("display", "block");
      $("#language").trigger("select");
    } else {
      $("#lvl").trigger("select");
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
      $("#howBtn").css("display", "block");
      // set the pronunciation audio for the first card from Forvo's API
      cardSwitch();
    } else {
      $("#language").trigger("select");
    }
  });

  //EVENT
  // shuffle a card back into the deck to restudy again in this session and go to the next card
  $("#shuffle").on("click", e => {
    const card = currentStudyArray.shift();
    currentStudyArray.push(card);
    $("#backTitle").trigger("click");
    // give the card enough time to hide so the answer doesn't show
    setTimeout(cardSwitch, 150);
  });

  //EVENT
  // remove the card from the deck after the user decides they know it
  $("#retire").on("click", e => {
    if (currentStudyArray.length > 1) {
      $("#backTitle").trigger("click");
      retire.push(currentStudyArray.shift());
      setTimeout(cardSwitch, 150);
    } else if (currentStudyArray.length === 1) {
      retire.push(currentStudyArray.shift());
      $("#frontTitle").text(
        "Play again with new words, or return retired cards to the deck for a chance to study them next time."
      );
      $("#reset").css("display", "block");
      $("#refresh").css("display", "block");
      $("#backTitle").text("加油！");
      $("#pinyin").text("没了，做完成了！");
      $("#back").text("去休息吧。。。");
      $("#audioBtn").remove();
      $("#shuffle").remove();
      $("#retire").remove();
      $("#howBtn").remove();
      $("#showAnsr").remove();
      localStorage.setItem(`hsk${hskLevel}`, JSON.stringify(retire));
    }
  });

  //EVENT
  // hide/show how-to modal
  $(".close").on("click", () => {
    $("#howModal").css("display", "none");
  });

  $("#howBtn").on("click", () => {
    $("#howModal").css("display", "block");
  });

  //EVENT
  //reset retired cards list
  $("#reset").on("click", () => {
    localStorage.clear();
  });

  //EVENT
  //play again
  $("#refresh").on("click", () => {
    location.reload();
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
