const app = {
    init: function () {
        navbar.init();
        effect.init();
        console.log("ok");
    },
}

document.addEventListener('DOMContentLoaded', app.init);