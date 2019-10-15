$(() => {

    const handleData = (data) => {
        console.log(data);
    }

    $.ajax({
        type: "GET",
        url: "https://apifree.forvo.com/action/standard-pronunciation/format/json/word/love/key/50cc8c901d98b50a741856ded1071131",
        data: {

        }
    }).then(handleData);
})