require(["JetPac.js"], function (someModule) {
    var jetpac = new someModule();
    jetpac.Run();
});


require.config({
    baseUrl: "/",
    paths: {
        "some": "JetPac"
    },
    waitSeconds: 15,
});