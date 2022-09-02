const copyright = {
    init: function () {
        console.log('copyright module loading');

        const date = new Date();

        const copyright = document.querySelector("#copyright");
        console.log(copyright);

        copyright.innerHTML = "Célia Tosic - " + date.getFullYear() + "";
    },
}