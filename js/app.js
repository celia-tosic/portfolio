const app = {
    init: function () {
        navbar.init();
        slider.init();
        copyright.init();
    },
}

document.addEventListener('DOMContentLoaded', app.init);