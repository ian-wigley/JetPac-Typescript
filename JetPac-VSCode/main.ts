require(["out\\JetPac.js"], function (JetPac) {
    var jetpac = new JetPac();
    jetpac.Run();
});

require.config({
    baseUrl: "out",
    paths: {
        "some": "JetPac"
    },
    waitSeconds: 15,
});
