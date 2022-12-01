require(["out\\JetPac.js"], function (JetPac) {
    let jetpac = new JetPac();
    jetpac.run();
});

require.config({
    baseUrl: "out",
    paths: {
        "some": "JetPac"
    },
    waitSeconds: 15,
});
