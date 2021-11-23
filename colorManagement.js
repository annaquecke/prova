//COLOR SETTING

var mainCol = "#A5FFBE";
var projectColorOf = function (prjID) {
    var col;
    $.ajax({
        url: "../database.json",
        async: false,
        dataType: 'json',
        success: function (data) {
            var prj = data.projects;
            var index = prj.map(function (obj) {
                return obj.id;
            }).indexOf(prjID);
            col = prj[index].color;
        }
    });
    return col
};

function setProjectColor() {
    var projectID = $('meta[name=projectID]').attr('content');
    if (projectID !== undefined) {
        var prjCol = projectColorOf(projectID);
        sessionStorage.setItem("pageCol", prjCol); // Set page color as the one of the project
        console.log("color should be set to " + prjCol);
    } else {
        sessionStorage.setItem("pageCol", mainCol); // Set page color as the one of the project
        console.log("undefined color, " + sessionStorage.setItem("pageCol", mainCol));
    }

}

$(window).on('load', function () {
    console.log("page loaded");
    setProjectColor();
    $(":root")[0].style.setProperty("--mainCol", sessionStorage.getItem("pageCol"));
    $('#fader').show().fadeOut(900);
});
