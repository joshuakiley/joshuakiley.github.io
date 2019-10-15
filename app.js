$(() => {

    // const getAudio = (data) => {
    //     console.log(data.items[0].pathmp3);
    // }

    // $.ajax({
    //     // type: "GET",
    //     url: "https://apifree.forvo.com/key/50cc8c901d98b50a741856ded1071131/format/json/action/standard-pronunciation/word/cat",
    //     data: "data",
    //     dataType: "jsonp",
    // }).then(handleData);

    const getPinYin = (data) => {
        console.log(data.text);
    }

    $.ajax({
        type: "GET",
        url: "https://api.pinyin.pepe.asia/pinyin/爱",
        data: "data",
    }).then(getPinYin);

})
