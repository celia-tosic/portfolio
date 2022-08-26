const navbar = {
    init: function () {
        console.log('navbar module loading');

        //On cible le menu burger et la barre de navigation
        navbar.burger = document.querySelector("#header-burger");
        navbar.nav = document.querySelector("#nav");

        //On écoute le clic sur le burger menu
        navbar.burger.addEventListener("click", navbar.show);
    },

    show: function(){
        navbar.nav.classList.add("active");
        navbar.burger.remove();
    },

    //Enlève la classe active à la navbar pour la faire disparaître lorqu'on clique sur les liens du menu
    removeSideBar: function(){
        navbar.navBar.classList.remove("active");
    },
}